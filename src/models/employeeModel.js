const sql = require('../config/dbConfig');
const jwt = require('jsonwebtoken');
const { createEmployeeValidation, loginValidation } = require('../middleware/Employee.validation');
const bcrypt = require('bcryptjs');


// create employee
// exports.createEmployee = (req, res) => {
//     let { name, surname, username, password, gender, birth_date, tel, email, supper_admin, ban_state } = req.body;
//     sql.query(`
//     INSERT INTO tb_employee VALUES(N'${name}',N'${surname}',N'${username}',N'${password}',N'${gender}',N'${birth_date}',N'${tel}', N'${email}',${supper_admin},${ban_state})
// `,
//     (err, result) => {
//         if (err) {
//             res.send('error', err)
//             console.log(err)
//         } else {
//             res.send(result);
//         }
//     })
// }

exports.createEmployee = async (req, res, next) => {

    // check validation employee
    const { username, password, email, supper_admin, ban_state, tel, name, birth_date, gender, surname } = req.body;
    const data = { username, password, email, supper_admin, ban_state, tel, name, birth_date, gender, surname }


    const { error } = createEmployeeValidation(data);
    if (error) {
        console.log("Error on validate: ", error)
        return res.status(400).send({ error: error.details[0].message });
    }

    // checking if the employee is already in the database

    const emailExist = await sql.query(`select email from tb_employee where email='${req.body.email}'`);
    // if (emailExist) return res.status(400).send("Email is aready exist!!");
    if (emailExist.recordset[0]) {
        console.log("Email is already exist")
        return res.status(409).send({ message: "Email is aready exist!!" });
    }

    // HASH Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    sql.query(`
    INSERT INTO tb_employee VALUES(N'${name}',N'${surname}',N'${username}',N'${hashPassword}',N'${gender}',N'${birth_date}',N'${tel}', N'${email}',${supper_admin},${ban_state})
    `,
        (err, result) => {
            if (err) {
                res.status(500).send({ error: "Cannot register employee at the moment" })
                console.log(err)
            } else {
                res.status(200).json({ result: result, message: "Thanks you registering" });
            }

        })
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

//user login 
// exports.employeeLogin = (req, res) => {
//     sql.query(`SELECT emp_id, username, password FROM tb_employee WHERE username='${req.body.username}'`,
//         (err, result) => {
//             if (err) {
//                 return res.json({ message: 'error:' }, err);
//             } else {
//                 if (!result.recordset[0]) {
//                     console.log('username not found');
//                     return res.json({ message: 'username not found' });
//                 } else {
//                     sql.query(`SELECT emp_id, username, password, FROM tb_employee WHERE username='${req.body.username}' 
//                         AND password='${req.body.password}'`,
//                         (err, result) => {
//                             if (err) {
//                                 return res.json({ message: 'error:' }, err);
//                             }
//                             else {
//                                 if (!result.recordset[0]) {
//                                     console.log('password failed', err);
//                                     return res.json({ message: 'password failed' });
//                                 } else {
//                                     console.log('login successful');
//                                     const token = jwt.sign({ data: result.recordset[0] }, process.env.TOKEN_SECRET);
//                                     res.send({ token })
//                                 }
//                             }
//                         });
//                 }
//             }
//         });
// }


exports.employeeLogin = async (req, res) => {

    // LETS Validate the data before we a employee

    const { error } = loginValidation(req.body)
    if (error) {
        console.log(error.details[0].message)
        return res.status(400).send(error.details[0].message);

    }



    // checking if the username is already in the database 
    const employee = await sql.query(`select * from tb_employee where username='${req.body.username}'`)
    if (!employee) {
        console.log("username isn't found....")
        return res.status(400).send("username isn't found");
    };

    // password is correct

    const _employeeData = await sql.query(`select password,emp_id,ban_state,supper_admin from tb_employee where username='${req.body.username}'`)
    const validPass = await bcrypt.compare(req.body.password, _employeeData.recordset[0].password);

    if (validPass !== true) {
        console.log("Password invalid....")
        return res.status(400).send({ password: "Invalid password" });
    }

    // console.log('validPass: ', validPass)

    if (_employeeData.recordset[0].ban_state === 1) {
        console.log("Your account is baned isn't found....")
        return res.status(403).send({ login_account: "Your login account is banned" })
    };

    // Create and assign a token 
    const token = jwt.sign({ emp_id: _employeeData.recordset[0].emp_id }, process.env.TOKEN_SECRET, { expiresIn: '30d' });
    res.header('Authorization', token).send({
        emp_id: _employeeData.recordset[0].emp_id,
        supper_admin: _employeeData.recordset[0].supper_admin,
        ban_state: _employeeData.recordset[0].ban_state,
        token: token

    });





    // console.log("Token is sent : ", token)


    // res.send("Login Succcessfully")

    // sql.query(`SELECT emp_id, username, password FROM tb_employee WHERE username='${req.body.username}'`,
    //     (err, result) => {
    //         if (err) {
    //             return res.json({ message: 'error:' }, err);
    //         } else {
    //             if (!result.recordset[0]) {
    //                 console.log('username not found');
    //                 return res.json({ message: 'username not found' });
    //             } else {
    //                 sql.query(`SELECT emp_id, username, password, FROM tb_employee WHERE username='${req.body.username}' 
    //                     AND password='${req.body.password}'`,
    //                     (err, result) => {
    //                         if (err) {
    //                             return res.json({ message: 'error:' }, err);
    //                         }
    //                         else {
    //                             if (!result.recordset[0]) {
    //                                 console.log('password failed', err);
    //                                 return res.json({ message: 'password failed' });
    //                             } else {
    //                                 console.log('login successful');
    //                                 const token = jwt.sign({ data: result.recordset[0] }, process.env.TOKEN_SECRET);
    //                                 res.send({ token })
    //                             }
    //                         }
    //                     });
    //             }
    //         }
    //     });
}

// getEmployeesPagination

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

exports.getEmployeesPagination = async (req, res) => {
    try {

        const { page, size } = req.query;
        const { limit, offset } = getPagination(page, size);


        // const limit = 10;
        // const page = 10;

        const totalPage = await sql.query(`
                    SELECT  count(DISTINCT(emp_id)) AS count FROM tb_employee
                    `)

        await sql.query(
            `  
        SELECT * 
        FROM tb_employee
        ORDER BY emp_id 
        OFFSET (${offset} - 1)*${limit} ROWS
        FETCH NEXT ${limit} ROWS ONLY`
        )
            .then(data => {
                const totalPages = Math.ceil(totalPage.recordset[0].count / limit);
                const response = {
                    data: {
                        "totalItems": totalPage.recordset[0].count,
                        "totalPages": totalPages,
                        // "limit": limit,
                        "currentPages": page + 1 - page,
                        // "currentPageSize": data.recordset.length,
                        "employees": data.recordset
                    }
                };
                res.send(response);
            });

    } catch (error) {
        res.status(500).send({
            message: "Error -> Can NOT complete a paging request!",
            error: error.message,
        });
    }
}

// exports.getEmployeesPagination = async (req, res) => { 


//     sql.query('SELECT * FROM tb_employee', (err, result) => {
//         if (err) {
//             console.log('error while get all employees:', err);
//             return res.json(err);
//         } else {
//             console.log('get all employees');
//             res.send(result.recordset);
//         }
//     });
// }
