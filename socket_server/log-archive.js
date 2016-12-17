var fs = require('fs-extra')
	, path = require('path')
	, moment = require('moment-timezone');

var pathToLogs = 'logs';
var pathToArchive = 'logs-archive';
var today = moment(new Date).format('YYYYMMDD');

var files = fs.readdirSync(pathToLogs).forEach(function (fileName) {
	if (fileName !== '.DS_Store') {
		var fileToMove = path.join(pathToLogs, fileName);
		var fileToArchive = path.join(pathToArchive, today + '-' + fileName);
		fs.writeFileSync(fileToArchive, fs.readFileSync(fileToMove));
		fs.writeFileSync(fileToMove, '');
	}
});
