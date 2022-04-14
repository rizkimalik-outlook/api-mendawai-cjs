'use strict';
// const { auth_jwt } = require('../middleware');
const mail = require('../controller/mail_controller');
const auth = require('../controller/auth_controller');
const menu = require('../controller/menu_controller');
const user = require('../controller/users_controller');
const customer = require('../controller/customer_controller');
const channel = require('../controller/customer_channel_controller');
const socmed = require('../controller/sosmed_controller');
const ticket = require('../controller/ticket_controller');
const todolist = require('../controller/todolist_controller');
const { facebook, twitter, instagram } = require('../controller/hooks');
const { blending } = require('../controller/blending_controller');
const master = require('../controller/master_data');

module.exports = function (app) {
    app.route('/').get(function (req, res) {
        res.json({ message: "Application Mendawai API running! 🤘🚀" });
        res.end();
    });
    app.route('/main_menu/:user_level').get(menu.main_menu);
    app.route('/menu').get(menu.menu);
    app.route('/menu_modul/:menu_id').get(menu.menu_modul);
    app.route('/menu_submodul/:menu_modul_id').get(menu.menu_submodul);
    app.route('/menu_access').get(menu.menu_access);
    app.route('/modul_access').get(menu.modul_access);
    app.route('/submodul_access').get(menu.submodul_access);
    app.route('/store_access').post(menu.store_access);
    app.route('/delete_access/:id').delete(menu.delete_access);

    app.prefix('/auth', function (api) {
        api.route('/login').post(auth.login);
        api.route('/logout').post(auth.logout);
        api.route('/user_socket').put(auth.user_socket);
    });


    app.prefix('/master', function (api) {
        api.route('/status').get(master.status.index);
        api.route('/channel').get(master.channel.index);
        api.route('/user_level').get(master.user_level.index);
    });
    
    //? route category options
    app.prefix('/category', function (api) {
        api.route('/').get(master.category.index);
        api.route('/show/:category_id').get(master.category.show);
        api.route('/store').post(master.category.store);
        api.route('/update').put(master.category.update);
        api.route('/delete/:category_id').delete(master.category.destroy);
    });
    app.prefix('/categorysublv1', function (api) {
        api.route('/:category_id').get(master.categorysublv1.index);
        api.route('/show/:category_sublv1_id').get(master.categorysublv1.show);
        api.route('/store').post(master.categorysublv1.store);
        api.route('/update').put(master.categorysublv1.update);
        api.route('/delete/:category_sublv1_id').delete(master.categorysublv1.destroy);
    });
    app.prefix('/categorysublv2', function (api) {
        api.route('/:category_sublv1_id').get(master.categorysublv2.index);
        api.route('/show/:category_sublv2_id').get(master.categorysublv2.show);
        api.route('/store').post(master.categorysublv2.store);
        api.route('/update').put(master.categorysublv2.update);
        api.route('/delete/:category_sublv2_id').delete(master.categorysublv2.destroy);
    });
    app.prefix('/categorysublv3', function (api) {
        api.route('/:category_sublv2_id').get(master.categorysublv3.index);
        api.route('/show/:category_sublv3_id').get(master.categorysublv3.show);
        api.route('/store').post(master.categorysublv3.store);
        api.route('/update').put(master.categorysublv3.update);
        api.route('/delete/:category_sublv3_id').delete(master.categorysublv3.destroy);
    });
    
    app.prefix('/organization', function (api) {
        api.route('/').get(master.organization.index);
    });
    
    app.prefix('/department', function (api) {
        api.route('/').get(master.department.index);
    });
    
    app.prefix('/customer',  function (api) {
        api.route('/').get(customer.index);
        api.route('/show/:customer_id').get(customer.show);
        api.route('/store').post(customer.store);
        api.route('/update').put(customer.update);
        api.route('/delete/:customer_id').delete(customer.destroy);
        api.route('/channel').get(channel.index);
        api.route('/journey/:customer_id').get(customer.customer_journey);
    });

    app.prefix('/user',  function (api) {
        api.route('/').get(user.index);
        api.route('/show/:id').get(user.show);
        api.route('/store').post(user.store);
        api.route('/update').put(user.update);
        api.route('/reset_password').put(user.reset_password);
        api.route('/delete/:id').delete(user.destroy);
    });
    
    app.prefix('/ticket',  function (api) {
        api.route('/').get(ticket.index);
        api.route('/store').post(ticket.store);
        api.route('/update').put(ticket.update);
        api.route('/show/:ticket_number').get(ticket.show);
        api.route('/publish').post(ticket.publish);
        api.route('/publish/:customer_id').get(ticket.data_publish);
        api.route('/interaction/:ticket_number').get(ticket.ticket_interactions);
        api.route('/transaction/:customer_id').get(ticket.history_transaction);
        api.route('/escalation').put(ticket.ticket_escalations);
        api.route('/history').post(ticket.history_ticket);
    });

    app.prefix('/todolist', function (api) {
        api.route('/total_ticket').post(todolist.total_ticket);
        api.route('/data_ticket').post(todolist.data_ticket);
    });
    
    app.prefix('/sosmed', function (api) {
        api.route('/blending').post(blending);
        api.route('/list_customers').get(socmed.list_customers);
        api.route('/conversation_chats').post(socmed.conversation_chats);
        api.route('/end_chat').post(socmed.end_chat);
    });

    app.prefix('/hooks', function (api) {
        api.route('/facebook/token').post(facebook.facebook_token);
        api.route('/facebook/messenger').post(facebook.facebook_messenger);
        api.route('/facebook/feed').post(facebook.facebook_feed);
        api.route('/facebook/mention').post(facebook.facebook_mention);
        api.route('/instagram/token').post(instagram.instagram_token);
        api.route('/instagram/feed').post(instagram.instagram_feed);
        api.route('/twitter/token').post(twitter.twitter_token);
        api.route('/twitter/directmessage').post(twitter.twitter_directmessage);
        api.route('/twitter/mention').post(twitter.twitter_mention);
    });

    app.route('/mail').post(mail.send_mail);

}
