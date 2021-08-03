const sql = require('../config/dbConfig');

// create author
exports.createAuthor = (req, res) => {

    const { name, surname, gender, birth_date, tel, email, depart_id } = req.body;


    sql.query(`SELECT COUNT(*) AS countAuthorEmail FROM tb_author WHERE tb_author.email=N'${email}'`,
        function (err, response) {
            if (err) {
                res.send("syntax countAuthorEmail error")
            } else if (response.recordset[0].countAuthorEmail > 0) {
                res.send("countAuthorEmail already exist")
            } else if (response.recordset[0].countAuthorEmail <= 0) {
                sql.query(`INSERT INTO tb_author VALUES(N'${name}',N'${surname}',
            N'${gender}',N'${birth_date}',N'${tel}',
            N'${email}',${depart_id})`,
                    (err, result) => {
                        if (err) {
                            res.send("Syntax insert author Error")
                        } else {
                            res.send("success");
                        }
                    })
            }
        })

}

// edit author
exports.editAuthor = async (req, res) => {
    const { name, surname, gender, birth_date, tel, email, depart_id } = req.body;
    const author_id = req.params.id;


    sql.query(`SELECT COUNT(*) AS countAuthorId FROM tb_author WHERE author_id=${author_id}`
        , function (err, response) {
            if (err) {
                res.send("syntax countAuthorId error")
            } else {
                if (response.recordset[0].countAuthorId < 0) {
                    res.send("countAuthorId do not exist");
                } else if (response.recordset[0].countAuthorId > 0) {
                    sql.query(`SELECT COUNT(*) AS countEmailAuthor FROM tb_author WHERE email=N'${email}'`
                        , function (err, response) {
                            if (err) {
                                res.send("syntax countEmailAuthor error")
                            } else {
                                if (response.recordset[0].countEmailAuthor > 0) {
                                    res.send("countEmailAuthor already exist")
                                } else if (response.recordset[0].countEmailAuthor === 0) {
                                    sql.query(`UPDATE tb_author SET name=N'${name}',surname=N'${surname}',
                                    gender=N'${gender}',birth_date=N'${birth_date}',
                                    tel=N'${tel}',email=N'${email}', 
                                    depart_id=${depart_id} WHERE author_id=${author_id}`,
                                        function (err, response) {
                                            if (err) {
                                                res.send("syntax update author error")
                                            } else {
                                                res.send("success")
                                            }
                                        })


                                }
                            }

                        })

                }
            }
        })


    // if (response.recordset[0].countAuthor > 0) {
    //     res.send("countAuthor already exist")
    // } else if (response.recordset[0].countAuthor <= 0) {
    //     sql.query(`SELECT COUNT(*) AS countEmailAuthor FROM tb_author WHERE email=N'${email}'`, function (err, response) {
    //         if (err) {
    //             res.send("syntax countEmailAuthor error")
    //         } else {
    //             if (response.recordset[0].countEmailAuthor > 0) {
    //                 res.send("countEmailAuthor already exist")
    //             } else if (response.recordset[0].countEmailAuthor <= 0) {
    // sql.query(`UPDATE tb_author SET name=N'${name}',surname=N'${surname}',
    // gender=N'${gender}',birth_date=N'${birth_date}',
    // tel=N'${tel}',email=N'${email}', 
    // depart_id=${depart_id} WHERE author_id=N${author_id}`),
    //                     (err, result) => {
    //                         if (err) {
    //                             res.send('syntax update author error:', err);
    //                         } else {
    //                             res.send("success");
    //                         }
    //                     }
    //             }
    //         }
    //     })
    // }



}

// delete author
exports.deleteAuthor = (req, res) => {

    const author_id = req.params.id

    sql.query(`
SELECT COUNT(*) AS countAuthorDelete From tb_author WHERE author_id=${author_id}
`, function (err, response) {
        if (err) {
            res.send("Syntax countAuthorDelete Error: ", err)
        } else {
            if (response.recordset[0].countAuthorDelete <= 0) {
                res.send("countAuthorDelete has no value")
            } else if (response.recordset[0].countAuthorDelete > 0) {
                sql.query(`
                delete tb_author from tb_author left join tb_department on tb_author.depart_id = tb_department.depart_id
                left join tb_faculty on tb_faculty.faculty_id = tb_department.faculty_id WHERE tb_author.author_id=${author_id}`,
                    (err, result) => {
                        if (err) {
                            res.send("countAuthorDelete is used")
                        } else {
                            res.send("success")
                        }
                    })
            }
        }
    })


}

// get all author  
exports.getAllAuthor = async (req, res) => {
    try {
        const totalPage = await sql.query(`
        SELECT  count(DISTINCT(author_id)) AS count FROM tb_author
        `)
        const faculty = await sql.query(`
        select * from tb_faculty inner join tb_department on tb_faculty.faculty_id = tb_department.faculty_id
        `)
        const searchFaculty = await sql.query(`
        select * from tb_faculty
        `)

        await sql.query(
            `SELECT tb_author.author_id, tb_author.name, tb_author.surname, tb_author.gender,
    tb_author.birth_date, tb_author.tel, tb_author.email, tb_faculty.faculty_name, 
    tb_faculty.faculty_id, tb_department.depart_name FROM tb_author INNER JOIN tb_department 
    ON tb_author.depart_id=tb_department.depart_id INNER JOIN tb_faculty
    ON tb_department.faculty_id=tb_faculty.faculty_id  ORDER BY tb_author.name ASC`)
            .then(data => {
                const response = {
                    data: {
                        "searchFaculty": searchFaculty.recordset,
                        "faculty": faculty.recordset,
                        "total_items": totalPage.recordset[0].count,
                        "author": data.recordset
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

// get one author  
exports.getOneAuthor = (req, res) => {
    const _id = req.params.id
    sql.query(`SELECT tb_author.author_id, tb_author.name,tb_author.surname, tb_author.gender,tb_department.depart_id,
    tb_author.birth_date, tb_author.tel, tb_author.email, tb_faculty.faculty_name, 
    tb_department.depart_name,tb_author.author_id,tb_faculty.faculty_id FROM tb_author INNER JOIN tb_department 
    ON tb_author.depart_id=tb_department.depart_id INNER JOIN tb_faculty
    ON tb_department.faculty_id=tb_faculty.faculty_id
    WHERE tb_author.author_id=${_id}`,
        (err, result) => {
            if (err) {
                console.log('error:', err);
                return res.json('error:', err);
            } else {
                res.send(result.recordset);
            }
        });
}

// search employee
exports.searchAuthor = (req, res) => {
    sql.query(`SELECT tb_author.author_id, tb_author.name_surname, tb_author.gender,
    tb_author.birth_date, tb_author.tel, tb_author.email, tb_faculty.faculty_name, 
    tb_department.depart_name FROM tb_author INNER JOIN tb_department 
    ON tb_author.depart_id=tb_department.depart_id INNER JOIN tb_faculty
    ON tb_department.faculty_id=tb_faculty.faculty_id
    WHERE tb_author.name_surname LIKE '%${req.body.name_surname}%'
    OR tb_faculty.faculty_name LIKE '%${req.body.faculty_name}%'
    OR tb_department.depart_name LIKE '%${req.body.depart_name}%'`,
        (err, result) => {
            if (err) {
                console.log('error:', err);
                return res.json('error:', err);
            } else {
                res.send(result.recordset);
            }
        });
}
