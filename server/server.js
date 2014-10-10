var fs = require('fs');
var colors = require('colors');
var path = require('path');
var mime = require('mime');

console.log(__dirname);

var app = require('https').createServer({
    key : fs.readFileSync(__dirname+'/../ssl/site.key').toString(),
    cert : fs.readFileSync(__dirname+'/../ssl/final.crt').toString()
}, function(request, response) {
    var pathname = __dirname+"/../"+request.url;
    console.log("##### ", pathname);

    path.exists(pathname, function(exists) {
        console.log("===== ", exists);
        if(!exists) {
            response.writeHead(404);
            response.write("Bad request 404\n");
            response.end();
            return;
        }

        fs.stat(pathname, function(err, stats) {
            if(err) {
                response.writeHead(404);
                response.write("Bad request 404\n");
                response.end();
                return;
            }

            if(!stats.isFile()) {
                response.writeHead(403);
                response.write("Directory access is forbidden\n");
                response.end();
                return;
            }

            //response.setHeader('Content-Type', 'text/html');
            response.setHeader('Content-Type', mime.lookup(pathname));
            response.statusCode = 200;

            var file = fs.createReadStream(pathname);
            file.on("open", function() {
                file.pipe(response);
            });
            file.on("error", function(err) {
                console.error(err);
            });
        });
    });


    //fs.readFile(__dirname+'/../client/index.html', function(err, data) {
    //    if(err) {
    //        console.log(__diname);
    //        response.writeHead(500);
    //        return response.end('Error loading index.html');
    //    }
    //
    //    //response.setHeader('Access-Control-Allow-Origin', "https://"+request.headers.host+':7777');
    //    //response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    //    //response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    //
    //    //response.writeHead(200, {"Access-Control-Allow-Origin": "*"});
    //    response.writeHead(200);
    //
    //    response.end(data);
    //});
})

try {
    app.listen("7777", "192.168.0.141", function(){
        console.log("Server up and running...".rainbow.bold.underline);
        //console.log("Server up and running...");
    });
} catch(e) {
    console.log("### Error");
}

//try {
//    app.listen(443);
//} catch(e) {
//    console.log("### Error");
//}

if(true) {
    try {
        var io = require('socket.io').listen(app);
        io.set('origins', '*:*');

        var serverName = '<b style="color:blue">SERVER</b>';

        io.sockets.on('connection', function(socket) {
            console.log('new user connected...');

            socket.on('addme', function(username) {
                console.log("addme", username);

                socket.username = username;
                socket.emit('chat', serverName, 'You have connected');
                socket.broadcast.emit('chat', serverName, username + ' is on deck :)');
            });

            socket.on('sendchat', function(data) {
                console.log("sendchat", data);

                io.sockets.emit('chat', socket.username, data);
            });

            socket.on('disconnect', function() {
                io.sockets.emit('chat', serverName, socket.username + ' has left the building...');
            });
        });
    } catch(e) {
        console.log("### Error");
    }
}

