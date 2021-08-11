const sql = require('../config/dbConfig');

// create department
exports.createDepartment = async (req, res) => {
    const { depart_name, faculty_id } = req.body;

    await sql.query(`SELECT COUNT(*) AS countDepartName FROM tb_department WHERE depart_name=N'${depart_name}'`,
        function (err, response) {
            if (err) {
                res.send("syntax countDepartName error")
            } else if (response.recordset[0].countDepartName > 0) {
                res.send("countDepartName already exist")
            } else if (response.recordset[0].countDepartName <= 0) {
                sql.query(`INSERT INTO tb_department VALUES(N'${depart_name}', ${faculty_id})`,
                    (err, result) => {
                        if (err) {
                            res.send("syntax insert departmetn error")
                        } else if (result) {
                            res.send("success");
                        }
                    })
            }
        })
}

// edit department
exports.editDepartment = async (req, res) => {
    try {
        const _id = req.params.id
        const depart_name = req.body.depart_name
        const faculty_id = req.body.faculty_id;

        sql.query(`
        UPDATE tb_department
        SET   
        tb_department.depart_name=N'${depart_name}',
        tb_department.faculty_id=${faculty_id}
        FROM  tb_department
        LEFT JOIN tb_faculty ON tb_faculty.faculty_id = tb_department.faculty_id
        Where tb_department.depart_id =${_id}
        `, function (err, result) {
            if (err) {
                res.send("syntax update department error")
            } else {
                res.send("success")
            }
        })
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
    where tb_department.depart_id=${_id}`,
            function (err, response) {
                if (err) {
                    res.send("department working")
                } else if (response) {
                    res.send("success")
                }
            })
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
    sql.query(`SELECT depart_id, depart_name, faculty_name,tb_department.faculty_id from tb_department inner join
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
