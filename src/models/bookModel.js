const sql = require('../config/db.config');

// var Employee = function (employee) {
//     // this.emp_id = employee.emp_id;
//     this.name_surname = employee.name_surname;
//     this.username = employee.username;
//     this.password = employee.password;
//     this.gender = employee.gender;
//     this.birth_date = employee.birth_date;
//     this.tel = employee.tel;
//     this.email = employee.email;
//     this.role = employee.role;
//     this.ban_state = employee.ban_state;
// }

// create employee
exports.createEmployee = (req, res) => {
    sql.query(`INSERT INTO tb_employee VALUES('${req.body.name_surname}',
        '${req.body.username}','${req.body.password}','${req.body.gender}','${req.body.birth_date}',
        '${req.body.tel}','${req.body.email}',${req.body.role}, ${req.body.ban_state})`,
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
    sql.query(`UPDATE tb_employee SET name_surname='${req.body.name_surname}',
    username='${req.body.username}',password='${req.body.password}',
    gender='${req.body.gender}',birth_date='${req.body.birth_date}',
    tel='${req.body.tel}',email='${req.body.email}',role=${req.body.role}, 
    ban_state=${req.body.ban_state} WHERE emp_id=${req.body.emp_id}`),
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                res.send(req.body.emp_id);
                // return res.json(req.body.emp_id);
            }
        }
}

// delete employee
exports.deleteEmployee = (req, res) => {
    sql.query(`DELETE FROM tb_employee WHERE emp_id=${req.body.emp_id}`),
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
    sql.query(`SELECT * FROM tb_employee WHERE emp_id=${req.body.emp_id}`, (err, result) => {
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

// //user login 
// User.login = (req, res) => {
//     dbcon.query('SELECT user_id, username FROM tb_users WHERE username=?', req.body.username, (err, result) => {
//         if (err) {
//             console.log('No user', err);
//             // return res.json(err);
//         } else {
//             dbcon.query('SELECT user_id, username FROM tb_users WHERE password=?', req.body.password, (err, result) => {
//                 if (err) {
//                     console.log('password failed', err);
//                     // return res.json(err);
//                 } else {
//                     console.log('login successful');
//                     // return res.json(result);
//                     res.send(result)
//                 }
//             });
//             // console.log('login successful');
//             // console.log(req.body.password);
//             // // return res.json(result);
//             // res.send(result);
//         }
//     });
// }

// module.exports = Employee;