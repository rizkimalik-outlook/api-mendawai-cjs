const knex = require('../../config/db_connect');
const axios = require('axios');
const FormData = require('form-data');

const instagram_feed = async function (req, res) {
    try {
        if (req.method !== 'POST') return res.status(405).end('Method not Allowed');

        console.log(req.body);

        res.end();
    }
    catch (error) {
        console.log(error);
    }
}

const instagram_token = async function (req, res) {
    try {
        if (req.method !== 'POST') return res.status(405).end('Method not Allowed');
        const data = req.body;
        const formdata = new FormData();

        for (let i = 0; i < data.length; i++) {
            formdata.append('pagetoken', data[i].access_token);
            formdata.append('pageid', data[i].id);

            const res = await axios({
                method: 'post',
                url: `${process.env.APP_URL_SOSIALAPI}/sosialapi/sosial/instagram/instagram/getinstagramaccount`,
                headers: {
                    ...formdata.getHeaders()
                },
                data: formdata
            });
            if (res.data.code === 200) {
                const { instagramid } = res.data.data;
                const check = await knex('sosmed_channels')
                    .count('page_id as jml')
                    .where({ page_id: data[i].id, channel: 'Instagram' })
                    .first();

                if (check.jml > 0) {
                    await knex('sosmed_channels')
                        .where({ page_id: data[i].id, channel: 'Instagram' })
                        .update({
                            page_name: data[i].name,
                            page_category: data[i].category,
                            channel: 'Instagram',
                            account_id: instagramid,
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
                            channel: 'Instagram',
                            account_id: instagramid,
                            token: data[i].access_token,
                            token_secret: '',
                            user_secret: '',
                            created_at: knex.fn.now(),
                        })
                }
            }
            else {
                console.log(res);
                logger('hooks/instagram_token', res);
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
        logger('hooks/instagram_token', error);
    }
}

module.exports = { instagram_feed, instagram_token }
