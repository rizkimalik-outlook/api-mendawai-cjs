'use strict';
const path = require('path');
const date = require('date-and-time');
const knex = require('../../config/db_connect');
const logger = require('../../helper/logger');
const response = require('../../helper/json_response');
const { UploadAttachment } = require('../upload_controller');

//? HTTP FUNCTION
const join_chat = async function (req, res) {
    try {
        const data = req.body;

        if (data.email && data.flag_to === 'customer') {
            const result = await customer_join(data);
            response.ok(res, result);
        }
        else if (data.username && data.flag_to === 'agent') {
            const result = await agent_join(data);
            response.ok(res, result);
        }
        else {
            response.error(res, 'error', 'chat/join_chat');
        }

    }
    catch (error) {
        console.log(error);
        logger('chat/join_chat', error);
    }
}

const list_customers = async function (req, res) {
    const { agent } = req.query;

    const list_customers = await knex.raw(`
        SELECT a.chat_id,a.customer_id,b.name,a.email,a.agent_handle,b.uuid as uuid_customer,b.connected, c.uuid as uuid_agent,
        (select count(*) from chats WHERE flag_to='customer' AND chat_id=a.chat_id and flag_notif is null) as total_chat 
        FROM chats a
        LEFT JOIN mcustomer b ON a.email=b.email
        LEFT JOIN msuser c ON a.agent_handle=c.username
        WHERE a.flag_end='N' AND a.flag_to='customer' AND a.agent_handle='${agent}' 
        GROUP BY a.chat_id,a.customer_id,b.name,a.email,a.agent_handle,b.uuid,b.connected,c.uuid
        ORDER BY b.connected DESC
    `); 

    response.ok(res, list_customers);
}

const conversation_chats = async function (req, res) {
    try {
        const { chat_id, customer_id } = req.body;

        await knex('chats').update({ flag_notif: '1' }).where({ chat_id, customer_id }); //flag read notif
        const conversations = await knex('chats')
            .select('chat_id', 'customer_id', 'name', 'email', 'flag_to', 'message', 'date_create', 'channel', 'flag_notif','file_name','file_type','file_size','file_url', 'file_origin')
            .where({ chat_id, customer_id, flag_end: 'N' })
            .orderBy('id', 'asc')

        for (let i = 0; i < conversations.length; i++) {
            conversations[i].date_create = conversations[i].date_create.toISOString().replace(/T/, ' ').replace(/\..+/, '');
            // conversations[i].date_create = date.format(conversations[i].date_create, 'YYYY-MM-DD HH:mm:ss')
        }
        response.ok(res, conversations);
    }
    catch (error) {
        console.log(error);
        logger('chat/conversation_chats', error);
    }
}

const end_chat = async function (req, res) {
    try {
        const { chat_id, customer_id } = req.body;
        const res_endchat = await knex.raw(`
            UPDATE chats SET flag_end='Y' WHERE chat_id='${chat_id}' AND customer_id='${customer_id}'
            -- INSERT INTO chats_end SELECT * FROM chats WHERE flag_end='Y'
            -- DELETE chats WHERE flag_end='Y'
        `);
        response.ok(res, res_endchat);
    }
    catch (error) {
        console.log(error);
        logger('chat/end_chat', error);
    }

}

const history_chats = async function (req, res) {
    //history chat status end
    try {
        const { chat_id, customer_id } = req.body;

        await knex('chats').update({ flag_notif: '1' }).where({ chat_id, customer_id }); //flag read notif
        const conversations = await knex('chats')
            .select('chat_id', 'customer_id', 'name', 'email', 'flag_to', 'message', 'date_create', 'channel', 'flag_notif')
            .where({ chat_id, customer_id, flag_end: 'N' })
            .orderBy('id', 'asc')

        for (let i = 0; i < conversations.length; i++) {
            conversations[i].date_create = conversations[i].date_create.toISOString().replace(/T/, ' ').replace(/\..+/, '');
            // conversations[i].date_create = date.format(conversations[i].date_create, 'YYYY-MM-DD HH:mm:ss')
        }
        response.ok(res, conversations);
    }
    catch (error) {
        console.log(error);
        logger('chat/history_chats', error);
    }
}


//? NON HTTP FUNCTION
const customer_join = async function (data) {
    const now = new Date();
    const generate_chatid = date.format(now, 'YYYYMMDDHHmmSSSmmSSS');
    const generate_customerid = date.format(now, 'YYMMDDHHmmSS');

    const customer = await knex('mcustomer').select('customerid').where({ email: data.email }).first();
    const customer_id = customer ? customer.customerid : generate_customerid;

    if (!customer) {
        await knex('mcustomer')
            .insert([{
                customerid: customer_id,
                name: data.username,
                email: data.email,
                uuid: data.uuid,
                connected: data.connected,
                sourcecreate: 'Chat',
                status: 'Initialize',
                datecreatecustomer: knex.fn.now()
            }]);
    }
    else {
        await knex('mcustomer').update({ uuid: data.uuid, connected: data.connected }).where({ email: data.email });
    }

    const chat = await knex('chats').select('chat_id')
        .where({
            email: data.email,
            flag_to: 'customer',
            status_chat: 'waiting',
            flag_end: 'N',
            channel: 'Chat',
        }).first();

    const chat_id = chat ? chat.chat_id : generate_chatid;
    if (!chat) {
        await knex('chats')
            .insert([{
                chat_id: chat_id,
                message: 'Joined Chat',
                name: data.username,
                email: data.email,
                channel: 'Chat',
                customer_id: customer_id,
                flag_to: 'customer',
                status_chat: 'waiting',
                flag_end: 'N',
                date_create: knex.fn.now()
            }]);
    }

    // get result data & send
    const result = await knex('chats')
        .where({
            email: data.email,
            flag_to: 'customer',
            // status_chat: 'open',
            flag_end: 'N',
            channel: 'Chat',
        }).first();

    if (result) {
        const user = await knex('msuser').select('uuid').where({ username: result.agent_handle }).first();
        const cust = await knex('mcustomer').select('uuid').where({ email: data.email }).first();
        result.uuid_agent = user?.uuid;
        result.uuid_customer = cust?.uuid;
    }

    return result;
}

const agent_join = async function (data) {
    const user = await knex('msuser').select('username').where({ username: data.username }).first();

    if (user) {
        await knex('msuser')
            .update({ uuid: data.uuid, connected: data.connected, login: '1' })
            .where({ username: data.username, leveluser: 'Layer 1' });
    }

    return user;
}

const send_message_customer = async function (req) {
    try {
        const {
            chat_id,
            customer_id,
            name,
            email,
            message,
            agent_handle,
            file_origin, 
            file_name, 
            file_url, 
            file_size,
            attachment
        } = req;
        const file_type = file_name ? path.extname(file_name) : null;

        await knex('chats')
            .insert([{
                chat_id,
                customer_id,
                name,
                email,
                message,
                agent_handle,
                file_origin, 
                file_name, 
                file_type, 
                file_url, 
                file_size,
                channel: 'Chat',
                flag_to: 'customer',
                status_chat: 'open',
                flag_end: 'N',
                date_create: knex.fn.now()
            }]);

        //upload file attachment
        if (attachment) {
            await UploadAttachment(attachment,file_name, file_size);
        }

    }
    catch (error) {
        console.log(error);
        logger('chat/send_message_customer', error);
    }
}

const send_message_agent = async function (req) {
    try {
        const {
            chat_id,
            customer_id,
            name,
            email,
            message,
            agent_handle,
            file_origin, 
            file_name, 
            file_url, 
            file_size,
            attachment
        } = req;
        const file_type = file_name ? path.extname(file_name) : null;

        await knex('chats')
            .insert([{
                chat_id,
                customer_id,
                name,
                email,
                message,
                agent_handle,
                file_origin, 
                file_name, 
                file_type, 
                file_url, 
                file_size,
                channel: 'Chat',
                flag_to: 'agent',
                status_chat: 'open',
                flag_end: 'N',
                date_create: knex.fn.now()
            }]);

        //upload file attachment
        if (attachment) {
            await UploadAttachment(attachment,file_name, file_size);
        }

    }
    catch (error) {
        console.log(error);
        logger('chat/send_message_agent', error);
    }
}

const update_socket = async function (data) {
    try {
        if (data.flag_to === 'customer') {
            await knex('mcustomer')
                .update({ uuid: data.uuid, connected: data.connected })
                .where({ email: data.email });
        }
        else {
            await knex('msuser')
                .update({ uuid: data.uuid, connected: data.connected })
                .where({ username: data.username, leveluser: 'Layer 1' });
        }
    }
    catch (error) {
        console.log(error);
        logger('chat/update_socket', error);
    }
}

module.exports = {
    list_customers,
    join_chat,
    send_message_customer,
    send_message_agent,
    conversation_chats,
    end_chat,
    update_socket,
    history_chats,
}
