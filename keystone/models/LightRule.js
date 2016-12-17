var keystone = require('keystone'),
    Types = keystone.Field.Types;

var LightRule = new keystone.List('LightRule');

LightRule.add({
  name: { type: Types.Text, label: 'Name', required: true, initial: true },
  start: { type: Types.Text, label:'Starting', required: true, initial: true },
  end: { type: Types.Text, label:'Ending', required: true, initial: true }
});

LightRule.register();
