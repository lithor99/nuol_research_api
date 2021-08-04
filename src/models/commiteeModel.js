const sql = require('../config/dbConfig');

// create commitee
exports.createCommitee = async (req, res) => {
    const { name, surname, gender, tel, email } = req.body;

    sql.query(`SELECT COUNT(*) AS countEmail FROM tb_commitee WHERE email=N'${email}'`,
        function (err, response) {
            if (err) {
                res.send("countEmail syntax error")
            } else {
                if (response.recordset[0].countEmail > 0) {
                    res.send("countEmail already exist")
                } else if (response.recordset[0].countEmail <= 0) {
                    sql.query(`INSERT INTO tb_commitee (name,surname, gender, tel, email) VALUES (N'${name}',N'${surname}', N'${gender}',${tel} ,N'${email}')`,
                        function (err, result) {
                            if (err) {
                                res.send("insert committee syntax error")
                            } else {
                                res.send("success")
                            }
                        })
                }
            }

        })
}

// edit commitee
exports.editCommitee = async (req, res) => {
    const { name, surname, tel, email, gender } = req.body;
    const _id = req.params.id;

    sql.query(`
    UPDATE tb_commitee SET name=N'${name}',surname=N'${surname}',
    gender=N'${gender}',tel=${tel},email=N'${email}'
    WHERE commit_id=${_id}
    `,
        (err, result) => {
            if (err) {
                res.send('syntax update committee error')
            } else {
                res.send("success");
            }
        });
}

// delete commitee
exports.deleteCommitee = async (req, res) => {
    const _id = req.params.id;

    await sql.query(`SELECT COUNT(*) AS countCommitId FROM tb_commitee WHERE commit_id=${_id}`,
        function (err, response) {
            if (err) {
                res.send("countCommitId syntax error")
            } else {
                if (response.recordset[0].countCommitId <= 0) {
                    res.send("countCommitId do not exist")
                } else if (response.recordset[0].countCommitId > 0) {
                    sql.query(`DELETE FROM tb_commitee WHERE commit_id=${_id}`,
                        function (err, result) {
                            if (err) {
                                res.send("countCommitId working")
                            } else {
                                res.send("success")
                            }
                        })

                }

            }
        })
}

// get all commitee  
exports.getAllCommitee = (req, res) => {
    sql.query(`SELECT * FROM tb_commitee ORDER BY name ASC;`,
        (err, result) => {
            if (err) {
                console.log('error while fetching committee by id', err);
                return res.json(err);
            } else {
                console.log('get all committee');
                res.send(result.recordset);
            }
        });
}

// get one commitee  
exports.getOneCommitee = (req, res) => {
    const _id = req.params.id;
    sql.query(`SELECT * FROM tb_commitee WHERE commit_id=${_id}`,
        (err, result) => {
            if (err) {
                console.log('error:', err);
                return res.json('error:', err);
            } else {
                res.send(result.recordset);
            }
        });
}

// search commitee
exports.searchCommitee = (req, res) => {
    sql.query(`SELECT * FROM tb_commitee WHERE name LIKE '%${req.body.name}%'`,
        (err, result) => {
            if (err) {
                console.log('error:', err);
                return res.json('error:', err);
            } else {
                res.send(result.recordset);
            }
        });
}



// getSingleCommiteeDetail 

exports.getSingleCommiteeDetail = (req, res) => {
    const book_id = req.params.id
    sql.query(`SELECT * FROM tb_commitee_detail where book_id='${book_id}'`,
        (err, result) => {
            if (err) {
                console.log('error while fetching singleCommitteDetail by id', err);
                return res.json(err);
            } else {
                console.log('get all singleCommitteDetail');
                res.send(result.recordset);

            }
        });
}

exports.deleteCommitteeDetail = (req, res) => {
    try {
        const { book_id, commit_id } = req.body;

        sql.query(`DELETE FROM tb_commitee_detail WHERE commit_id=${commit_id} and book_id='${book_id}'`,
            (err, result) => {
                if (err) {
                    console.log('error while fetching commit_id by id', err);
                    res.send(err);
                } else {
                    console.log('get all successfulyy commit_id delete');
                    res.send(result.recordset);

                }
            });
    } catch (error) {
        console.log("ERORR: ", error)
    }
}


// createCommitteeDetail

exports.createCommitteeDetail = (req, res) => {

    const commit_id = req.body.commit_id
    const book_id = req.body.book_id

    sql.query(`
        INSERT INTO tb_commitee_detail (book_id,commit_id)  VALUES (N'${book_id}',${commit_id});`)
        .then((result) => {
            if (res.status == 200) {
                console.log("ssucessdfully: ", result)
                res.send({
                    message: "create successfully committee group ", result
                })
            }
            if (res.status >= 400) {
                res.send({
                    message: "create error commit.... ", result
                })
                console.log("error: ", result)
            }
        })
        .catch((err) => {
            res.send({
                message: "create error commit id ", err
            })
            console.log("error leo: ", result)
        });
}