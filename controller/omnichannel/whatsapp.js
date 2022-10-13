const knex = require('../../config/db_connect');
const date = require('date-and-time');
const axios = require('axios');
const { response, logger, file_manager } = require('../../helper');
const WA_API_URL = process.env.WA_API_URL;
const WA_API_KEY = process.env.WA_API_KEY;

const whatsapp_webhook = async function (req, res) {
    try {
        if (req.method !== 'POST') return res.status(405).end('Method not Allowed');
        const data = req.body;
        const now = new Date();
        const generate_chatid = date.format(now, 'YYYYMMDDHHmmSSSmmSSS');
        const customer_id = await insert_customer(data);

        const chat = await knex('tChat').select('chat_id', 'agent_handle')
            .where({
                user_id: data.sender_phone,
                flag_to: 'customer',
                flag_end: 'N',
                channel: 'Whatsapp',
            }).first();

        const chat_id = chat ? chat.chat_id : generate_chatid;
        await knex('tChat')
            .insert([{
                chat_id: chat_id,
                user_id: data.sender_phone,
                message: data.message_text,
                message_type: data.message_type,
                name: data.sender_push_name,
                email: data.sender_phone,
                // agent_handle: chat.agent_handle,
                post_id: data.message_id,
                channel: 'Whatsapp',
                customer_id: customer_id,
                flag_to: 'customer',
                status_chat: 'open',
                flag_end: 'N',
                date_create: data.message_timestamp
                // date_create: knex.fn.now()
            }]);

        if (data.message_type !== 'text') {
            data.channel = 'whatsapp';
            file_manager.DownloadAttachment(data);
        }
        response.ok(res, data);
    }
    catch (error) {
        console.log(error);
        logger('omnichannel/whatsapp', error);
        res.status(500).end();
    }
}

const whatsapp_sendmessage = async function (req, res) {
    try {
        if (req.method !== 'POST') return res.status(405).end('Method not Allowed');
        const data = req.body;

        await axios({
            url: `${WA_API_URL}/messages`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': WA_API_KEY,
            },
            data: JSON.stringify({
                recipient_type: "individual",
                to: data.user_id,
                type: data.message_type,
                text: {
                    body: data.message
                }
            }),
        })
            .then(async function (result) {
                // console.log(result.data);
                await insert_sendmessage(data)
                response.ok(res, result.data);
            })
            .catch(function (error) {
                console.log(error);
                logger('omnichannel/whatsapp', error);
                res.status(500).end();
            });

    }
    catch (error) {
        console.log(error);
        logger('omnichannel/whatsapp', error);
        res.status(500).end();
    }
}

// function non http
const insert_customer = async function (data) {
    const now = new Date();
    const generate_customerid = date.format(now, 'YYMMDDHHmmSS');

    const customer = await knex('mcustomer').select('customerid').where({ phonenumber: data.sender_phone, sourcecreate: 'Whatsapp' }).first();
    const customer_id = customer ? customer.customerid : generate_customerid;

    if (!customer) {
        await knex('mcustomer')
            .insert([{
                customerid: customer_id,
                name: data.sender_push_name,
                phonenumber: data.sender_phone,
                hp: data.sender_phone,
                sourcecreate: 'Whatsapp',
                status: 'Initialize',
                datecreatecustomer: knex.fn.now()
            }]);
    }
    return customer_id;
}

const insert_sendmessage = async function (data) {
    await knex('tChat')
        .insert([{
            chat_id: data.chat_id,
            user_id: data.user_id,
            customer_id: data.customer_id,
            message: data.message,
            message_type: data.message_type,
            name: data.name,
            email: data.email,
            agent_handle: data.agent_handle,
            channel: 'Whatsapp',
            flag_to: 'agent',
            status_chat: 'open',
            flag_end: 'N',
            date_create: knex.fn.now()
        }]);
}

module.exports = {
    whatsapp_webhook,
    whatsapp_sendmessage,
}