var fs = require("fs");
var https = require("https");

var privateKey = fs.readFileSync(__dirname+'/../ssl/site.key').toString();
var certificate = fs.readFileSync(__dirname+'/../ssl/final.crt').toString();

//console.log(privateKey+"\n");
//console.log(certificate+"\n");

https.createServer({
    key : privateKey,
    cert : certificate
}, function(request, response) {
    response.writeHead(200);
    response.end("Ololo\n");
}).listen("8124", "192.168.0.141", function(){
    console.log("Server up and running...");
});
