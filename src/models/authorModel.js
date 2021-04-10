const sql = require('../config/dbConfig');

// create author
exports.createAuthor = (req, res) => {
    sql.query(`INSERT INTO tb_author VALUES('${req.body.name_surname}',
        '${req.body.gender}','${req.body.birth_date}','${req.body.tel}',
        '${req.body.email}',${req.body.depart_id})`,
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
exports.editAuthor = (req, res) => {
    sql.query(`UPDATE tb_author SET name_surname='${req.body.name_surname}',
        gender='${req.body.gender}',birth_date='${req.body.birth_date}',
        tel='${req.body.tel}',email='${req.body.email}', 
        depart_id=${req.body.depart_id} WHERE author_id=${req.body.author_id}`),
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
    sql.query(`DELETE FROM tb_author WHERE author_id=${req.body.author_id}`),
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
exports.getAllAuthor = (req, res) => {
    sql.query(`SELECT tb_author.author_id, tb_author.name_surname, tb_author.gender,
        tb_author.birth_date, tb_author.tel, tb_author.email, tb_faculty.faculty_name, 
        tb_department.depart_name FROM tb_author INNER JOIN tb_department 
        ON tb_author.depart_id=tb_department.depart_id INNER JOIN tb_faculty
        ON tb_department.faculty_id=tb_faculty.faculty_id`,
        (err, result) => {
            if (err) {
                console.log('error while fetching user by id', err);
                return res.json(err);
            } else {
                console.log('get all user');
                res.send(result.recordset);
            }
        });
}

// get one author  
exports.getOneAuthor = (req, res) => {
    sql.query(`SELECT tb_author.author_id, tb_author.name_surname, tb_author.gender,
        tb_author.birth_date, tb_author.tel, tb_author.email, tb_faculty.faculty_name, 
        tb_department.depart_name FROM tb_author INNER JOIN tb_department 
        ON tb_author.depart_id=tb_department.depart_id INNER JOIN tb_faculty
        ON tb_department.faculty_id=tb_faculty.faculty_id
        WHERE tb_author.author_id=${req.body.author_id}`,
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
