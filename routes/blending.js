const blending = require('../controller/blending_controller');

module.exports = function (app, io) {
    app.prefix('/blending', function (api) {
        api.route('/send_message_cust').post((req, res) => {
            blending.send_message_cust(req, res, io)
        });
        api.route('/send_message_agent').post((req, res) => {
            blending.send_message_agent(req, res, io)
        });
        api.route('/queing_chat').post((req, res) => {
            blending.queing_chat(req, res, io)
        });
        api.route('/send_message_whatsapp').post((req, res) => {
            blending.send_message_whatsapp(req, res, io)
        });
    });
}