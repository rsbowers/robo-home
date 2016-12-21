var cron = require('node-cron');
var request = require('request');
var phillipsBridge = require('./../phillips-bridge');
var serverConfig = require('../../server.json');
var moment = require('moment');
var Agenda = require('agenda');

function LightTraveler() {
    this.setCronJobs = this.setCronJobs.bind(this);
    this.cancelCronJobs = this.cancelCronJobs.bind(this);
    this.fetchItinerary = this.fetchItinerary.bind(this);
    this.parseTrips = this.parseTrips.bind(this);
    this.addTravelDays = this.addTravelDays.bind(this);
    this.fetchExistingTravelDays = this.fetchExistingTravelDays.bind(this);
    this.insertNewTravelDays = this.insertNewTravelDays.bind(this);
    this.resetTravelDayData = this.resetTravelDayData.bind(this);
    this.createLightAgenda = this.createLightAgenda.bind(this);
    this.fetchLightRules = this.fetchLightRules.bind(this);
    this.resetTravelDayData();
}

LightTraveler.prototype.init = function() {
    // Agenda Init
    this.agenda = new Agenda({
        db: {
            address: serverConfig.mongoAddr + ':' + serverConfig.mongoPort + '/robohome',
            collection: 'lights'
        }
    }, function(err) {

        // Agenda connection error
        if (err) {
            console.log(err);
            throw err;
        }

        lightTraveler.agenda.emit('ready');

        lightTraveler.agenda.define('lightEvent', function(job, done) {
            var jobTime = job.attrs.data.time;
			var nowTime = moment(new Date());
            console.log('lightEvent encountered : ' + nowTime.diff(jobTime,'minutes'));
            var toggle = false;
            if(nowTime.diff(jobTime,'minutes') < 1) {
                toggle = true;
            } else if(moment(nowTime).isBetween(job.attrs.data.start,job.attrs.data.end)) {
                toggle = true;
            }
            if(toggle) {
                console.log('turn lights ' + job.attrs.data.state);
                phillipsBridge.toggleLights(job.attrs.data.state);
            }
            done();
        });

        lightTraveler.agenda.start();

        lightTraveler.createLightAgenda();
        // lightTraveler.fetchItinerary();
        lightTraveler.setCronJobs();

        return;

    }); // end agenda init
}

LightTraveler.prototype.setCronJobs = function() {
    console.log('setCronJobs : scheduling cron for web services');

    lightTraveler.travelCron = cron.schedule('0 * * * *', function() {
        lightTraveler.fetchItinerary();
    });
}

LightTraveler.prototype.cancelCronJobs = function() {
    console.log('cancelCronJobs : canceling cron for web services');

    if (lightTraveler.travelCron) lightTraveler.travelCron.destroy();
}

LightTraveler.prototype.fetchItinerary = function() {
    console.log('fetchItinerary');

    request(serverConfig.keystoneAddr + ':' + serverConfig.keystonePort + '/api/trips', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            lightTraveler.tripsToParse = data.response.Trip;
            lightTraveler.parseTrips();
        }
    })
}

LightTraveler.prototype.parseTrips = function() {
    for (var i = 0; i < lightTraveler.tripsToParse.length; i++) {
        var trip = lightTraveler.tripsToParse[i];
        for (var m = moment(trip.start_date); m.isBefore(trip.end_date); m.add('days', 1)) {
            lightTraveler.newTravelDays.push(m.format('YYYY-MM-DD'));
            lightTraveler.newTravelDayDetails[m.format('YYYY-MM-DD')] = {
                'day': m.format('YYYY-MM-DD'),
                'start_date': trip.start_date,
                'end_date': trip.end_date,
                'primary_location': trip.primary_location,
                'id': trip.id
            }
        }
    }
    lightTraveler.addTravelDays();
}

LightTraveler.prototype.addTravelDays = function() {
    lightTraveler.fetchExistingTravelDays(function(data) {
        for (var i = 0; i < data.length; i++) {
            lightTraveler.existingTravelDays.push(data[i].day);
            lightTraveler.existingTravelDayDetails[data[i].day] = data[i];
        }
        lightTraveler.insertNewTravelDays();
    })
}

LightTraveler.prototype.fetchExistingTravelDays = function(callback) {
    request(serverConfig.keystoneAddr + ':' + serverConfig.keystonePort + '/api/travelday/list', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            callback(data);
        }
    })
}

LightTraveler.prototype.insertNewTravelDays = function() {
    var log = [];
    for (var i = 0; i < lightTraveler.newTravelDays.length; i++) {
        var day = lightTraveler.newTravelDays[i];
        var travelDay = lightTraveler.newTravelDayDetails[day];
        if (lightTraveler.existingTravelDays.indexOf(day) > -1) {
            console.log('nope it exists already', travelDay.day);

            // Checking if we are done
            log.push(travelDay.day);
            if(log.length == lightTraveler.newTravelDays.length) {
                lightTraveler.createLightAgenda();
            }
        } else {
            console.log('it a new one', travelDay.day);
            request.post({
                url: serverConfig.keystoneAddr + ':' + serverConfig.keystonePort + '/api/travelday/add',
                form: {
                    primary_location: travelDay.primary_location,
                    day: travelDay.day,
                    trip: travelDay.id
                }
            }, function(error, response, body) {

                // Checking if we are done
                log.push(travelDay.day);
                if(log.length == lightTraveler.newTravelDays.length) {
                    lightTraveler.createLightAgenda();
                }
                if (error) {
                    throw error;
                }
                console.log(body);
            });
        }
    }
}

LightTraveler.prototype.resetTravelDayData = function() {
    this.newTravelDays = [];
    this.newTravelDayDetails = {};
    this.existingTravelDays = [];
    this.existingTravelDayDetails = {};
    this.lightAgenda = [];
}

LightTraveler.prototype.createLightAgenda = function() {

    this.agenda.cancel({
        name: 'lightEvent'
    }, function(err, numRemoved) {
        console.log(numRemoved + ' events removed');
    });

    lightTraveler.fetchExistingTravelDays(function(data) {
        lightTraveler.fetchLightRules(function(lightRules) {
            for (var i = 0; i < data.length; i++) {
                var day = data[i].day;
                for (var j = 0; j < lightRules.length; j++) {
                    var rule = lightRules[j];
                    var start = new Date(moment(day + ' ' + rule.start,'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm'));
                    var end = new Date(moment(day + ' ' + rule.end,'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm'));
                    console.log(start + ' - ' + end);

                    // Agenda schedule start event
                    lightTraveler.agenda.schedule(
                        start,
                        'lightEvent', {
                            state: true,
                            time: start,
                            start: start,
                            end: end,
                            type: 'lightEvent'
                        }
                    );

                    // Agenda schedule start event
                    lightTraveler.agenda.schedule(
                        end,
                        'lightEvent', {
                            state: false,
                            time: end,
                            start: start,
                            end: end,
                            type: 'lightEvent'
                        }
                    );
                }
            }
        });
    });
}

LightTraveler.prototype.fetchLightRules = function(callback) {
    request(serverConfig.keystoneAddr + ':' + serverConfig.keystonePort + '/api/lightrule/list', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            callback(data);
        }
    })
}

var lightTraveler = new LightTraveler();

module.exports = lightTraveler;
