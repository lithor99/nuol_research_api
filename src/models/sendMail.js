var nodemailer = require('nodemailer');
//https://stackoverflow.com/questions/33493963/nodemailer-is-not-able-send-mail-using-gmail
var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 534,
  secure: false, 
  auth: {
    user: 'leethorxiongpor1999@gmail.com',
    pass: '1999@igmail.lee'
  }
});

var mailOptions = {
  from: 'leethorxiongpor1999@gmail.com',
  to: 'leethor7599@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'Hi, I am node.js testing!'
};

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });