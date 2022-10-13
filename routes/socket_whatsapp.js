'use strict';

module.exports = function (socket) {
    socket.on('return-message-whatsapp', (data) => {
        socket.to(data.agent_handle).emit('return-message-whatsapp', data); //notused
    });

}