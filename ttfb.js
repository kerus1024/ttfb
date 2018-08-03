process.title = 'TTFB Checker';
const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');

const ttfbRequest = require('./request.js');

http.createServer((request, response) => {

    const parsedUrl = url.parse(request.url);
    const parsedQuery = querystring.parse(parsedUrl.query, '&', '=');

    if (!parsedQuery.url) {

      fs.readFile('./inputForm.html', (error, content) => {
        response.writeHead(200, {
          'Content-Type': 'text/html; charset=UTF-8'
        });
        response.end(content, 'utf-8');
      });

    } else {

      try {

        ttfbRequest.request(parsedQuery.url, data => {

          const timeMap = data;

          response.writeHead(200, {
            'Content-Type': 'application/json; charset=UTF-8'
          });
          response.write(JSON.stringify(timeMap));
          response.end();

        });

      } catch (e) {
        response.write(e.message);
        response.end();
      }

    }

  })
  //.listen(7777, '127.0.0.1'); 
  .listen(4446, '127.0.0.1');