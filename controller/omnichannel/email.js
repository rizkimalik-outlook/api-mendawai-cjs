"use strict";
const nodemailer = require('nodemailer');

const send_mail = function (req, res) {
    let transporter = nodemailer.createTransport({
        host: 'mail.redbionic.site',
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
            user: 'admin@redbionic.site',
            pass: 'samsung9080'
        }
    });

    var mailOptions = {
        from: 'admin@redbionic.site',
        to: 'rizkimalik94@outlook.com',
        subject: 'Sending Email using Nodejs',
        // text: 'That was easy!',
        html: "<h1>HTML version of the message</h1>",
        attachments: [{}]
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        console.log('Email sent: ' + info.response);
        console.log("Message sent: %s", info.messageId);
    }); 

    res.json({message:'mail_send'});
    res.end();

    /* 
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            // user: 'desakecil100@gmail.com',
            user: 'rizkinexx@gmail.com',
            pass: 'samsung9080'
        }
    });
    
    var mailOptions = {
        from: 'desakecil100@gmail.com',
        to: 'rizkimalik94@gmail.com',
        subject: 'Sending Email using Nodejs',
        text: 'That was easy!'
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        console.log('Email sent: ' + info.response);
    }); */

}

module.exports = {send_mail}