const sql = require('../config/dbConfig');
const nodemailer = require('nodemailer');
const upload = require('../middleware/upload');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
// const fileupload = require('express-fileupload');
// const util = require('util');
// const morgan = require('morgan');
// const _ = require('lodash');
// app.use(fileupload());
// app.use(morgan('dev'));


var email, password;
// create employee
exports.createMember = (req, res) => {
    function between(min, max) {
        return Math.floor(Math.random() * (max - min));
    }
    var conf_num = between(0, 9).toString() + between(0, 9).toString() + between(0, 9).toString() + between(0, 9).toString() + between(0, 9).toString();

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 534,
        secure: false,
        // requireTLS: true,
        auth: {
            user: 'leethorxiongpor1999@gmail.com',
            pass: '1999@igmail.lee'
        }
    });

    var mailOptions = {
        from: 'leethorxiongpor1999@gmail.com',
        to: `${req.body.email}`,
        subject: 'Your confirm password is',
        text: `${conf_num}`
    };

    sql.query(`INSERT INTO tb_member VALUES('${req.body.username}', 
        '${req.body.password}', '${req.body.email}', ${conf_num}, 'true')`,
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Your confirm password is ${conf_num}`);
                    }
                });
                res.send(result);
            }
        })
}

// edit username
exports.editUsername = (req, res) => {
    sql.query(`UPDATE tb_member SET username='${req.body.username}'
    WHERE email='${req.body.email}' AND password='${req.body.password}'`),
        (err, result) => {
            if (err) {
                res.send('error:', err);
                console.log('error:', err);
            } else {
                res.send(result);
            }
        }
}

// edit password
exports.editPassword = (req, res) => {
    sql.query(`UPDATE tb_member SET password='${req.body.newpassword}'
    WHERE email='${req.body.email}' AND password='${req.body.olspassword}'`),
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                res.send(result);
            }
        }
}

// edit ban state
exports.editBanState = (req, res) => {
    sql.query(`UPDATE tb_member SET ban_state=1^ban_state
    WHERE email='${req.body.email}'`),
        (err, result) => {
            if (err) {
                res.send('error:', err);
                console.log('error:', err);
            } else {
                res.send(result);
            }
        }
}

// delete employee
exports.deleteMember = (req, res) => {
    sql.query(`DELETE FROM tb_member WHERE username='${req.body.username}'
    AND email='${req.body.email}' AND password='${req.body.password}'`),
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                res.send(result);
            }
        }
}

// get all member  
exports.getAllMember = (req, res) => {
    sql.query('SELECT * FROM tb_member', (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json(err);
        } else {
            res.send(result.recordset);
        }
    });
}

// get one member  
exports.getOneMember = (req, res) => {
    sql.query(`SELECT * FROM tb_member WHERE memb_id=${req.body.memb_id}`, (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json('error:', err);
        } else {
            res.send(result.recordset);
        }
    });
}

// search member
exports.searchMember = (req, res) => {
    sql.query(`SELECT * FROM tb_member WHERE username LIKE'%${req.body.username}%'`,
        (err, result) => {
            if (err) {
                console.log('error:', err);
                return res.json('error:', err);
            } else {
                res.send(result.recordset);
            }
        });
}

//user login 
exports.memberLogin = (req, res) => {
    sql.query(`SELECT member_id, email, password FROM tb_member WHERE email='${req.body.email}'`,
        (err, result) => {
            if (err) {
                return res.json({ message: 'error:' }, err);
            } else {
                if (!result.recordset[0]) {
                    console.log('email not found');
                    return res.json({ message: 'email not found' });
                } else {
                    sql.query(`SELECT member_id, email, password FROM tb_member WHERE email='${req.body.email}' AND password='${req.body.password}'`,
                        (err, result) => {
                            if (err) {
                                return res.json({ message: 'error:' }, err);
                            }
                            else {
                                if (!result.recordset[0]) {
                                    console.log('password failed', err);
                                    return res.json({ message: 'password failed' });
                                } else {
                                    console.log('login successful');
                                    const token = jwt.sign({ data: result.recordset[0] }, process.env.TOKEN_SECRET);
                                    res.send({ token })
                                }
                            }
                        });
                }
            }
        });
}

//https://bezkoder.com/node-js-express-file-upload/
exports.uploadFile = async (req, res) => {
    try {
        await upload(req, res);
        if (req.files) {
            let file = req.files.file;
            file.mv('./public/uploads/' + file.name);
            res.json({
                message: 'File is uploaded',
                data: {
                    name: file.name,
                    mimetype: file.mimetype,
                    size: file.size,
                    url: path.join(__dirname, '..', '..', 'public', 'uploads', file.name),
                },
            });
        } else {
            res.status(400).send({
                message: "Please upload a file!"
            });
        }


    } catch (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!",
            });
        }

        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

exports.getFile = (req, res) => {
    // const directoryPath = 'D:\\Final Project\\nuol_research_api\\public\\uploads\\';
    // const dirPath = path.join(__dirname + '../../../public/uploads/');
    const dirPath = path.join(__dirname, '..', '..', 'public', 'uploads');
    fs.readdir(dirPath, function (err, files) {
        if (err) {
            return res.status(500).send({
                message: "Unable to scan files!",
                err,
            });
        } else {
            let fileInfo = [];
            files.forEach((file) => {
                fileInfo.push({
                    name: file,
                    url: path.join(__dirname, '..', '..', 'public', 'uploads', file),
                });
            });
            return res.json(fileInfo);
        }
    });
};

const downloadFile = (req, res) => {
    // const fileName = req.params.file;
    // const dirPath = path.join(__dirname, '..', '..', 'public', 'uploads');

    // res.downloadFile(dirPath + fileName, (err, result) => {
    //     if (err) {
    //         res.status(500).send({
    //             message: "Could not download the file. " + err,
    //         });
    //     }
    // });
};
// module.exports = { downloadFile };