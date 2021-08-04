const sql = require('../config/dbConfig');

// create faculty
exports.createFaculty = async (req, res) => {

    const faculty_name = req.body

    await sql.query(`SELECT COUNT(*) AS countFundName FROM tb_faculty WHERE faculty_name=N'${faculty_name}'`,
        function (err, response) {
            if (err) {
                res.send("faculty syntax error")
            } else {
                if (response.recordset[0].countFundName > 0) {
                    res.send("countFundName already exist")
                } else if (response.recordset[0].countFundName <= 0) {
                    sql.query(`INSERT INTO tb_faculty VALUES(N'${faculty_name}')`,
                        (err, result) => {
                            if (err) {
                                console.log("faculty syntax error")
                            } else {
                                res.send("success");
                            }
                        })
                }
            }

        })


}

// edit faculty_
exports.editFaculty = (req, res) => {
    const _id = req.params.id
    const faculty_name = req.body.faculty_name

    sql.query(`UPDATE tb_faculty SET faculty_name=N'${faculty_name}'
    WHERE faculty_id=${_id}`,
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                res.send({
                    message: `Faculty is edited successfully. result: ${result}`
                });
            }
        });
}

// delete faculty
exports.deleteFaculty = (req, res) => {
    const _id = req.params.id
    sql.query(`DELETE FROM tb_faculty WHERE faculty_id=${_id}`,
        (err, result) => {
            if (err) {
                res.send("faculty working")
            } else {
                res.send("success");
            }
        });
}


// get one faculty  
exports.getOneFaculty = (req, res) => {
    const _id = req.params.id
    sql.query(`SELECT * FROM tb_faculty WHERE faculty_id=${_id}`, (err, result) => {
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
    const facultyName = req.params.faculty_name
    sql.query(`SELECT * FROM tb_faculty WHERE faculty_name LIKE'N%${facultyName}%'`, (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json('error:', err);
        } else {
            res.send(result.recordset);
        }
    });
}

// pagination faculty
exports.pagination = async (req, res) => {
    try {

        const page = parseInt(req.params.page_Id);
        const limit = parseInt(req.params.limit_Id);
        const totalPage = await sql.query(`
                    SELECT  count(DISTINCT(faculty_id)) AS count FROM tb_faculty
                    `)

        await sql.query(
            `  
        SELECT faculty_id,faculty_name 
        FROM tb_faculty
        ORDER BY faculty_id 
        OFFSET (${page} - 1)*${limit} ROWS
        FETCH NEXT ${limit} ROWS ONLY`
        )
            .then(data => {
                const totalPages = Math.ceil(totalPage.recordset[0].count / limit);
                const response = {
                    data: {
                        "total_items": totalPage.recordset[0].count,
                        "total_pages": totalPages,
                        "limit_page": limit,
                        "currentpage": page,
                        "currentPageSize": data.recordset.length,
                        "faculty": data.recordset
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

exports.getAllFaculty = async (req, res) => {
    try {
        const totalPage = await sql.query(`
        SELECT  count(DISTINCT(faculty_id)) AS count FROM tb_faculty
        `)

        await sql.query(`SELECT * FROM tb_faculty ORDER BY faculty_name ASC`)
            .then(data => {
                const response = {
                    data: {
                        "total_items": totalPage.recordset[0].count,
                        "faculty": data.recordset
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
