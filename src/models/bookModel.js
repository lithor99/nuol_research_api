const sql = require('../config/dbConfig');
const nodemailer = require('nodemailer');
const upload = require('../middleware/upload');
const jwt = require('jsonwebtoken');
const fileupload = require('express-fileupload');
const path = require('path');
const http = require('http');
const fs = require('fs');
const { json } = require('body-parser');
const { dirname } = require('path');
const { DateTime } = require('../config/dbConfig');
// const { param } = require('../routes/memberRoute');
// const fileupload = require('express-fileupload');
// const util = require('util');
// const morgan = require('morgan');
// const _ = require('lodash');
// app.use(fileupload());
// app.use(morgan('dev'));


// // create employee
// exports.createEmployee = (req, res) => {
//     sql.query(`INSERT INTO tb_employee VALUES('${req.body.name_surname}',
//         '${req.body.username}','${req.body.password}','${req.body.gender}','${req.body.birth_date}',
//         '${req.body.tel}','${req.body.email}',${req.body.role}, ${req.body.ban_state})`,
//         (err, result) => {
//             if (err) {
//                 res.send('error', err)
//                 console.log(err)
//             } else {
//                 res.send(result);
//             }
//         })
// }

// // edit employee
// exports.editEmployee = (req, res) => {
//     sql.query(`UPDATE tb_employee SET name_surname='${req.body.name_surname}',
//     username='${req.body.username}',password='${req.body.password}',
//     gender='${req.body.gender}',birth_date='${req.body.birth_date}',
//     tel='${req.body.tel}',email='${req.body.email}',role=${req.body.role}, 
//     ban_state=${req.body.ban_state} WHERE emp_id=${req.body.emp_id}`),
//         (err, result) => {
//             if (err) {
//                 res.send('error', err)
//                 console.log(err)
//             } else {
//                 res.send(req.body.emp_id);
//                 // return res.json(req.body.emp_id);
//             }
//         }
// }

// // delete employee
// exports.deleteEmployee = (req, res) => {
//     sql.query(`DELETE FROM tb_employee WHERE emp_id=${req.body.emp_id}`),
//         (err, result) => {
//             if (err) {
//                 res.send('error', err)
//                 console.log(err)
//             } else {
//                 res.send(result);
//             }
//         }
// }

// // get all employee  
// exports.getAllEmployee = (req, res) => {
//     sql.query('SELECT * FROM tb_employee', (err, result) => {
//         if (err) {
//             console.log('error:', err);
//             return res.json(err);
//         } else {
//             console.log('get all user');
//             res.send(result.recordset);
//         }
//     });
// }

// // get one employee  
// exports.getOneEmployee = (req, res) => {
//     sql.query(`SELECT * FROM tb_employee WHERE emp_id=${req.body.emp_id}`, (err, result) => {
//         if (err) {
//             console.log('error:', err);
//             return res.json('error:', err);
//         } else {
//             res.send(result.recordset);
//         }
//     });
// }

//view book as all
exports.viewBookAsAll = (req, res) => {
    sql.query(`SELECT tb_book.book_id, tb_book.book_name, tb_book.book_group, tb_book.year_print, 
    tb_book.total_view, tb_book.total_load, count(tb_like.member_id) AS total_like
    FROM tb_book FULL OUTER JOIN tb_like ON tb_book.book_id = tb_like.book_id
    WHERE tb_book.upload_state='true'
    GROUP BY tb_book.book_id, tb_book.book_name, tb_book.book_group, tb_book.year_print, tb_book.total_view, tb_book.total_load`,
        (err, result) => {
            if (err) {
                return res.json('error')
            } else {
                if (result.recordset) {
                    return res.json(result.recordset)
                }
            }
        })
}

//view book as search
exports.viewBookAsSearch = (req, res) => {
    sql.query(`SELECT tb_book.book_id, tb_book.book_name, tb_book.book_group, tb_book.year_print, 
    tb_book.total_view, tb_book.total_load, count(tb_like.member_id) AS total_like
    FROM tb_book FULL OUTER JOIN tb_like ON tb_book.book_id = tb_like.book_id
    WHERE (tb_book.book_name LIKE('%${req.body.search}%') OR tb_book.book_group LIKE('%${req.body.search}%') 
    OR tb_book.year_print LIKE('%${req.body.search}%')) AND tb_book.upload_state='true'
    GROUP BY tb_book.book_id, tb_book.book_name, tb_book.book_group, tb_book.year_print, tb_book.total_view, tb_book.total_load`,
        (err, result) => {
            if (err) {
                return res.json('error')
            } else {
                if (result.recordset) {
                    return res.json(result.recordset)
                }
            }
        })
}

//view book as view
exports.viewBookAsView = (req, res) => {
    sql.query(`SELECT  TOP(${req.body.top}) tb_book.book_id, tb_book.book_name, tb_book.book_group, tb_book.year_print, tb_book.total_view, tb_book.total_load, 
    COUNT(tb_like.member_id) as total_like
    FROM tb_book FULL OUTER JOIN tb_like ON tb_book.book_id = tb_like.book_id 
    WHERE tb_book.upload_state='true'
    GROUP BY tb_book.book_id, tb_book.book_name, tb_book.book_group, tb_book.year_print, tb_book.total_view, tb_book.total_load
    ORDER BY tb_book.total_view DESC`,
        (err, result) => {
            if (err) {
                return res.json('error')
            } else {
                if (result.recordset) {
                    return res.json(result.recordset)
                }
            }
        })
}

//view book as like
exports.viewBookAsLike = (req, res) => {
    sql.query(`SELECT TOP(${req.body.top}) tb_book.book_id, tb_book.book_name, tb_book.book_group, tb_book.year_print, tb_book.total_view, tb_book.total_load, 
    COUNT(tb_like.member_id) as total_like
    FROM tb_book FULL OUTER JOIN tb_like ON tb_book.book_id = tb_like.book_id 
    WHERE tb_book.upload_state='true'
    GROUP BY tb_book.book_id, tb_book.book_name, tb_book.book_group, tb_book.year_print, tb_book.total_view, tb_book.total_load 
    ORDER BY total_like DESC`,
        (err, result) => {
            if (err) {
                return res.json('error')
            } else {
                if (result.recordset) {
                    return res.json(result.recordset)
                }
            }
        })
}

//view book as download
exports.viewBookAsDownload = (req, res) => {
    sql.query(`SELECT TOP(${req.body.top}) tb_book.book_id, tb_book.book_name, tb_book.book_group, tb_book.year_print, tb_book.total_view, tb_book.total_load, 
    COUNT(tb_like.member_id) as total_like
    FROM tb_book FULL OUTER JOIN tb_like ON tb_book.book_id = tb_like.book_id 
    WHERE tb_book.upload_state='true'
    GROUP BY tb_book.book_id, tb_book.book_name, tb_book.book_group, tb_book.year_print, tb_book.total_view, tb_book.total_load
    ORDER BY tb_book.total_load DESC`,
        (err, result) => {
            if (err) {
                return res.json('error')
            } else {
                if (result.recordset) {
                    return res.json(result.recordset)
                }
            }
        })
}

//view book as bookmark
exports.viewBookAsBookmark = (req, res) => {
    sql.query(`SELECT tb_book.book_id, tb_book.book_name, tb_book.book_group, tb_book.year_print, tb_book.total_view, tb_book.total_load, 
    COUNT(tb_like.member_id) as total_like
    FROM tb_book FULL OUTER JOIN tb_like ON tb_book.book_id = tb_like.book_id 
    FULL OUTER JOIN tb_bookmark ON tb_book.book_id = tb_bookmark.book_id
    WHERE tb_bookmark.member_id=${req.body.member_id} AND tb_book.upload_state='true'
    GROUP BY tb_book.book_id, tb_book.book_name, tb_book.book_group, tb_book.year_print, tb_book.total_view, tb_book.total_load`,
        (err, result) => {
            if (err) {
                return res.json('error')
            } else {
                if (result.recordset) {
                    return res.json(result.recordset)
                }
            }
        })
}

//get author
exports.getAuthor = (req, res) => {
    sql.query(`SELECT (tb_author.name + ' '+ tb_author.surname ) as author
    FROM tb_author INNER JOIN tb_author_group ON tb_author.author_id = tb_author_group.author_id 
    INNER JOIN tb_book ON tb_author_group.book_id = tb_book.book_id
    WHERE tb_author_group.book_id='${req.body.book_id}' AND tb_book.upload_state='true'`,
        (err, result) => {
            if (err) {
                return res.json('error');
            } else {
                res.send(result.recordset);
            }
        });
}

//view book file
// exports.viewBookFile = (req, res) => {
//     sql.query(`UPDATE tb_book SET total_view = total_view + 1 
//         WHERE book_id = N'${req.body.book_id}'`,
//         (err, result) => {
//             if (err) {
//                 return res.json('error');
//             } else {
//                 res.send(result.recordset);
//             }
//         });
// }

//like
exports.like = (req, res) => {
    sql.query(`INSERT INTO tb_like VALUES(${req.body.member_id},N'${req.body.book_id}')`,
        (err, result) => {
            if (err) {
                return res.json('error');
            } else {
                res.send(result.recordset);
            }
        });
}

//get like
exports.getLike = (req, res) => {
    sql.query(`SELECT tb_like.book_id FROM tb_like INNER JOIN tb_book ON tb_like.book_id = tb_book.book_id
        WHERE tb_like.member_id = ${req.body.member_id} AND tb_book.upload_state='true'`,
        (err, result) => {
            if (err) {
                return res.json('error');
            } else {
                res.send(result.recordset);
            }
        });
}

//dislike
exports.dislike = (req, res) => {
    sql.query(`DELETE FROM tb_like WHERE tb_like.member_id=${req.body.member_id} 
    AND tb_like.book_id=N'${req.body.book_id}'`,
        (err, result) => {
            if (err) {
                return res.json('error');
            } else {
                res.send(result.recordset);
            }
        });
}

//bookmark
exports.bookmark = (req, res) => {
    sql.query(`INSERT INTO tb_bookmark VALUES(${req.body.member_id},N'${req.body.book_id}')`,
        (err, result) => {
            if (err) {
                return res.json('error');
            } else {
                res.send(result.recordset);
            }
        });
}

//get bookmark
exports.getBookmark = (req, res) => {
    sql.query(`SELECT tb_bookmark.book_id FROM tb_bookmark INNER JOIN tb_book 
        ON tb_bookmark.book_id = tb_book.book_id
        WHERE tb_bookmark.member_id=${req.body.member_id} AND tb_book.upload_state='true'`,
        (err, result) => {
            if (err) {
                return res.json('error');
            } else {
                res.send(result.recordset);
            }
        });
}

//unbookmark
exports.unbookmark = (req, res) => {
    sql.query(`DELETE FROM tb_bookmark WHERE tb_bookmark.member_id=${req.body.member_id} 
    AND tb_bookmark.book_id=N'${req.body.book_id}'`,
        (err, result) => {
            if (err) {
                return res.json('error');
            } else {
                res.send(result.recordset);
            }
        });
}

//download file
exports.downloadFile = (req, res) => {
    sql.query(`UPDATE tb_book SET total_load = total_load + 1 
        WHERE book_id = N'${req.body.book_id}'`,
        (err, result) => {
            if (err) {
                return res.json('error');
            } else {
                return res.json(result.recordset);
            }
        });
}

//https://bezkoder.com/node-js-express-file-upload/

//upload proposal file

exports.uploadProposalFile = async (req, res) => {
    try {
        var bookId = req.body.book_id;
        await upload(req, res);
        if (req.files) {
            let file = req.files.file;
            var filePath = path.join(__dirname, '..', '..', 'public', 'proposalFiles', file.name).toString();
            file.mv('./public/proposalFiles/' + file.name);
            sql.query(`UPDATE tb_book SET proposal_file = N'${filePath}' WHERE book_id = N'${bookId}'`,
                (err, result) => {
                    if (err) {
                        return res.json('error');
                    } else {
                        return res.json({
                            message: 'File has uploaded',
                            data: {
                                name: file.name,
                                mimetype: file.mimetype,
                                size: file.size,
                                url: filePath,
                            },
                        });
                    }
                });
        } else {
            return res.json({
                status: false,
                message: "Please choose file for upload!"
            });
        }
    } catch (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 1000MB!",
            });
        }
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

//upload book file
exports.uploadBookFile = async (req, res) => {
    try {
        var bookId = req.body.book_id;
        var empId = req.body.emp_id;
        var date = new Date().toLocaleString().split(',')[0];
        await upload(req, res);
        if (req.files) {
            // let file = req.files.file;
            // var filePath = path.join(__dirname, '..', '..', 'public', 'bookFiles', file.name).toString();
            // file.mv('./public/bookFiles/' + file.name);
            // sql.query(`UPDATE tb_book SET book_file = N'${filePath}', upload_date = '${date}', 
            //     upl_emp_id = N'${empId}', upload_state = 'true'
            //     WHERE book_id = N'${bookId}'`,
            //     (err, result) => {
            //         console.log(bookId);
            //         if (err) {
            //             return res.json('error');
            //         } else {
            //             return res.json({
            //                 message: 'File has uploaded',
            //                 data: {
            //                     name: file.name,
            //                     mimetype: file.mimetype,
            //                     size: file.size,
            //                     url: filePath,
            //                 },
            //             });
            //         }
            //     });


            ///to firebase..................................................
            await storage.bucket(bucketName).upload(filename, {
                // Support for HTTP requests made with `Accept-Encoding: gzip`
                gzip: true,
                // By setting the option `destination`, you can change the name of the
                // object you are uploading to a bucket.
                metadata: {
                    // Enable long-lived HTTP caching headers
                    // Use only if the contents of the file will never change
                    // (If the contents will change, use cacheControl: 'no-cache')
                    cacheControl: 'public, max-age=31536000',
                },
            });

            console.log(`${filename} uploaded to ${bucketName}.`);


        } else {
            return res.json({
                status: false,
                message: "Please choose file for upload!"
            });
        }
    } catch (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 1000MB!",
            });
        }
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};


//get book file from database
exports.viewBookFile = (req, res) => {
    sql.query(`SELECT book_file FROM tb_book WHERE book_id = N'${req.body.book_id}' 
        AND upload_state = 'true'`,
        (err, result) => {
            if (err) {
                return res.json('error');
            } else {
                sql.query(`UPDATE tb_book SET total_view = total_view + 1 
                    WHERE book_id = N'${req.body.book_id}'`,
                    (err) => {
                        if (err) {
                            return res.json('error');
                        } else {
                            return res.json(result.recordset[0]);
                        }
                    });
            }
        })
};

// exports.getFile = (req, res) => {
//     // const directoryPath = 'D:\\Final Project\\nuol_research_api\\public\\uploads\\';
//     // const dirPath = path.join(__dirname + '../../../public/uploads/');
//     const dirPath = path.join(__dirname, '..', '..', 'public', 'uploads');
//     fs.readdir(dirPath, function (err, files) {
//         if (err) {
//             return res.status(500).send({
//                 message: "Unable to scan files!",
//                 err,
//             });
//         } else {
//             let fileInfo = [];
//             files.forEach((file) => {
//                 fileInfo.push({
//                     name: file,
//                     url: path.join(__dirname, '..', '..', 'public', 'uploads', file),
//                 });
//             });
//             return res.json(fileInfo);
//         }
//     });
// };

// const downloadFile = (req, res) => {
//     // const fileName = req.params.file;
//     // const dirPath = path.join(__dirname, '..', '..', 'public', 'uploads');

//     // res.downloadFile(dirPath + fileName, (err, result) => {
//     //     if (err) {
//     //         res.status(500).send({
//     //             message: "Could not download the file. " + err,
//     //         });
//     //     }
//     // });
// };

exports.downloadBookFile = (req, res) => {
    sql.query(`SELECT book_file FROM tb_book WHERE book_id = N'${req.body.book_id}'`,
        (err, result) => {
            if (err) {
                return res.json('error');
            } else {
                var url = res.json(result.recordset[0]['book_file']).toString()
                var file = fs.createWriteStream('.pdf');
                var request = http.get('https://firebasestorage.googleapis.com/v0/b/myfirebaseproject-37ce1.appspot.com/o/Analysis%20Diagram%201.pdf?alt=media&token=91228fc2-1c53-4db6-8de5-18c9c04976d9', function (response) {
                    response.pipe(file);
                    // file.on('finish', function () {
                    //     file.close(cb);  
                    // });
                });
            }
        });
};