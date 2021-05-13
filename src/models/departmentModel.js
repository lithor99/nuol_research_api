const sql = require('../config/dbConfig');

// create department
exports.createDepartment = (req, res) => {
    sql.query(`INSERT INTO tb_department VALUES(N'${req.body.depart_name}', ${req.body.faculty_id})`,
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
    try {
        const _id = req.params.id
        const depart_name = req.body.depart_name
        const faculty_id = req.body.faculty_id
        sql.query(`
        UPDATE tb_department
        SET   
        tb_department.depart_name=N'${depart_name}',
        tb_department.faculty_id=${faculty_id}
        FROM  tb_department
        LEFT JOIN tb_faculty ON tb_faculty.faculty_id = tb_department.faculty_id
        Where tb_department.depart_id =${_id}
        `)
            .then((result) => {
                if (res.status == 200) {
                    res.send({
                        message: "update successfully statua 200 ", result
                    })
                }
                if (res.status >= 400) {
                    res.send({
                        message: "update error department status 400) ", result
                    })
                }
            })
            .catch((err) => {
                res.send({
                    message: `update error author id ${_id}. ${err}`
                })

            });
    } catch (error) {
        console.log("error: ", error)
    }
}

// delete department
exports.deleteDepartment = (req, res) => {
    try {
        const _id = req.params.id
        sql.query(`
    delete tb_department from tb_department left join tb_faculty on tb_faculty.faculty_id = tb_department.depart_id 
    where tb_department.depart_id=${_id}`)
            .then((result) => {
                if (res.status == 200) {
                    res.send({
                        message: "delete successfully ", result
                    })
                }
                if (res.status >= 400) {
                    res.send({
                        message: "delete successfully author ", result
                    })
                }
            })
            .catch((err) => {
                res.send({
                    message: "delete successfully author id ", err
                })

            });
    } catch (error) {
        console.log("error: ", error)
    }

}

// get all department  
exports.getAllDepartment = (req, res) => {
    sql.query(`SELECT tb_department.depart_id, tb_department.depart_name, tb_faculty.faculty_name,tb_faculty.faculty_id
    FROM tb_department INNER JOIN tb_faculty ON tb_department.faculty_id=tb_faculty.faculty_id ORDER BY depart_name ASC;`, (err, result) => {
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
    const _id = req.params.id;
    sql.query(`SELECT depart_id, depart_name, faculty_name from tb_department inner join
	tb_faculty on tb_department.faculty_id=tb_faculty.faculty_id 
    WHERE depart_id=${_id}`, (err, result) => {
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
    WHERE tb_department.depart_name LIKE'N%${req.body.depart_name}%' 
    OR tb_faculty.faculty_name LIKE'N%${req.body.faculty_name}%'`,
        (err, result) => {
            if (err) {
                console.log('error:', err);
                return res.json('error:', err);
            } else {
                res.send(result.recordset);
            }
        });
}
