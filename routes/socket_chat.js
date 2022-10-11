'use strict';

const { 
    send_message_customer, 
    send_message_agent, 
    update_socket 
} = require("../controller/omnichannel/chat");

//? socket.broadcast.emit = public chat
//? socket.to(room).emit = private chat
module.exports = function (socket) {
    socket.on('join-chat', (data) => {
        if (data.flag_to === 'customer') {
            socket.to(data.uuid_agent).emit('return-join-chat', data);
        } else {
            socket.to(data.uuid_customer).emit('return-join-chat', data);
        }
        console.log(`${val.email}, join chat: ${val.chat_id}`);
    });

    
    socket.on('send-message-customer', (data) => {
        // console.table(data);
        // socket.to(data.uuid_agent).emit('return-message-customer', data);
        socket.to(data.agent_handle).emit('return-message-customer', data);
        if (data.status_chat === 'waiting') return;
        send_message_customer(data);
    });


    socket.on('send-message-agent', (data) => {
        // socket.to(data.uuid_customer).emit('return-message-agent', data);
        socket.to(data.email).emit('return-message-agent', data);
        send_message_agent(data);
    });


    socket.on('queing', (data) => {
        socket.to(data.email).emit('return-queing', data);
    });

    socket.on('typing', (data) => {
        if (data.flag_to === 'customer') {
            socket.to(data.agent_handle).emit('return-typing', data);
        } else {
            socket.to(data.email).emit('return-typing', data);
        }
    });

    socket.on('reconnect', (data) => {
        console.log(`recconnect ${data.email}`)
        socket.to(data.agent_handle).emit('return-reconnect', data);
        update_socket(data);
        
    });

}