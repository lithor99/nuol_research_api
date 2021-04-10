const sql = require('../config/dbConfig');
const employeeModel=require('../models/employeeModel')

// create faculty
exports.createFaculty = (req, res) => {
    sql.query(`INSERT INTO tb_faculty VALUES('${req.body.faculty_name}')`,
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                res.send(result);
            }
        })
}

// edit faculty
exports.editFaculty = (req, res) => {
    sql.query(`UPDATE tb_faculty SET faculty_name='${req.body.faculty_name}'
    WHERE faculty_id=${req.body.faculty_id}`),
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                res.send(result);
            }
        }
}

// delete faculty
exports.deleteFaculty = (req, res) => {
    sql.query(`DELETE FROM tb_faculty WHERE faculty_id=${req.body.faculty_id}`),
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                res.send(result);
            }
        }
}

// get all faculty  
exports.getAllFaculty = (req, res) => {
    sql.query('SELECT * FROM tb_faculty', (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json(err);
        } else {
            console.log('get all user');
            res.send(result.recordset);
        }
    });
}

// get one faculty  
exports.getOneFaculty = (req, res) => {
    sql.query(`SELECT * FROM tb_faculty WHERE faculty_id=${req.body.faculty_id}`, (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json('error:', err);
        } else {
            res.send(result.recordset);
        }
    });
}

// search faculty
exports.searchFaculty = (req, res) => {
    sql.query(`SELECT * FROM tb_faculty WHERE faculty_name LIKE'%${req.body.faculty_name}%'`, (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json('error:', err);
        } else {
            res.send(result.recordset);
        }
    });
}
