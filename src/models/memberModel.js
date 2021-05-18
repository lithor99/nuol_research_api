const sql = require('../config/dbConfig');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { json } = require('body-parser');
const { param } = require('../routes/memberRoute');
// const fileupload = require('express-fileupload');
// const util = require('util');
// const morgan = require('morgan');
// const _ = require('lodash');
// app.use(fileupload());
// app.use(morgan('dev'));

// create employee
exports.memberRegist = (req, res) => {
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

    sql.query(`SELECT * FROM tb_member WHERE email='${req.body.email}'`,
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                if (result.recordset[0]) {
                    return res.json({ message: 'this email already registered' })
                } else {
                    sql.query(`INSERT INTO tb_register VALUES('${req.body.username}', 
                '${req.body.email}', '${req.body.password}', '${conf_num}')`,
                        (err, result) => {
                            if (err) {
                                res.send('error', err)
                                console.log(err)
                            } else {
                                sql.query(`SELECT regist_id, username, email, password FROM tb_register WHERE username='${req.body.username}' 
                                AND email='${req.body.email}' AND password='${req.body.password}'`,
                                    (err, result) => {
                                        if (err) {
                                            console.log('err:' + err)
                                            return res.json({ message: 'error0:' }, err);
                                        } else {
                                            res.send(result.recordset[0]);
                                            transporter.sendMail(mailOptions, function (err, info) {
                                                if (err) {
                                                    console.log({ message: 'error:' }, err);
                                                } else {
                                                    console.log(`Your confirm password is ${conf_num}`);
                                                }
                                            })
                                        }
                                    })
                            }
                        })
                }
            }
        })

}

exports.createMember = (req, res) => {
    sql.query(`SELECT * FROM tb_register WHERE username='${req.body.username}' AND email='${req.body.email}' 
        AND password='${req.body.password}' AND conf_num='${req.body.conf_num}'`,
        (err, result) => {
            if (err) {
                console.log('err:' + err)
                return res.json({ message: 'error0:' }, err);
            } else {
                if (!result.recordset[0]) {
                    console.log('confirm number failed');
                    return res.json({ message: 'confirm number failed' });
                } else {
                    sql.query(`INSERT INTO tb_member VALUES('${req.body.username}', 
                    '${req.body.email}', '${req.body.password}','', ${req.body.regist_id},'true')`,
                        (err, result) => {
                            if (err) {
                                return res.json({ message: 'error1:' }, err);
                            } else {
                                sql.query(`SELECT member_id, email, password FROM tb_member WHERE email='${req.body.email}' 
                                AND password='${req.body.password}'`,
                                    (err, result) => {
                                        if (err) {
                                            return res.json({ message: 'error:' }, err);
                                        }
                                        else {
                                            if (!result.recordset[0]) {
                                                return res.json({ message: 'password failed' });
                                            } else {
                                                const token = jwt.sign({ data: result.recordset[0] }, process.env.TOKEN_SECRET, { expiresIn: '30d' });
                                                res.send({ token })
                                            }
                                        }
                                    });
                            }
                        });
                }
            }
        })
}

//send mail again
exports.sendMailAgain = (req, res) => {
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

    sql.query(`UPDATE tb_register SET conf_num='${conf_num}' WHERE regist_id=${req.body.regist_id}`,
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log({ message: 'send mail error:' }, err);
                    } else {
                        console.log(`Your confirm password is ${conf_num}`);
                        return res.json({ message: 'check your email please' });
                    }
                })
            }
        })
}

//forgot password
exports.forgotPassword = (req, res) => {
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
            pass: 'your email password'
        }
    });

    var mailOptions = {
        from: 'leethorxiongpor1999@gmail.com',
        to: `${req.body.email}`,
        subject: 'Your confirm password is',
        text: `${conf_num}`
    };

    sql.query(`UPDATE tb_member SET conf_num='${conf_num}' WHERE email='${req.body.email}'`,
        (err, result) => {
            if (err) {
                res.send('error:', err)
                console.log(err)
            } else {
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log({ message: 'send mail error:' }, err);
                    } else {
                        console.log(`Your confirm password is ${conf_num}`);
                        return res.json({ message: 'check your email please' });
                    }
                })
            }
        })
}

//confirm email when forgot password
exports.confirmEmailWhenForgotPassword = (req, res) => {
    sql.query(`SELECT password FROM tb_member WHERE email='${req.body.email}' 
        AND conf_num='${req.body.conf_num}'`,
        (err, result) => {
            if (err) {
                res.send('error:', err)
                console.log(err)
            } else {
                if (result.recordset[0]) {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        host: 'smtp.gmail.com',
                        port: 534,
                        secure: false,
                        // requireTLS: true,
                        auth: {
                            user: 'leethorxiongpor1999@gmail.com',
                            pass: 'your email password'
                        }
                    });

                    var mailOptions = {
                        from: 'leethorxiongpor1999@gmail.com',
                        to: `${req.body.email}`,
                        subject: 'Your password is',
                        text: `${result.recordset[0].password}`
                    };
                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log({ message: 'send mail error:' }, err);
                        } else {
                            console.log('password:' + result.recordset[0].password)
                            return res.json({ message: 'check your email please' });
                        }
                    })
                }
            }
        })
}

// edit username
exports.editMemberUsername = (req, res) => {
    sql.query(`SELECT password FROM tb_member WHERE password='${req.body.password}'`,
        (err, result) => {
            if (err) {
                res.send('error:', err);
                console.log('error:', err);
            } else {
                if (!result.recordset[0]) {
                    return res.json({ message: 'password failed' });
                }
                else {
                    sql.query(`UPDATE tb_member SET username='${req.body.new_username}'
                    WHERE email='${req.body.email}' AND password='${req.body.password}'`,
                        (err, result) => {
                            if (err) {
                                res.send('error:', err);
                                console.log('error:', err);
                            } else {
                                return res.json({ message: 'username has updated' });
                            }
                        }
                    )
                }
            }
        }
    )

}

// edit password
exports.editMemberPassword = (req, res) => {
    sql.query(`SELECT password FROM tb_member WHERE password='${req.body.old_password}'`,
        (err, result) => {
            if (err) {
                res.send('error:', err);
                console.log('error:', err);
            } else {
                if (!result.recordset[0]) {
                    return res.json({ message: 'password failed' });
                } else {
                    sql.query(`UPDATE tb_member SET password='${req.body.new_password}'
                        WHERE email='${req.body.email}' AND password='${req.body.old_password}'`,
                        (err, result) => {
                            if (err) {
                                res.send('error', err)
                                console.log(err)
                            } else {
                                return res.json({ message: 'password has updated' });
                            }
                        }
                    )
                }
            }
        }
    )

}

// edit ban state
exports.editBanState = (req, res) => {
    sql.query(`UPDATE tb_member SET ban_state=1^ban_state
    WHERE member_id=${req.body.member_id}`),
        (err, result) => {
            if (err) {
                res.send('error:', err);
                console.log('error:', err);
            } else {
                if (result.recordset[0]) {
                    return res.json(result.recordset[0]);
                }
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
                if (result.recordset[0]) {
                    return res.json(result.recordset[0]);
                }
            }
        }
}

// get all member  
exports.getAllMember = (req, res) => {
    sql.query(`SELECT * FROM tb_member`, (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json(err);
        } else {
            res.send(result.recordset);
        }
    });
}

// get one member  
exports.getMemberUser = (req, res) => {
    sql.query(`SELECT * FROM tb_member WHERE email='${req.body.email}'`, (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json('error');
        } else {
            return res.json(result.recordset[0]);
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
    sql.query(`SELECT member_id, email FROM tb_member WHERE email='${req.body.email}'`,
        (err, result) => {
            if (err) {
                return res.json({ message: 'error:' }, err);
            } else {
                if (!result.recordset[0]) {
                    // console.log('email not found');
                    return res.json({ message: 'email not found' });
                } else {
                    sql.query(`SELECT member_id, email FROM tb_member WHERE email='${req.body.email}' AND password='${req.body.password}'`,
                        (err, result) => {
                            if (err) {
                                return res.json({ message: 'error:' }, err);
                            }
                            else {
                                if (!result.recordset[0]) {
                                    // console.log('password failed');
                                    return res.json({ message: 'password failed' });
                                } else {
                                    console.log('login successful');
                                    const token = jwt.sign({ data: result.recordset[0] }, process.env.TOKEN_SECRET, { expiresIn: '30d' });
                                    res.send({ token })
                                }
                            }
                        });
                }
            }
        });
}

// module.exports = { downloadFile };