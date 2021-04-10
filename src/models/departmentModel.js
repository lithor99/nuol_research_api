const sql = require('../config/dbConfig');

// create department
exports.createDepartment = (req, res) => {
    sql.query(`INSERT INTO tb_department VALUES('${req.body.depart_name}', ${req.body.faculty_id})`,
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                res.send(result);
            }
        })
}

// edit department
exports.editDepartment = (req, res) => {
    sql.query(`UPDATE tb_department SET depart_name='${req.body.depart_name}', 
    faculty_id=${req.body.faculty_id} WHERE depart_id=${req.body.depart_id}`),
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                res.send(result);
            }
        }
}

// delete department
exports.deleteDepartment = (req, res) => {
    sql.query(`DELETE FROM tb_department WHERE depart_id=${req.body.depart_id}`),
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                res.send(result);
            }
        }
}

// get all department  
exports.getAllDepartment = (req, res) => {
    sql.query(`SELECT tb_department.depart_id, tb_department.depart_name, tb_faculty.faculty_name
    FROM tb_department INNER JOIN tb_faculty ON tb_department.faculty_id=tb_faculty.faculty_id`, (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json(err);
        } else {
            console.log('get all user');
            res.send(result.recordset);
        }
    });
}

// get one department  
exports.getOneDepartment = (req, res) => {
    sql.query(`SELECT tb_department.depart_id, tb_department.depart_name, tb_faculty.faculty_name
    FROM tb_department INNER JOIN tb_faculty ON tb_department.faculty_id=tb_faculty.faculty_id 
    WHERE depart_id=${req.body.depart_id}`, (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json('error:', err);
        } else {
            res.send(result.recordset);
        }
    });
}

// search department
exports.searchDepartment = (req, res) => {
    sql.query(`SELECT tb_department.depart_id, tb_department.depart_name, tb_faculty.faculty_name
    FROM tb_department INNER JOIN tb_faculty ON tb_department.faculty_id=tb_faculty.faculty_id 
    WHERE tb_department.depart_name LIKE'%${req.body.depart_name}%' 
    OR tb_faculty.faculty_name LIKE'%${req.body.faculty_name}%'`,
        (err, result) => {
            if (err) {
                console.log('error:', err);
                return res.json('error:', err);
            } else {
                res.send(result.recordset);
            }
        });
}
