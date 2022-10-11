const knex = require('../../config/db_connect');
const logger = require('../../helper/logger');

const facebook_token = async function (req, res) {
    try {
        if (req.method !== 'POST') return res.status(405).end('Method not Allowed');
        const data = req.body;

        for (let i = 0; i < data.length; i++) {
            const check = await knex('sosmed_channels')
                .count('page_id as jml')
                .where({ page_id: data[i].id, channel: 'Facebook' })
                .first();

            if (check.jml > 0) {
                await knex('sosmed_channels')
                    .where({ page_id: data[i].id, channel: 'Facebook' })
                    .update({
                        page_name: data[i].name,
                        page_category: data[i].category,
                        channel: 'Facebook',
                        account_id: data[i].id,
                        token: data[i].access_token,
                        token_secret: '',
                        user_secret: '',
                        updated_at: knex.fn.now(),
                    })
            }
            else {
                await knex('sosmed_channels')
                    .insert({
                        page_id: data[i].id,
                        page_name: data[i].name,
                        page_category: data[i].category,
                        channel: 'Facebook',
                        account_id: data[i].id,
                        token: data[i].access_token,
                        token_secret: '',
                        user_secret: '',
                        created_at: knex.fn.now(),
                    })
            }
        }
        res.json({
            status: 'success',
            total_data: data.length
        });
        res.end();
    }
    catch (error) {
        console.log(error);
        logger('hooks/facebook_token', error);
        res.status(500).end();
    }
}

const facebook_messenger = async function (req, res) {
    try {
        if (req.method !== 'POST') return res.status(405).end('Method not Allowed');

        // console.log(req.body.entry[0]);

        res.json(req.body);
        res.end();
    }
    catch (error) {
        console.log(error);
        logger('hooks/facebook_token', error);
        res.status(500).end();
    }
}

const facebook_mention = async function (req, res) {
    try {
        if (req.method !== 'POST') return res.status(405).end('Method not Allowed');

        console.log(req.body);

        res.end();
    }
    catch (error) {
        console.log(error);
    }
}

const facebook_feed = async function (req, res) {
    try {
        if (req.method !== 'POST') return res.status(405).end('Method not Allowed');

        console.log(req.body);

        res.end();
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = { facebook_token, facebook_messenger, facebook_feed, facebook_mention }