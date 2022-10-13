'use strict';
// const knex = require('../config/db_connect');
const logger = require('../helper/logger');
const response = require('../helper/json_response');

const send_message_cust = function (req, res, io) {
    try {
        const data = req.body;
        io.to(data.agent_handle).emit('send-message-customer', data);
        response.ok(res, data);
    } catch (error) {
        console.log(error);
        logger('blending/send_message_cust', error);
    }
}

const send_message_agent = function (req, res, io) {
    try {
        const data = req.body;
        io.to(data.email).emit('send-message-agent', data);
        response.ok(res, data);
    } catch (error) {
        console.log(error);
        logger('blending/send_message_cust', error);
    }
}

const queing_chat = function (req, res, io) {
    try {
        const data = req.body;
        io.to(data.email).emit('queing', data);
        response.ok(res, data);
    } catch (error) {
        console.log(error);
        logger('blending/send_message_cust', error);
    }
}

const send_message_whatsapp = function (req, res, io) {
    try {
        const data = req.body;
        io.to(data.agent_handle).emit('return-message-whatsapp', data);
        response.ok(res, data);
    } catch (error) {
        console.log(error);
        logger('blending/send_message_whatsapp', error);
    }
}

module.exports = {
    send_message_cust,
    send_message_agent,
    queing_chat,
    send_message_whatsapp,
}
