const sql = require('../config/dbConfig');

// create fund
exports.createFund = (req, res) => {
    const { fund_name, tel, email, address } = req.body;
    sql.query(`INSERT INTO tb_fund  VALUES(N'${fund_name}',N'${tel}',N'${email}',N'${address}')`,
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                res.send(result);
            }
        })
}

// edit fund_
exports.editFund = (req, res) => {
    const _id = req.params.id
    const { fund_name, tel, email, address } = req.body;

    sql.query(`UPDATE tb_fund SET fund_name=N'${fund_name}',tel=N'${tel}',email=N'${email}',address=N'${address}'
    WHERE fund_id=${_id}`,
        (err, result) => {
            if (err) {
                res.send('error', err)
                console.log(err)
            } else {
                res.send({
                    message: `fund is edited successfully. result: ${result}`
                });
            }
        });
}

// delete fund
exports.deleteFund = (req, res) => {
    const _id = req.params.id
    sql.query(`DELETE FROM tb_fund WHERE fund_id=${_id}`,
        (err, result) => {
            if (err) {
                res.send({
                    message: `'error', ${err}`
                })
            } else {
                res.send({
                    message: `delete fund with id= ${_id} sccessfully. result= ${result}`
                });
            }
        });
}

// get one fund  
exports.getOneFund = (req, res) => {
    const _id = req.params.id
    sql.query(`SELECT * FROM tb_fund WHERE fund_id=${_id}`, (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json('error:', err);
        } else {
            res.send(result.recordset);
        }
    });
}

// getFundById  
exports.getFundById = (req, res) => {
    const _id = req.params.id

    sql.query(`SELECT * FROM tb_fund WHERE fund_id=${_id}`, (err, result) => {
        if (err) {
            console.log('error:', err);
            return res.json('error:', err);
        } else {
            res.send(result.recordset);
        }
    });
}

exports.getAllFund = async (req, res) => {
    try {
        const totalPage = await sql.query(`
        SELECT  count(DISTINCT(fund_id)) AS count FROM tb_fund
        `)

        await sql.query(`SELECT * FROM tb_fund ORDER BY fund_name ASC`)
            .then(data => {
                const response = {
                    data: {
                        "total_items": totalPage.recordset[0].count,
                        "fund": data.recordset
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
