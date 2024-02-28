const socketMethods = require('../methods/socketMethods')


var socketRoutes = (socket) => {
    console.log('New client connected');
    socket.on('sendMessage', (query) => socketMethods.sendMessage(socket, query));
}

module.exports=socketRoutes