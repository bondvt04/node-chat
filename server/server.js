var fs = require('fs');

var app = require('https').createServer({
    key : fs.readFileSync(__dirname+'/../ssl/site.key').toString(),
    cert : fs.readFileSync(__dirname+'/../ssl/final.crt').toString()
}, function(request, response) {
    console.log();
    fs.readFile(__dirname+'/../client/index.html', function(err, data) {
        if(err) {
            console.log(__diname);
            response.writeHead(500);
            return response.end('Error loading index.html');
        }

        //response.setHeader('Access-Control-Allow-Origin', "https://"+request.headers.host+':7777');
        //response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        //response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        //response.writeHead(200, {"Access-Control-Allow-Origin": "*"});
        response.writeHead(200);

        response.end(data);
    });
}).listen("7777", "192.168.0.141", function(){
    console.log("Server up and running...");
});


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

//console.log('start server...');
//file:///Users/anatoliybondar/www/node-chat/client/index.html