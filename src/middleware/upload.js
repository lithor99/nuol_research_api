const util = require("util");
const multer = require("multer");
const path = require('path');
const maxSize = 1000 * 1024 * 1024;

//https://stackoverflow.com/questions/30845416/how-to-go-back-1-folder-level-with-dirname
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;