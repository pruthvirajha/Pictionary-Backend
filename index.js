var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendfile(__dirname + '/index.html');
});

http.listen(3000, () => {
    console.log('Listening on *: 3000');
});

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('chat_message', (message) => {
        console.log('The message is: ' + message);
    });
});