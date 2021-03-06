var restify = require('restify');
var builder = require('botbuilder');

(function () {
'use strict';

const LINE_URL = 'https://trialbot-api.line.me';
const LINE_CHANNEL_ID = process.env['LINE_CHANNEL_ID'];
const LINE_CHANNEL_SECRET = process.env['LINE_CHANNEL_SECRET'];
const LINE_MID = process.env['LINE_MID'];

function sendToLine(data) {
	let client = restify.createJsonClient({
		url: LINE_URL,
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
			'X-Line-ChannelID': LINE_CHANNEL_ID,
			'X-Line-ChannelSecret': LINE_CHANNEL_SECRET,
			'X-Line-Trusted-User-With-ACL': LINE_MID
		}
	});
	client.post('/vi/events', data, (err, req, res, obj) => {
	});
}

function fromLine(req, res, next) {
	const EVENT_SEND = '138311608800106203';
	console.log('Called from line');
	let message = req.body.result[0];
	console.dir(message.content);
	let response = {
		'to':[ message.content.from ],
		'toChannel': message.fromChannel,
		'eventType': EVENT_SEND,
		'content': message.content
	};
	// sendToLine(response);
	res.send(200);
	next();
}

var bot = new builder.BotConnectorBot({ appId: 'YourAppId', appSecret: 'YourAppSecret' });
bot.add('/', function (session) {
	console.log('msg: ' + session.message.text);
	session.send('Hello World');
});


var server = restify.createServer();
server.use(restify.bodyParser());

server.get('/hello/:name', (req, res, next) => {
	res.send('hello' + req.params.name);
	next();
});
server.post('/linebot', fromLine);

server.post('/api/messages', bot.verifyBotFramework(), bot.listen());

var port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(server.name + 'listening on ' + server.url);
	console.log('LINE_CHANNEL_ID: ' + LINE_CHANNEL_ID);
});

})();
