'use strict';
const knex = require('../config/db_connect');
const date = require('date-and-time');
const logger = require('../config/logger');
const response = require('../helper/json_response');

const list_customers = async function (req, res) {
    const chat = await knex('chats')
        .select('chat_id', 'user_id', 'customer_id', 'name', 'email', 'flag_to')
        .groupBy('chat_id', 'user_id', 'customer_id', 'name', 'email', 'flag_to')
        .where({ flag_to: 'customer' })
    response.ok(res, chat);
}

const join_chat = async function (req) {
    try {
        const { user_id, username, email } = req;
        const now = new Date();
        const chatid = date.format(now, 'YYYYMMDDHHmmSSSmmSSS');
        const { customer_id } = await knex('customers').where('email', email).first();
        const chat = await knex('chats')
            .select('chat_id')
            .where({
                email: email,
                flag_to: 'customer',
                flag_end: 'N'
            });
        const chat_id = chat.length === 0 ? chatid : chat.chat_id;
        if (chat.length === 0) {
            await knex('chats')
                .insert([{
                    chat_id: chat_id,
                    message: 'join chat',
                    user_id: user_id,
                    name: username,
                    email: email,
                    channel: 'Chat',
                    customer_id: customer_id,
                    flag_to: 'customer',
                    status_chat: 'waiting',
                    flag_end: 'N',
                    date_create: knex.fn.now()
                }]);
        }

        await knex('chats').where({ email }).update({ user_id });
        const result = await knex('chats').where({ customer_id }).first();

        return result;
    }
    catch (error) {
        console.log(error);
        logger('sosmed/join_chat', error);
    }
}

const insert_message_customer = async function (req) {
    try {
        const {
            chat_id,
            customer_id,
            user_id,
            name,
            email,
            message,
            agent_handle
        } = req;

        const { date_assign } = await knex('chats').select('date_assign').where({ chat_id, customer_id }).first();

        await knex('chats')
            .insert([{
                chat_id,
                customer_id,
                user_id,
                name,
                email,
                message,
                agent_handle,
                channel: 'Chat',
                flag_to: 'customer',
                status_chat: 'open_chat',
                flag_end: 'N',
                date_create: knex.fn.now(),
                date_assign: date_assign,
                // page_id: '',
                // post_id: '',
                // comment_id: '',
                // reply_id: ''
            }]);

    }
    catch (error) {
        console.log(error);
        logger('sosmed/insert_message_customer', error);
    }
}

const insert_message_agent = async function (req) {
    try {
        const {
            chat_id,
            customer_id,
            user_id,
            name,
            email,
            message,
            agent_handle
        } = req;

        const { date_assign } = await knex('chats').select('date_assign').where({ chat_id, customer_id }).first();

        await knex('chats')
            .insert([{
                chat_id,
                customer_id,
                user_id,
                name,
                email,
                message,
                agent_handle,
                channel: 'Chat',
                flag_to: 'agent',
                status_chat: 'open_chat',
                flag_end: 'N',
                date_create: knex.fn.now(),
                date_assign: date_assign,
                // page_id: '',
                // post_id: '',
                // comment_id: '',
                // reply_id: ''
            }]);

    }
    catch (error) {
        console.log(error);
        logger('sosmed/insert_message_agent', error);
    }
}

module.exports = {
    list_customers,
    join_chat,
    insert_message_customer,
    insert_message_agent,
}