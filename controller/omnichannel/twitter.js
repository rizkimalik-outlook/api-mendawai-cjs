const knex = require('../../config/db_connect');

const twitter_directmessage = async function (req, res) {
    try {
        if (req.method !== 'POST') return res.status(405).end('Method not Allowed');

        console.log(req.body);
        
        res.end();
    }
    catch (error) {
        console.log(error);
    }
}

const twitter_mention = async function (req, res) {
    try {
        if (req.method !== 'POST') return res.status(405).end('Method not Allowed');

        console.log(req.body);
        
        res.end();
    }
    catch (error) {
        console.log(error);
    }
}

const twitter_token = async function (req, res) {
    try {
        if (req.method !== 'POST') return res.status(405).end('Method not Allowed');

        const data = req.body;
        // for (let i = 0; i < data.length; i++) {
            const check = await knex('sosmed_channels')
                .count('page_id as jml')
                .where({ page_id: data.user_id, channel: 'Twitter' })
                .first();

            if (check.jml > 0) {
                await knex('sosmed_channels')
                .where({ page_id: data.user_id, channel: 'Twitter' })
                .update({
                    page_name: data.screen_name,
                    page_category: '',
                    channel: 'Twitter',
                    account_id: '',
                    token: data.oauth_token,
                    token_secret: data.oauth_token_secret,
                    user_secret: '',
                    updated_at: knex.fn.now(),
                })
            } 
            else {
                await knex('sosmed_channels')
                .insert({
                    page_id: data.user_id,
                    page_name: data.screen_name,
                    page_category: '',
                    channel: 'Twitter',
                    account_id: '',
                    token: data.oauth_token,
                    token_secret: data.oauth_token_secret,
                    user_secret: '',
                    created_at: knex.fn.now(),
                })
            }
        // }
        res.json({
            status: 'success',
            total_data: 1
        });
        res.end();
    }
    catch (error) {
        console.log(error);
        logger('hooks/twitter_token', error);
    }
}

module.exports = { twitter_token, twitter_directmessage, twitter_mention }


