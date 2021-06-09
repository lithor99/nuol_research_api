


const { result } = require('lodash');
const sql = require('../config/dbConfig');


exports.createAuthor_group = (req, res) => {

    const author_id = req.body.author_id
    const book_id = req.body.book_id

    sql.query(`
    INSERT INTO tb_author_group (book_id,author_id)  VALUES (N'${book_id}',${author_id});`)
        .then((result) => {
            if (res.status == 200) {
                console.log("ssucessdfully: ", result)
                res.send({
                    message: "delete successfully ", result
                })
            }
            if (res.status >= 400) {
                res.send({
                    message: "delete error author.... ", result
                })
                console.log("error: ", result)
            }
        })
        .catch((err) => {
            res.send({
                message: "delete error author id ", err
            })
            console.log("error leo: ", result)
        });
}



// get all authorGroup
exports.getSingleAuthorGroup = (req, res) => {
    const book_id = req.params.id
    sql.query(`select author_id from tb_author_group where book_id=N'${book_id}';`,
        (err, result) => {
            if (err) {
                console.log('error while fetching user by id', err);
                return res.json(err);
            } else {
                console.log('get all author_group');
                res.send(result.recordset);

            }
        });
}


exports.deleteAuthor_group = (req, res) => {
    try {
        const { book_id, author_id } = req.body;

        sql.query(`DELETE FROM tb_author_group WHERE author_id=${author_id} and book_id=N'${book_id}'`,
            (err, result) => {
                if (err) {
                    console.log('error while fetching author_id by id', err);
                    res.send(err);
                } else {
                    console.log('get all successfully author_id delete');
                    res.send(result.recordset);

                }
            });
    } catch (error) {
        console.log("ERORR: ", error)
    }
}


// update AuthorGroup By Id

exports.updateAuthor_group = (req, res) => {

    const author_id = req.body.author_id
    const book_id = req.body.book_id

    sql.query(`UPDATE tb_author_group SET author_id=${author_id} WHERE book_id=N'${book_id}'`)
        .then((result) => {
            if (res.status == 200) {
                console.log("ssucessdfully update: ", result)
                res.send({
                    message: "update successfully ", result
                })
            }
            if (res.status >= 400) {
                res.send({
                    message: "update error author.... ", result
                })
                console.log("error update: ", result)
            }
        })
        .catch((err) => {
            res.send({
                message: "update error author id ", err
            })
            console.log("update error leo: ", result)
        });
}