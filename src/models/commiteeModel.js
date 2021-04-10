const sql = require('../config/dbConfig');

// create commitee
exports.createCommitee = (req, res) => {
    sql.query(`INSERT INTO tb_commitee VALUES('${req.body.name_surname}',
        '${req.body.gender}','${req.body.tel}', '${req.body.email}')`,
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
exports.editCommitee = (req, res) => {
    sql.query(`UPDATE tb_commitee SET name_surname='${req.body.name_surname}',
        gender='${req.body.gender}',tel='${req.body.tel}',email='${req.body.email}'
        WHERE commit_id=${req.body.commit_id}`),
        (err, result) => {
            if (err) {
                res.send('error:', err);
                console.log('error:', err);
            } else {
                res.send(result);
            }
        }
}

// delete commitee
exports.deleteCommitee = (req, res) => {
    sql.query(`DELETE FROM tb_commitee WHERE commit_id=${req.body.commit_id}`),
        (err, result) => {
            if (err) {
                res.send('error:', err)
                console.log('error:', err)
            } else {
                res.send(result);
            }
        }
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
    sql.query(`SELECT * FROM tb_commitee WHERE commit_id=${req.body.commit_id}`,
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
