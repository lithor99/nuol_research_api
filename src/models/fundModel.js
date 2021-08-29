const sql = require('../config/dbConfig');

// create fund
exports.createFund = async (req, res) => {
    const { fund_name, tel, email, address } = req.body;

    await sql.query(`SELECT COUNT(*) AS FundEmail  FROM tb_fund WHERE email=N'${email}'`,
        function (err, response) {
            if (err) {
                res.send("syntax FundEmail error")
            } else {
                if (response.recordset[0].FundEmail > 0) {
                    res.send("FundEmail alread exist")
                } else if (response.recordset[0].FundEmail === 0) {

                    sql.query(`INSERT INTO tb_fund  VALUES(N'${fund_name}',N'${tel}',N'${email}',N'${address}')`,
                        (err, result) => {
                            if (err) {
                                res.send("syntax fund error")
                            } else {
                                res.send("success");
                            }
                        })

                }
            }
        })


}

// edit fund_
exports.editFund = async (req, res) => {
    const _id = req.params.id
    const { fund_name, tel, email, address } = req.body;

    sql.query(`
    UPDATE tb_fund SET fund_name=N'${fund_name}',tel=N'${tel}',email=N'${email}',address=N'${address}'
    WHERE fund_id=${_id}`, function (err, result) {
        if (err) {
            res.send("countEmail syntax error")
        } else {
            res.send("success")
        }
    })

}

// delete fund
exports.deleteFund = async (req, res) => {
    const _id = req.params.id;

    await sql.query(`SELECT COUNT(*) AS countFundId FROM tb_fund WHERE fund_id=${_id}`,
        function (err, response) {
            if (err) {
                res.send("syntax countFundId error")
            } else {
                if (response.recordset[0].countFundId <= 0) {
                    res.send("countFundId do not exist")
                } else if (response.recordset[0].countFundId > 0) {
                    sql.query(`DELETE FROM tb_fund WHERE fund_id=${_id}`,
                        (err, result) => {
                            if (err) {
                                res.send("fundId working")
                            } else {
                                res.send("success");
                            }
                        });
                }
            }
        })
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
