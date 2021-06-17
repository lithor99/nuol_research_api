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


//import route
// const employeeRoute = require('./src/routes/employeeRoute');
const facultyRoute = require('./src/routes/facultyRoute');
const departmentRoute = require('./src/routes/departmentRoute');
const authorRoute = require('./src/routes/authorRoute');
const commiteeRoute = require('./src/routes/commiteeRoute');
const memberRoute = require('./src/routes/memberRoute');
const fundRoute = require('./src/routes/fundRoute');
const bookRoute = require("./src/routes/bookRoute")
const authorGroupRoute = require("./src/routes/authorGroupRoute")
const employeeRoute = require("./src/routes/employeeRoute")


app.use('/', facultyRoute);
app.use('/', departmentRoute);
app.use('/', authorRoute);
app.use('/', commiteeRoute);
app.use('/', fundRoute);
app.use('/', memberRoute);
app.use('/', employeeRoute);
app.use('/', bookRoute);
app.use('/', authorGroupRoute);


//define listen port
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});


