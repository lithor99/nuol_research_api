const mssql = require('mssql');
// const mysql = require('mysql');


//SQL Server Connection...............................................
const config = {

    // DB TO AWS
    // server: 'leethor.cbi9dad67xbo.ap-southeast-1.rds.amazonaws.com',
    // port: 1433,
    // user: 'admin',
    // password: '12345678',
    // database: 'db_nuol_research',

    // _____________-------------------------______________-------------___________________

    server: 'localhost',
    user: 'sa',
    // password: '12345',
    password: 'simple123',
    database: 'db_nuol_research',
    port: 1443,
    options: {
        'encrypt': true,
        'enableArithAbort': true,
    },
};
mssql.connect(config, async function (err) {

    if (err) {
        console.log('Database connect failed.', err);
    } else {
        console.log('Database connected.');
        // var data =await mssql.query("insert into users values(1,'lee')")
        // var data = await mssql.query("select * from users")
        // console.log('data: ', data.recordset)
    }
});
module.exports = mssql;


//MySQL Connection................................................

// const config = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'db_research_book'
// });
// config.connect(function (err) {
//     if (err){
//         console.log('Connect failed.', err)
//     };
//     console.log("Connected.");
// });
// module.exports=config;