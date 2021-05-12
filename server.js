const express = require('express');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
require('dotenv').config();
// const path = require('path');
// const util = require('util');
// const fs=require('fs');
// const morgan = require('morgan');
// const _ = require('lodash');

//create express app
const app = express();

//setup the server port
const port = process.env.PORT || 9000;

// using body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileupload());
// app.use(express.static('./public/upload'));
// app.use(morgan('dev'));


//define home route
app.get('/', (req, res) => {
    res.send('Welcome to nuol research api');
});

// app.get('/upload', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// });

// app.post('/upload', async (req, res) => {
//     try {
//         const file = req.files.file;
//         const fileName = file.name;
//         const size = file.data.length;
//         const extension = path.extname(fileName);
//         // const allowedExtensions=/png|jpeg|jpg|gif;
//         const md5 = flie.md5;
//         const url = '/upload/' + md5 + extension;
//         await util.promisify(file.mv)('./public' + url);
//         // file.mv(directory,(err)=>{

//         // })
//         res.json({
//             message: 'file uploaded',
//             url: url
//         });
//     } catch (err) {
//         console.log(err)
//     }




//     // if(req.files){
//     //     console.log(req.files.file);
//     //     console.log('no files')
//     // }else{
//     //     // console.log('no files')
//     // }
// });

app.post('/upload', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let file = req.files.file;
            file.mv('./public/uploads/' + file.name);
            res.json({
                message: 'File is uploaded',
                data: {
                    name: file.name,
                    mimetype: file.mimetype,
                    size: file.size
                },
                url: './public/upload/' + file.name
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

//import route
const employeeRoute = require('./src/routes/employeeRoute');
const facultyRoute = require('./src/routes/facultyRoute');
const departmentRoute = require('./src/routes/departmentRoute');
const authorRoute = require('./src/routes/authorRoute');
const commiteeRoute = require('./src/routes/commiteeRoute');
const memberRoute = require('./src/routes/memberRoute');

app.use('/employee', employeeRoute);
app.use('/', facultyRoute);
app.use('/', departmentRoute);
app.use('/', authorRoute);
app.use('/commitee', commiteeRoute);
app.use('/member', memberRoute);

//define listen port
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});


