const { spawn } = require('child_process');

var socketMethods = {
    sendMessage: async (socket, query)  =>  {
        let message = query.message;
        let botName  = query.botName
        const pythonProcess = spawn('python3', ['python/chat.py', message, botName]);
         pythonProcess.stdout.on('data', (data) => {
            socket.emit('newMessage', data);
        });

    }
}

module.exports = socketMethods;