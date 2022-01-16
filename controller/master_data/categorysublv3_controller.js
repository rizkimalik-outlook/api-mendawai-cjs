const knex = require('../../config/db_connect');
const { response, logger } = require('../../helper');

const index = async function (req, res) {
    try {
        if (req.method !== 'GET') return res.status(405).end();
        const category = await knex('category_sub_lv3');
        response.ok(res, category);
    }
    catch (error) {
        console.log(error);
        logger('category_sub_lv3/index', error);
        res.status(500).end();
    }
}

const show = async function (req, res) {
    try {
        if (req.method !== 'GET') return res.status(405).end();
        const { category_sublv3_id } = req.params;
        const category = await knex('category_sub_lv3').where({ category_sublv3_id });
        response.ok(res, category);
    }
    catch (error) {
        console.log(error);
        logger('category_sub_lv3/show', error);
        res.status(500).end();
    }
}

const store = async function (req, res) {
    try {
        if (req.method !== 'POST') return res.status(405).end('Method not Allowed');
        const {
            category_id,
            category_sublv1_id,
            category_sublv2_id,
            sub_name,
            description,
            sla
        } = req.body;
        const subcategory3 = await knex('category_sub_lv3')
            .select('category_sublv3_id')
            .orderBy('category_sublv3_id', 'desc').first();

        let categorysublv3_id;
        if (Boolean(subcategory3) === false) {
            categorysublv3_id = `CT3-30001`;
        }
        else {
            const categorysublv3_no = Number(subcategory3.category_sublv3_id.split('-')[1]) + 1;
            categorysublv3_id = `CT3-${categorysublv3_no}`;
        }

        await knex('category_sub_lv3')
            .insert([{
                category_id,
                category_sublv1_id,
                category_sublv2_id,
                category_sublv3_id: categorysublv3_id,
                sub_name,
                description,
                sla
            }]);
        response.ok(res, categorysublv3_id);
    }
    catch (error) {
        console.log(error);
        logger('category_sub_lv3/store', error);
        res.status(500).end();
    }
}

const update = async function (req, res) {
    try {
        if (req.method !== 'PUT') return res.status(405).end('Method not Allowed');
        const {
            category_id,
            category_sublv1_id,
            category_sublv2_id,
            category_sublv3_id,
            sub_name,
            description,
            sla
        } = req.body;

        await knex('category_sub_lv3')
            .update({
                category_id,
                category_sublv1_id,
                category_sublv2_id,
                sub_name,
                description,
                sla
            })
            .where({ category_sublv3_id });
        response.ok(res, 'success update');
    }
    catch (error) {
        console.log(error);
        logger('category_sub_lv3/update', error);
        res.status(500).end();
    }
}

const destroy = async function (req, res) {
    try {
        if (req.method !== 'DELETE') return res.status(405).end('Method not Allowed');
        const { category_sublv3_id } = req.params;
        const res_delete = await knex('category_sub_lv3').where({ category_sublv3_id }).del();
        response.ok(res, res_delete);
    }
    catch (error) {
        console.log(error);
        logger('category_sub_lv3/destroy', error);
        res.status(500).end();
    }
}

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
}