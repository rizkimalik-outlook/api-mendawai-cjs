"use strict";
const path = require('path');
const fs = require('fs');
// const https = require('https');
const logger = require('./logger');


const UploadAttachment = async function (value) {
    const { channel, attachment, file_name, file_size } = value;
    try {
        const extension = path.extname(file_name);
        const directory = `./${process.env.DIR_ATTACHMENT}/${channel}/`;
        const allowedExtensions = /png|jpeg|jpg|gif|svg|pdf|xls|xlsx|doc/;

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        if (!allowedExtensions.test(extension)) throw "Invalid File type";
        if (file_size > 3000000) throw "max file 3MB";
        // const md5 = file.md5;
        // const url = `${directory + md5 + extension}`;
        const url = `${directory + file_name}`;

        fs.writeFile(url, attachment, function (err) {
            if (err) {
                return console.log(err);
            }
        });

        return url;
    } catch (error) {
        console.log(error)
        logger('upload/UploadAttachment', error);
    }
}

const DownloadAttachment = async function (value) {
    const { channel, message_type, message_id, message_raw } = value;
    try {
        const directory = `./${process.env.DIR_ATTACHMENT}/${channel}/`;
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        let dataBase64 = '';
        let fileName = '';
        if (message_type === 'image') {
            fileName = message_id + '.png';
            dataBase64 = message_raw.imageMessage.jpegThumbnail;
        }
        const url = `${directory + fileName}`;

        fs.writeFile(url, dataBase64, 'base64', function (err) {
            if (err) {
                return console.log(err);
            }
        });

        return url;
    } catch (error) {
        console.log(error)
        logger('upload/UploadAttachment', error);
    }
}


// -------- from url
/* 
const url = 'GFG.jpeg';
https.get(url,(res) => {
	const path = `${__dirname}/files/img.jpeg`;
	const filePath = fs.createWriteStream(path);
	res.pipe(filePath);
	filePath.on('finish',() => {
		filePath.close();
		console.log('Download Completed');
	})
}) */


module.exports = { UploadAttachment, DownloadAttachment }