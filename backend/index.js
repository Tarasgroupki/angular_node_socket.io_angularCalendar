let express = require('express');
let app = express();
let socket = require('socket.io');
let connection = require('./common/connection');

let server = app.listen(3000, () => {
    console.log('Listening...');
});

let socketIo = socket(server);

socketIo.on('connection', (socket) => {
    console.log('A connection has been created with' + socket.id)
    socket.on(connection.change, (changes) => {
        socketIo.sockets.emit(connection.change, changes);
    });
    socket.on(connection.create, (newData) => {
        socketIo.sockets.emit(connection.create, newData);
    });
    socket.on(connection.delete, (newData) => {
        socketIo.sockets.emit(connection.delete, newData);
    });
    socket.on(connection.notificationCount, () => {
        socketIo.sockets.emit(connection.notificationCount, 8);
    });
    socket.on(connection.addedNewUser, (id) => {
        socketIo.sockets.emit(connection.addedNewUser, 'User' + id + 'added');
    });
    socket.on(connection.updatedUser, (id) => {
        socketIo.sockets.emit(connection.updatedUser, 'User' + id + 'updated');
    });
    socket.on(connection.deletedUser, (id) => {
        socketIo.sockets.emit(connection.deletedUser, 'User' + id + 'deleted');
    });
});
