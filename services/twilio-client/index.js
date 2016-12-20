var accountSid = 'AC9cdfc969fa5f57d03ee3fe399e892a0f'; // Your Account SID from www.twilio.com/console
var authToken = 'cc273940d2de48bbdf897cd8193f3d0f';   // Your Auth Token from www.twilio.com/console
var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

function TwilioClient() {
    this.sendMessage = this.sendMessage.bind(this);
}

TwilioClient.prototype.sendMessage = function(body) {
    client.messages.create({
        body: body,
        to: '+14042109285',  // Text this number
        from: '+14046204977' // From a valid Twilio number
    }, function(err, message) {
        console.log(message.sid);
    });
}

var twilioClient = new TwilioClient();

module.exports = twilioClient;
