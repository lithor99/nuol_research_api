const sql = require('../config/dbConfig');

// create author
exports.createAuthor = (req, res) => {
    sql.query(`INSERT INTO tb_author VALUES(N'${req.body.name}',N'${req.body.surname}',
        N'${req.body.gender}',N'${req.body.birth_date}',N'${req.body.tel}',
        N'${req.body.email}',${req.body.depart_id})`,
        (err, result) => {
            if (err) {
                res.send('error:', err)
                console.log(err)
            } else {
                res.send(result);
            }
        })
}

// edit author
exports.editAuthor = async (req, res) => {
    sql.query(`UPDATE tb_author SET name=N'${req.body.name}',surname=N'${req.body.surname}',
        gender=N'${req.body.gender}',birth_date=N'${req.body.birth_date}',
        tel=N'${req.body.tel}',email=N'${req.body.email}', 
        depart_id=${req.body.depart_id} WHERE author_id=${req.params.id}`),
        (err, result) => {
            if (err) {
                res.send('error:', err);
                console.log('error:', err);
            } else {
                res.send(result);
            }
        }


}

// delete author
exports.deleteAuthor = (req, res) => {
    sql.query(`
        delete tb_author from tb_author left join tb_department on tb_author.depart_id = tb_department.depart_id
		left join tb_faculty on tb_faculty.faculty_id = tb_department.faculty_id WHERE tb_author.author_id=${req.params.id}`),
        (err, result) => {
            if (err) {
                res.send('error:', err)
                console.log('error:', err)
            } else {
                res.send(result);
            }
        }
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
    sql.query(`SELECT tb_author.author_id, tb_author.name,tb_author.surname, tb_author.gender,
        tb_author.birth_date, tb_author.tel, tb_author.email, tb_faculty.faculty_name, 
        tb_department.depart_name FROM tb_author INNER JOIN tb_department 
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
