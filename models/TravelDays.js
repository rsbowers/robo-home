var keystone = require('keystone'),
    Types = keystone.Field.Types;

var TravelDay = new keystone.List('TravelDay');

TravelDay.add({
  name: { type: Types.Text, label: 'Name', required: true, initial: true },
  day: { type: Types.Text, label:'Day', required: true, initial: true },
  trip: { type: Types.Text, label:'Trip ID', required: true, initial: true }
});

TravelDay.register();
