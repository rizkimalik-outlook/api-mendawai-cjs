'use strict';

const socket_chat = require("../controller/socket/socket_chat");
const socket_webrtc = require("../controller/socket/socket_webrtc");
const socket_whatsapp = require("../controller/socket/socket_whatsapp");
const { update_socket } = require("../controller/omnichannel/chat");

//? socket.broadcast.emit = public chat
//? socket.to(room).emit = private chat
module.exports = function (io) {
    //? middleware auth.username
    io.use((socket, next) => {
        const { flag_to, username, email } = socket.handshake.auth;
        if (!username) {
            const err = new Error("not authorized");
            next(err);
            // console.log(`⛔[${flag_to}]${username} - ${email} : ID ${socket.id}, not authorized`);
        }
        else {
            socket.username = username;
            socket.flag_to = flag_to;
            socket.email = email;
            next();
            console.log(`✅[${flag_to}] ${username} - ${email} : ID ${socket.id}, auth success`);
        }
    });

    io.on('connection', (socket) => {
        let users = {}
        users[socket.id] = socket.id;

        if (socket.flag_to === 'customer') {
            socket.join(socket.email);
        } else {
            socket.join(socket.username);
        }

        socket_chat(socket); //module chat
        socket_webrtc(socket); //module call webrtc
        socket_whatsapp(socket); //module whatsapp
      

        socket.on('disconnect', (res) => {
            const { username, flag_to, email } = socket.handshake.auth;
            if (username || email) {
                update_socket({ username, flag_to, email, uuid: socket.id, connected: socket.connected });
                socket.to(socket.id).emit('return-disconnect', 'disconnect');
            }
            delete users[socket.id];
            console.log(`⛔[${flag_to}] ${username} - ${email} : ID ${socket.id}, connected:${socket.connected}, ${res} `);
        });
    });



}