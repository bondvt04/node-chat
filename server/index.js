//var server = require("./server");
//
//server.start();

var http = require('http');

http.createServer(function(request, response) {
    response.writeHead(200, {'content-type':'text/plain'});
    response.end("Hello, Universe!\n\n");
}).listen(8124);

console.log('Run on 8124');