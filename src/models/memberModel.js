const sql = require('../config/dbConfig');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const path = require('path');
const { Int } = require('../config/dbConfig');

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
            user: 'nuoltest2021@gmail.com',
            pass: '@lee&khamla'
        }
    });

    var mailOptions = {
        from: 'nuoltest2021@gmail.com',
        to: `${req.body.email}`,
        subject: 'Your confirm number is',
        text: `${conf_num}`
    };

    if (req.body.email.indexOf("@") > 0 && req.body.email.indexOf("@") < req.body.email.length - 1) {
        sql.query(`SELECT * FROM tb_member WHERE email='${req.body.email}'`,
            (err, result) => {
                if (err) {
                    res.send('error', err)
                    console.log(err)
                } else {
                    if (result.recordset[0]) {
                        return res.json({ message: 'this email already registered' })
                    } else {
                        sql.query(`INSERT INTO tb_register VALUES(N'${req.body.username}', 
                '${req.body.email}', N'${req.body.password}', '${conf_num}')`,
                            (err, result) => {
                                if (err) {
                                    res.send('error', err)
                                    console.log(err)
                                } else {
                                    sql.query(`SELECT regist_id, username, email, password FROM tb_register WHERE username=N'${req.body.username}' 
                                AND email='${req.body.email}' AND password=N'${req.body.password}'`,
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
                                                        console.log(`Your confirm number is ${conf_num}`);
                                                    }
                                                })
                                            }
                                        })
                                }
                            })
                    }
                }
            })
    } else {
        console.log('email format is not true')
        return res.json({ message: 'email format is not true' })
    }
}

exports.createMember = (req, res) => {
    sql.query(`SELECT * FROM tb_register WHERE username=N'${req.body.username}' AND email='${req.body.email}' 
        AND password=N'${req.body.password}' AND conf_num='${req.body.conf_num}'`,
        (err, result) => {
            if (err) {
                console.log('err:' + err)
                return res.json({ message: 'error0:' }, err);
            } else {
                if (!result.recordset[0]) {
                    console.log('confirm number failed');
                    return res.json({ message: 'confirm number failed' });
                } else {
                    sql.query(`INSERT INTO tb_member VALUES(N'${req.body.username}', 
                    '${req.body.email}', N'${req.body.password}', null, 'no profile', ${req.body.regist_id},'true')`,
                        (err, result) => {
                            if (err) {
                                return res.json({ message: 'error1:' }, err);
                            } else {
                                sql.query(`SELECT * FROM tb_member WHERE email='${req.body.email}' 
                                AND password=N'${req.body.password}'`,
                                    (err, result) => {
                                        if (err) {
                                            return res.json({ message: 'error2:' }, err);
                                        }
                                        else {
                                            return res.json(result.recordset[0]);
                                            // const token = jwt.sign({ data: result.recordset[0] }, process.env.TOKEN_SECRET, { expiresIn: '90d' });
                                            // return res.json({ token })
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
    try {
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
                user: 'nuoltest2021@gmail.com',
                pass: '@lee&khamla'
            }
        });

        var mailOptions = {
            from: 'nuoltest2021@gmail.com',
            to: `${req.body.email}`,
            subject: 'Your confirm number is',
            text: `${conf_num}`
        };
        if (req.body.email.indexOf("@") > 0 && req.body.email.indexOf("@") < req.body.email.length - 1) {
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
        } else {
            console.log('email format is not true')
            return res.json({ message: 'email format is not true' })
        }
    } catch (error) {
        console.log(error)
    }
}

//upload member Image
exports.uploadMemberProfile = (req, res) => {
    if (req.body.profile == "") {
        sql.query(`UPDATE tb_member SET profile = N'no profile' 
        WHERE email='${req.body.email}'`,
            (err, result) => {
                if (err) {
                    console.log('error:', err);
                    return res.json('error:', err);
                } else {
                    return res.json('upload complete');
                }
            });

    } else {
        sql.query(`UPDATE tb_member SET profile = N'${req.body.profile}' 
        WHERE email= '${req.body.email}'`,
            (err, result) => {
                if (err) {
                    console.log('error:', err);
                    return res.json('error:', err);
                } else {
                    return res.json('upload complete');
                }
            });
    }

}

//forgot password
exports.forgotPassword = (req, res) => {
    try {
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
                user: 'nuoltest2021@gmail.com',
                pass: '@lee&khamla'
            }
        });

        var mailOptions = {
            from: 'nuoltest2021@gmail.com',
            to: `${req.body.email}`,
            subject: 'Your confirm number is',
            text: `${conf_num}`
        };

        if (req.body.email.indexOf("@") > 0 && req.body.email.indexOf("@") < req.body.email.length - 1) {
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
                                console.log(`Your confirm number is ${conf_num}`);
                                return res.json({ message: 'check your email please' });
                            }
                        })
                    }
                })
        } else {
            console.log('email format is not true')
            return res.json({ message: 'email format is not true' })
        }
    } catch (error) {
        console.log(error)
    }
}

//confirm email when forgot password
exports.confirmEmailWhenForgotPassword = (req, res) => {
    try {
        if (req.body.email.indexOf("@") > 0 && req.body.email.indexOf("@") < req.body.email.length - 1) {
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
                                    user: 'nuoltest2021@gmail.com',
                                    pass: '@lee&khamla'
                                }
                            });

                            var mailOptions = {
                                from: 'nuoltest2021@gmail.com',
                                to: `${req.body.email}`,
                                subject: 'Your password is',
                                text: `${result.recordset[0].password}`
                            };
                            transporter.sendMail(mailOptions, function (err, info) {
                                if (err) {
                                    console.log({ message: 'send mail error:' }, err);
                                } else {
                                    console.log('Your password is:' + result.recordset[0].password)
                                    return res.json({ message: 'check your email please' });
                                }
                            })
                        }
                    }
                })
        } else {
            console.log('email format is not true')
            return res.json({ message: 'email format is not true' })
        }
    } catch (error) {
        console.log(error);
    }
}

// edit username
exports.editMemberUsername = (req, res) => {
    sql.query(`SELECT password FROM tb_member WHERE password=N'${req.body.password}'`,
        (err, result) => {
            if (err) {
                res.send('error:', err);
                console.log('error:', err);
            } else {
                if (!result.recordset[0]) {
                    return res.json({ message: 'password failed' });
                }
                else {
                    sql.query(`UPDATE tb_member SET username=N'${req.body.new_username}'
                    WHERE email='${req.body.email}' AND password=N'${req.body.password}'`,
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
    sql.query(`SELECT password FROM tb_member WHERE password=N'${req.body.old_password}'`,
        (err, result) => {
            if (err) {
                res.send('error:', err);
                console.log('error:', err);
            } else {
                if (!result.recordset[0]) {
                    return res.json({ message: 'password failed' });
                } else {
                    sql.query(`UPDATE tb_member SET password=N'${req.body.new_password}'
                        WHERE email='${req.body.email}' AND password=N'${req.body.old_password}'`,
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
    sql.query(`DELETE FROM tb_member WHERE username=N'${req.body.username}'
    AND email='${req.body.email}' AND password=N'${req.body.password}'`),
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
exports.getMemberData = (req, res) => {
    sql.query(`SELECT * FROM tb_member WHERE email='${req.body.email}'`, (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json('error');
        } else {
            sql.query(`SELECT * FROM tb_member WHERE email='${req.body.email}' AND ban_state='true'`, (err, result) => {
                if (err) {
                    console.log('error:', err);
                    return res.json('get member data error');
                } else {
                    if (!result.recordset[0]) {
                        return res.json({ message: 'this user has banned' });
                    } else {
                        return res.json(result.recordset[0]);
                    }
                }
            });
        }
    });
}

// search member
exports.searchMember = (req, res) => {
    sql.query(`SELECT * FROM tb_member WHERE username LIKE N'%${req.body.username}%'`,
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
exports.

memberLogin = (req, res) => {
    sql.query(`SELECT member_id, email FROM tb_member WHERE email='${req.body.email}'`,
        (err, result) => {
            if (err) {
                return res.json({ message: 'error:' }, err);
            } else {
                if (!result.recordset[0]) {
                    return res.json({ message: 'email not found' });
                } else {
                    sql.query(`SELECT * FROM tb_member WHERE email='${req.body.email}' AND password=N'${req.body.password}'`,
                        (err, result) => {
                            if (err) {
                                return res.json({ message: 'error:' }, err);
                            }
                            else {
                                if (!result.recordset[0]) {
                                    return res.json({ message: 'password failed' });
                                } else {
                                    sql.query(`SELECT * FROM tb_member WHERE email='${req.body.email}' AND password=N'${req.body.password}' AND ban_state='true'`,
                                        (err, result) => {
                                            if (err) {
                                                return res.json({ message: 'error:' }, err);
                                            }
                                            else {
                                                if (!result.recordset[0]) {
                                                    return res.json({ message: 'this user has banned' });
                                                } else {
                                                    return res.json(result.recordset[0]);
                                                    // const token = jwt.sign({ data: result.recordset[0] }, process.env.TOKEN_SECRET, { expiresIn: '90d' });
                                                    // return res.json({ token })
                                                }
                                            }
                                        });
                                    if (result.recordset[0]) {

                                    };

                                    // const token = jwt.sign({ data: result.recordset[0] }, process.env.TOKEN_SECRET, { expiresIn: '90d' });
                                    // return res.json({ token })
                                }
                            }
                        });
                }
            }
        });
}

// getSingleLike 

exports.getSingleLike = (req, res) => {
    const book_id = req.params.id
    sql.query(`SELECT * FROM tb_like where book_id=N'${book_id}'`,
        (err, result) => {
            if (err) {
                console.log('error while fetching getSingleLike by id', err);
                return res.json(err);
            } else {
                console.log('get all getSingleLike');
                res.send(result.recordset);

            }
        });
}

exports.deleteLike = (req, res) => {
    try {
        const { book_id, member_id } = req.body;

        sql.query(`DELETE FROM tb_like WHERE member_id=${member_id} and book_id=N'${book_id}'`,
            (err, result) => {
                if (err) {
                    console.log('error while fetching member_id by id', err);
                    res.send(err);
                } else {
                    console.log('get all successfulyy member_id delete');
                    res.send(result.recordset);

                }
            });
    } catch (error) {
        console.log("ERORR: ", error)
    }
}

// getSingleBookMark 

exports.getSingleBookMark = (req, res) => {
    const book_id = req.params.id
    sql.query(`SELECT * FROM tb_bookmark where book_id=N'${book_id}'`,
        (err, result) => {
            if (err) {
                console.log('error while fetching getSingleBookMark by id', err);
                return res.json(err);
            } else {
                console.log('get all getSingleBookMark');
                res.send(result.recordset);

            }
        });
}

exports.deleteBookMark = (req, res) => {
    try {
        const { book_id, member_id } = req.body;

        sql.query(`DELETE FROM tb_bookmark WHERE member_id=${member_id} and book_id=N'${book_id}'`,
            (err, result) => {
                if (err) {
                    console.log('error while fetching deleteBookMark member_id by id', err);
                    res.send(err);
                } else {
                    console.log('get all successfulyy deleteBookMark member_id delete');
                    res.send(result.recordset);
                }
            });
    } catch (error) {
        console.log("ERORR: ", error)
    }
}