var app = require('http').createServer();
var io = require('socket.io').listen(app);
var fs = require('fs');

app.listen(7777);
var serverName = '<b style="color:blue">SERVER</b>';

io.sockets.on('connection', function(socket) {
    console.log('new user connected...');

    socket.on('addme', function(username) {
        socket.username = username;
        socket.emit('chat', serverName, 'You have connected');
        socket.broadcast.emit('chat', serverName, username + ' is on deck :)');
    });

    socket.on('sendchat', function(data) {
        socket.emit('chat', socket.username, data);
    });

    socket.on('disconnect', function() {
        io.sockets.emit('chat', serverName, socket.username + ' has left the building...');
    });
});

console.log('start server...');
//file:///Users/anatoliybondar/www/node-chat/client/index.html