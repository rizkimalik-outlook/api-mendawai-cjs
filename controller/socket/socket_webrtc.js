'use strict';

const { insert_call, update_call } = require("../omnichannel/call");

//? socket.broadcast.emit = public chat
//? socket.to(room).emit = private chat
module.exports = function (socket) {
    // socket.join(socket.username);

    socket.on('call', async (data) => {
        let callee = data.username;
        let rtcMessage = data.rtcMessage;
        let call = await insert_call(data);
        // console.log(call) //call_id,customerid,email,agent,call_start,call_end,talk_time

        socket.to(callee).emit("newCall", {
            call_id: call.call_id,
            customer_id: call.customerid,
            email: call.email,
            agent: call.agent,
            caller: socket.username,
            rtcMessage: rtcMessage
        })
    });

    socket.on('answerCall', (data) => {
        let caller = data.caller;
        let rtcMessage = data.rtcMessage

        socket.to(caller).emit("callAnswered", {
            callee: socket.username,
            rtcMessage: rtcMessage
        })

    })

    socket.on('hangup', async (data) => {
        let otherUser = data.username;
        let rtcMessage = data.rtcMessage;
        await update_call(data);

        socket.to(otherUser).emit("return-hangup", {
            sender: socket.username,
            rtcMessage: rtcMessage,
        })
    })

    socket.on('ICEcandidate', (data) => {
        let otherUser = data.username;
        let rtcMessage = data.rtcMessage;

        socket.to(otherUser).emit("ICEcandidate", {
            sender: socket.username,
            rtcMessage: rtcMessage
        })
    })

}