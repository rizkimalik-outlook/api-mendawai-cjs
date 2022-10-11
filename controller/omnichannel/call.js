'use strict';
const knex = require('../../config/db_connect');
const logger = require('../../helper/logger');
const response = require('../../helper/json_response');

//? HTTP FUNCTION
const list_call = async function (req, res) {
    try {
        const { agent,customer_id } = req.body;
        const list_call = await knex.raw(`SELECT * FROM ICC_CALL_HISTORY WHERE AGENT='${agent}' AND CustomerID=${customer_id} ORDER BY ID DESC`);
        response.ok(res, list_call);
    }
    catch (error) {
        console.log(error);
        logger('call/list_call', error);
    }
}


//? NON HTTP FUNCTION
const insert_call = async function (data) {
    try {
        const { customer_id, agent, email } = data;
        const insert_call = await knex.raw(`EXEC SP_CALL_HISTORY_INSERT '${customer_id}','${email}','${agent}'`);
        return insert_call[0];
    }
    catch (error) {
        console.log(error);
        logger('call/insert_call', error);
    }
}

const update_call = async function (data) {
    try {
        const { call_id, customer_id } = data;
        if (call_id) {
            const update_call = await knex.raw(`EXEC SP_CALL_HISTORY_UPDATE '${call_id}','${customer_id}'`);
            return update_call;
        }
        else {
            return 'nothing to execute.'
        }
    }
    catch (error) {
        console.log(error);
        logger('call/update_call', error);
    }
}


module.exports = {
    list_call,
    insert_call,
    update_call,
}
