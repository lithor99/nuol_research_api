const sql = require('../config/dbConfig');
const jwt = require('jsonwebtoken');



// create employee
exports.createEmployee = (req, res) => {
    let { name, surname, username, password, gender, birth_date, tel, email, role, ban_state } = req.body;
    sql.query(`
    INSERT INTO tb_employee VALUES(N'${name}',N'${surname}',N'${username}',N'${password}',N'${gender}',N'${birth_date}',N'${tel}', N'${email}',${role},${ban_state})
    `,
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                res.send(result);
            }
        })
}

// edit employee
exports.editEmployee = (req, res) => {
    let emp_id = req.params.id
    let { name, surname, username, password, gender, birth_date, tel, email, role, ban_state } = req.body;
    sql.query(`UPDATE tb_employee SET name=N'${name}',surname=N'${surname}',
    username=N'${username}',password=N'${password}',
    gender=N'${gender}',birth_date=N'${birth_date}',
    tel=N'${tel}',email=N'${email}',role=${role}, 
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
exports.employeeLogin = (req, res) => {
    sql.query(`SELECT emp_id, username, password FROM tb_employee WHERE username='${req.body.username}'`,
        (err, result) => {
            if (err) {
                return res.json({ message: 'error:' }, err);
            } else {
                if (!result.recordset[0]) {
                    console.log('username not found');
                    return res.json({ message: 'username not found' });
                } else {
                    sql.query(`SELECT emp_id, username, password, FROM tb_employee WHERE username='${req.body.username}' 
                        AND password='${req.body.password}'`,
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
