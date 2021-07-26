const sql = require('../config/dbConfig');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');



exports.createEmployee = (req, res) => {
    let { name, surname, username, password, gender, birth_date, tel, email, supper_admin, ban_state } = req.body;
    sql.query(`
    SELECT 
	COUNT (*) AS countUsername
    FROM
    dbo.tb_employee 
    where dbo.tb_employee.username='${username}'`, function (err, data) {
        if (err) {
            console.log("Errror at dubplicate username values: ", err)
        } else {
            if (data.recordset[0].countUsername > 0) {
                // Already exist username
                res.send("username already exist");
            } else {
                sql.query(`
                SELECT 
                COUNT (*) AS countUsername
                FROM
                dbo.tb_employee 
                where dbo.tb_employee.email='${email}'
    `,
                    (err, data) => {
                        if (err) {
                            console.log("Errror at dubplicate email values: ", err)
                        } else {
                            // Already exist email
                            if (data.recordset[0].countUsername > 0) {
                                res.send("email already exist");
                            } else {
                                // Insert unique username, email to tb_employee
                                sql.query(`
                                INSERT INTO tb_employee VALUES(N'${name}',N'${surname}',N'${username}',N'${password}',N'${gender}',N'${birth_date}',N'${tel}', N'${email}',${supper_admin},${ban_state})
                            `,
                                    (err, result) => {
                                        if (err) {
                                            res.send('error at insert data: ', err)
                                            console.log(err)
                                        } else {
                                            res.send(result);
                                        }
                                    })
                            }
                        }
                    });
            }
        }

    });
}



// edit employee
exports.editEmployee = (req, res) => {
    let emp_id = req.params.id
    let { name, surname, username, password, gender, birth_date, tel, email, supper_admin, ban_state } = req.body;
    sql.query(`UPDATE tb_employee SET name=N'${name}',surname=N'${surname}',
    username=N'${username}',password=N'${password}',
    gender=N'${gender}',birth_date=N'${birth_date}',
    tel=N'${tel}',email=N'${email}',supper_admin=${supper_admin}, 
    ban_state=${ban_state} WHERE emp_id=${emp_id}`),
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                // res.send(req.body.emp_id);
                return res.json(result);
            }
        }
}


// delete employee
exports.deleteEmployee = (req, res) => {
    sql.query(`DELETE FROM tb_employee WHERE emp_id=${req.params.id}`),
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                res.send(result);
            }
        }
}

// get all employee  
exports.getAllEmployee = (req, res) => {
    sql.query('SELECT * FROM tb_employee', (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json(err);
        } else {
            console.log('get all user');
            res.send(result.recordset);
        }
    });
}

// get one employee  
exports.getOneEmployee = (req, res) => {
    let emp_id = req.params.id
    sql.query(`SELECT * FROM tb_employee WHERE emp_id=${emp_id}`, (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json('error:', err);
        } else {
            res.send(result.recordset);
        }
    });
}

// search employee
exports.searchEmployee = (req, res) => {
    sql.query(`SELECT * FROM tb_employee WHERE name_surname LIKE'%${req.body.name_surname}%'`, (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json('error:', err);
        } else {
            res.send(result.recordset);
        }
    });
}


exports.employeeLogin = async (req, res) => {
    const { username, password } = req.body;
    sql.query(`SELECT emp_id, username, password,ban_state,supper_admin FROM tb_employee WHERE username='${username}' AND password='${password}'`,
        (err, data) => {
            if (err) {
                console.log("Error while login to system: ", err)
                return res.send({ message: "Error while login to system: ", err })
            } else {
                // username or password is incorrected
                if (!data.recordset[0]) {
                    console.log("Your username or password is incorrected")
                    return res.send({ message: "Your username or password is incorrected" })
                } else {
                    // check account ban_state
                    if (data.recordset[0].ban_state === 1 || data.recordset[0].ban_state === true) {
                        console.log("Your login account is banned")
                        return res.send({ login_account_banned: "Your login account is banned" })
                    } else if (data.recordset[0].ban_state === 0 || data.recordset[0].ban_state === false) {
                        // success  
                        const token = jwt.sign({ emp_id: data.recordset[0].emp_id }, process.env.TOKEN_SECRET, { expiresIn: '30d' });
                        res.header('Authorization', token).send({
                            emp_id: data.recordset[0].emp_id,
                            supper_admin: data.recordset[0].supper_admin,
                            ban_state: data.recordset[0].ban_state,
                            token: token
                        });
                        // return res.send({ success: "login success" })
                    }
                }
            }
        });
}


// getEmployeesPagination

// const getPagination = (page, size) => {
//     const limit = size ? +size : 3;
//     const offset = page ? page * limit : 0;

//     return { limit, offset };
// };

// exports.getEmployeesPagination = async (req, res) => {
//     try {

//         const { page, size } = req.query;
//         const { limit, offset } = getPagination(page, size);


//         // const limit = 10;
//         // const page = 10;

//         const totalPage = await sql.query(`
//                     SELECT  count(DISTINCT(emp_id)) AS count FROM tb_employee
//                     `)

//         await sql.query(
//             `  
//         SELECT * 
//         FROM tb_employee
//         ORDER BY emp_id 
//         OFFSET (${offset} - 1)*${limit} ROWS
//         FETCH NEXT ${limit} ROWS ONLY`
//         )
//             .then(data => {
//                 const totalPages = Math.ceil(totalPage.recordset[0].count / limit);
//                 const response = {
//                     data: {
//                         "totalItems": totalPage.recordset[0].count,
//                         "totalPages": totalPages,
//                         // "limit": limit,
//                         "currentPages": page + 1 - page,
//                         // "currentPageSize": data.recordset.length,
//                         "employees": data.recordset
//                     }
//                 };
//                 res.send(response);
//             });

//     } catch (error) {
//         res.status(500).send({
//             message: "Error -> Can NOT complete a paging request!",
//             error: error.message,
//         });
//     }
// }



//forgot password
exports.forgotPasswordEmployee = (req, res) => {
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


    // check email already exist:

    sql.query(`SELECT email FROM tb_employee WHERE email='${req.body.email}'`,
        (err, data) => {
            if (err) {
                return res.send({ message: "error while email: ", err })
            } else {
                if (!data.recordset[0]) {
                    console.log("Email is invalidate in the system");
                    return res.send({ message: "failed" })
                } else {

                    // sent to email 
                    sql.query(`UPDATE tb_employee SET password='${conf_num}' WHERE email='${req.body.email}'`,
                        (err, result) => {
                            if (err) {
                                return res.send('error:', err)
                            } else {
                                transporter.sendMail(mailOptions, function (err, info) {
                                    if (err) {
                                        console.log({ message: 'send mail error:' }, err);
                                    } else {
                                        console.log(`Your confirm password is ${conf_num}`);
                                        return res.send({ message: 'success' });
                                    }
                                });
                            }
                        })
                }
            }

        });
}

exports.employeeSignUp = async (req, res) => {
    let { name, surname, username, password, gender, birth_date, tel, email } = req.body;
    return await sql.query(`
        SELECT 
        COUNT (*) AS countUsername
        FROM
        dbo.tb_employee 
        where dbo.tb_employee.username='${username}'`, function (err, data) {
        if (err) {
            console.log("Errror at dubplicate username values: ", err)
        } else {
            if (data.recordset[0].countUsername > 0) {
                // Already exist username
                res.send("username already exist");
            } else {
                sql.query(`
                    SELECT 
                    COUNT (*) AS countUsername
                    FROM
                    dbo.tb_employee 
                    where dbo.tb_employee.email='${email}'
                    `,
                    (err, data) => {
                        if (err) {
                            console.log("Errror at dubplicate email values: ", err)
                        } else {
                            // Already exist email
                            if (data.recordset[0].countUsername > 0) {
                                res.send("email already exist");
                            } else {
                                // Insert unique username, email to tb_employee
                                sql.query(`
                                INSERT INTO tb_employee (name, surname, username, password, gender, birth_date, tel, email,ban_state,supper_admin) 
                                VALUES('${name}', '${surname}', '${username}', '${password}', '${gender}', '${birth_date}', '${tel}', '${email}',1,1)
                                
                                `,
                                    (err, result) => {
                                        if (err) {
                                            res.send('error at insert data: ', err)
                                            console.log(err)
                                        } else {
                                            res.send(result);
                                        }
                                    })
                            }
                        }
                    });
            }
        }
    });


}
