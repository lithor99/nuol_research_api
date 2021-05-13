const sql = require('../config/dbConfig');

// create commitee
exports.createCommitee = async (req, res) => {
    const { name_surname, gender, tel, email } = req.body;
    sql.query(
        `
            INSERT INTO tb_commitee (name_surname, gender, tel, email) VALUES (N'${name_surname}', N'${gender}',${tel} ,N'${email}')`,
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                res.send(result);
            }
        })
}

// edit commitee
exports.editCommitee = async (req, res) => {
    const { name_surname, tel, email, gender } = req.body;
    const _id = req.params.id;

    sql.query(`
    UPDATE tb_commitee SET name_surname=N'${name_surname}',
    gender=N'${gender}',tel=${tel},email=N'${email}'
    WHERE commit_id=${_id}
    `,
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

// delete commitee
exports.deleteCommitee = (req, res) => {
    const _id = req.params.id
    sql.query(`DELETE FROM tb_commitee WHERE commit_id=${_id}`)
        .then((result) => {
            if (res.status == 200) {
                res.send({
                    message: "tb_commitee successfully statua 200 ", result
                })
            }
            if (res.status >= 400) {
                res.send({
                    message: "tb_commitee error department status 400) ", result
                })
            }
        })
        .catch((err) => {
            res.send({
                message: `tb_commitee error author id ${_id}. ${err}`
            })

        });
}

// get all commitee  
exports.getAllCommitee = (req, res) => {
    sql.query(`SELECT * FROM tb_commitee`,
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
    sql.query(`SELECT * FROM tb_commitee WHERE name_surname LIKE '%${req.body.name_surname}%'`,
        (err, result) => {
            if (err) {
                console.log('error:', err);
                return res.json('error:', err);
            } else {
                res.send(result.recordset);
            }
        });
}
