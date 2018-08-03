const http = require('http');
const https = require('https');
const url = require('url');

module.exports = {

  request: (_url, callback) => {

	const myURL = _url;
	const parsedURL = url.parse(myURL);

	const timeMap = [];

	const options = {
		port: parsedURL.port ? parsedURL.port : (parsedURL.protocol === 'https:' ? 443 : 80),
		hostname: parsedURL.hostname,
		method: 'GET',
		path: parsedURL.path
	};

	timeMap.push(['init', new Date().getTime()]);

	const request = eval(parsedURL.protocol === 'https:' ? 'https' : 'http').request(options);
	//request.setSocketKeepAlive(false);
	//request.setTimeout(5000);
	request.end();

	request.on('socket', socket => {
		
		timeMap.push(['sock', new Date().getTime()]);

		socket.on('lookup', () => {
			timeMap.push(['lkup', new Date().getTime()]);
		});

		socket.on('connect', () => {
			timeMap.push(['conn', new Date().getTime()]);
		});

		socket.on('secureConnect', () => {
			timeMap.push(['secc', new Date().getTime()]);
		});

		socket.on('error', e => {
			timeMap.push(['erro', new Date().getTime(), e.code]);
		});

	});

	request.on('response', response => {
		timeMap.push(['resp', new Date().getTime()]);

		let receivedByte = 0;

		response.on('data', data => {
			timeMap.push(['data', new Date().getTime()]);

			receivedByte += data.length;

			if (typeof response.headers['content-length'] === 'string'){
				if (receivedByte >= parseInt(response.headers['content-length'])){
					response.destroy();
				}
			}

		});


	});

	request.on('timeout', () => {
		timeMap.push(['erro', new Date().getTime(), 'request timeout']);
		callback(timeMap);
	});

	request.on('close', () => {
		timeMap.push(['endo', new Date().getTime()]);
		callback(timeMap);
	});

	request.on('error', (e) => {
		timeMap.push(['erro', new Date().getTime(), e.code]);
	});

  }

}