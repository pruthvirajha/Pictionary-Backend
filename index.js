var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


var subscribers = new Set();

app.get('/', (req, res) => {
    res.sendfile(__dirname + '/index.html');
});

http.listen(3000, () => {
    console.log('Listening on *: 3000');
});

io.on('connection', (socket) => {
    let clientId = socket.client.id;

    console.log('User connected with Id ' + clientId);
    subscribers.add(clientId);

    socket.on('disconnect', () => {
        subscribers.delete(clientId);
        console.log("subscribers after removal " + subscribers);
    });

    socket.on('chat_message', (message) => {
        console.log('The message is: ' + message);
    });
});
