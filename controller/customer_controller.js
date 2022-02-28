'use strict';
const knex = require('../config/db_connect');
const date = require('date-and-time');
const { auth_jwt_bearer } = require('../middleware');
const logger = require('../helper/logger');
const response = require('../helper/json_response');
const { insert_channel_customer } = require('./customer_channel_controller');
const { datetime } = require('../helper/datetime_format');


const index = async function (req, res) {
    try {
        if (req.method !== 'GET') return res.status(405).end();
        auth_jwt_bearer(req, res);
        const customers = await knex('customers').orderBy(['name', 'email']);
        response.ok(res, customers);
    }
    catch (error) {
        console.log(error);
        logger('customer/index', error);
        res.status(500).end();
    }
}

const show = async function (req, res) {
    try {
        if (req.method !== 'GET') return res.status(405).end('Method not Allowed');
        auth_jwt_bearer(req, res);
        const { customer_id } = req.params;
        const res_customer = await knex('customers').where({ customer_id });
        response.ok(res, res_customer);
    }
    catch (error) {
        console.log(error);
        logger('customer/show', error);
        res.status(500).end();
    }
}


const store = async function (req, res) {
    try {
        if (req.method !== 'POST') return res.status(405).end('Method not Allowed');
        auth_jwt_bearer(req, res);

        const now = new Date();
        const customer_id = date.format(now, 'YYMMDDHHmmSS');
        const {
            tittle,
            name,
            email,
            no_ktp,
            birth,
            gender,
            telephone,
            address,
            city,
            region
        } = req.body;

        const check_email = await knex('customers').where({ email });
        if (check_email.length > 0) return response.created(res, `email : ${email} - already exists.`);
        const check_phone = await knex('customers').where({ telephone });
        if (check_phone.length > 0) return response.created(res, `telephone : ${telephone} - already exists.`);

        if (check_email.length === 0 && check_phone.length === 0) {
            await knex('customers')
                .insert([{
                    customer_id,
                    name,
                    email,
                    no_ktp,
                    birth,
                    gender,
                    telephone,
                    address,
                    status: 'Registered',
                    source: 'ICC',
                    created_at: knex.fn.now()
                }]);
            insert_channel_customer({ customer_id, email, telephone });
            const getcustomer = await knex('customers').where({ email }).first();
            response.ok(res, getcustomer);
        }
    }
    catch (error) {
        console.log(error);
        logger('customer/store', error);
        res.status(500).end();
    }
}


const update = async function (req, res) {
    try {
        if (req.method !== 'PUT') return res.status(405).end('Method not Allowed');
        auth_jwt_bearer(req, res);
        const {
            customer_id,
            tittle,
            name,
            email,
            no_ktp,
            birth,
            gender,
            telephone,
            address,
            city,
            region
        } = req.body;
        const check_email = await knex('customers').where({ email }).whereNot({ customer_id });
        if (check_email.length > 0) return response.created(res, `email : ${email} - already exists.`);
        const check_phone = await knex('customers').where({ telephone }).whereNot({ customer_id });
        if (check_phone.length > 0) return response.created(res, `telephone : ${telephone} - already exists.`);

        if (check_email.length === 0 && check_phone.length === 0) {
            await knex('customers')
                .update({
                    name,
                    email,
                    no_ktp,
                    birth,
                    gender,
                    telephone,
                    address,
                    status: 'Registered',
                    updated_at: knex.fn.now()
                })
                .where({ customer_id });
            insert_channel_customer({ customer_id, email, telephone });
            const getData = await knex('customers').where({ customer_id }).first();
            response.ok(res, getData);
        }
    }
    catch (error) {
        console.log(error);
        logger('customer/update', error);
        res.status(500).end();
    }
}


const destroy = async function (req, res) {
    try {
        if (req.method !== 'DELETE') return res.status(405).end('Method not Allowed');
        auth_jwt_bearer(req, res);
        const { customer_id } = req.params;
        const delData = await knex('customers').where({ customer_id }).del();
        response.ok(res, delData);
    }
    catch (error) {
        console.log(error);
        logger('customer/destroy', error);
        res.status(500).end();
    }
}

const insert_customer_sosmed = async function (req) {
    try {
        const { name, email } = req;
        const now = new Date();
        const customer_id = date.format(now, 'YYMMDDHHmmSS');
        const check_data = await knex('customers').where('email', email);

        if (check_data.length === 0) {
            await knex('customers')
                .insert([{
                    customer_id: customer_id,
                    name: name,
                    email: email,
                    source: 'chat',
                    status: 'Initialize',
                    created_at: knex.fn.now()
                }]);
        }
    }
    catch (error) {
        console.log(error);
        logger('customer/insert_customer', error);
    }
}

const customer_journey = async function (req, res) {
    try {
        if (req.method !== 'GET') return res.status(405).end();
        // auth_jwt_bearer(req, res);
        const { customer_id } = req.params;
        const journey = await knex('view_tickets')
            .select('customer_id','ticket_number','ticket_source','status','sla','complaint_detail','response_detail','date_create','type_customer','priority_scale','source_information','user_create','organization_name','category_name','category_sublv1_name','category_sublv2_name','category_sublv3_name')
            .where({ customer_id }).orderBy('id', 'desc');

        for (let i = 0; i < journey.length; i++) {
            journey[i].time = date.format(journey[i].date_create, 'HH:mm', true)
            journey[i].date = date.format(journey[i].date_create, 'dddd, DD MMMM YYYY')
        }

        response.ok(res, journey);
    }
    catch (error) {
        console.log(error);
        logger('customer/customer_journey', error);
        res.status(500).end();
    }
}

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
    insert_customer_sosmed,
    customer_journey,
}
