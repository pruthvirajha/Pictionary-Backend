var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var config = require('./config');
var constants = require('./constants');

var subscribers = new Set();

app.get('/', (req, res) => {
    res.sendfile(__dirname + '/index.html');
});

http.listen(config.port, config.host, () => {
    console.log(`Server started on --> ${config.host}:${config.port}`);
});

io.on('connection', (socket) => {
    let clientId = socket.client.id;

    console.log('User connected with Id ' + clientId);
    subscribers.add(clientId);

    socket.on('disconnect', () => {
        subscribers.delete(clientId);
        console.log("subscribers after removal " + JSON.stringify([...subscribers]));
    });

    /*
        TODO:- chat_message event is simply a test event. Remove when no longer needed.
     */
    socket.on('chat_message', (message) => {
        console.log('The message is: ' + message);
        console.log('Message receive from client with ID:' + clientId);

        let receivers = getReceivers(clientId);
        broadcastEvent(receivers, 'chat_message', message);
    });

    socket.on(constants.event_send_coordinates, (payload) => {
        console.log(`Event Received: ${constants.event_send_coordinates} -- PAYLOAD is: ${JSON.stringify(payload)}`);
        let receivers = getReceivers(clientId);
        console.log(`Receivers: ${receivers}`);
        broadcastEvent(receivers, constants.event_receive_coordinates, payload);
    });
});

function getReceivers(sender_client_id) {
    console.log(`getReceivers called...`);
    return [...subscribers].filter(subscriber => subscriber !== sender_client_id);
}

function broadcastEvent(receivers, event, payload) {
    receivers.forEach(receiver => {
        io.sockets.to(receiver).emit(event, payload);
    });
}