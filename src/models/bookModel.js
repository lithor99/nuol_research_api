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




//..........................................................................................
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

//upload proposal file
exports.uploadProposalFile = (req, res) => {
    sql.query(`UPDATE tb_book SET proposal_file = N'${req.body.proposal_file}' 
        WHERE book_id= N'${req.body.book_id}'`,
        (err, result) => {
            if (err) {
                console.log('error:', err);
                return res.json('error:', err);
            } else {
                return res.json('upload complete');
            }
        });
}

//upload book file
exports.uploadBookFile = (req, res) => {
    sql.query(`UPDATE tb_book SET book_file = N'${req.body.book_file}' 
        WHERE book_id= N'${req.body.book_id}'`,
        (err, result) => {
            if (err) {
                console.log('error:', err);
                return res.json('error:', err);
            } else {
                return res.json('upload complete');
            }
        });
}

//download book file
exports.downloadBookFile = (req, res) => {
    sql.query(`UPDATE tb_book SET total_load = total_load + 1 
        WHERE book_id = N'${req.body.book_id}'`,
        (err, result) => {
            if (err) {
                return res.json('error');
            } else {
                return res.json('download complete');
            }
        });
}

//https://bezkoder.com/node-js-express-file-upload/

////upload proposal file
// exports.uploadProposalFile = async (req, res) => {
//     try {
//         var bookId = req.body.book_id;
//         await upload(req, res);
//         if (req.files) {
//             let file = req.files.file;
//             var filePath = path.join(__dirname, '..', '..', 'public', 'proposalFiles', file.name).toString();
//             file.mv('./public/proposalFiles/' + file.name);
//             sql.query(`UPDATE tb_book SET proposal_file = N'${filePath}' WHERE book_id = N'${bookId}'`,
//                 (err, result) => {
//                     if (err) {
//                         return res.json('error');
//                     } else {
//                         return res.json({
//                             message: 'File has uploaded',
//                             data: {
//                                 name: file.name,
//                                 mimetype: file.mimetype,
//                                 size: file.size,
//                                 url: filePath,
//                             },
//                         });
//                     }
//                 });
//         } else {
//             return res.json({
//                 status: false,
//                 message: "Please choose file for upload!"
//             });
//         }
//     } catch (err) {
//         if (err.code == "LIMIT_FILE_SIZE") {
//             return res.status(500).send({
//                 message: "File size cannot be larger than 1000MB!",
//             });
//         }
//         res.status(500).send({
//             message: `Could not upload the file: ${req.file.originalname}. ${err}`,
//         });
//     }
// };

////upload book file
// exports.uploadBookFile = async (req, res) => {
//     try {
//         var bookId = req.body.book_id;
//         var empId = req.body.emp_id;
//         var date = new Date().toLocaleString().split(',')[0];
//         await upload(req, res);
//         if (req.files) {
//             let file = req.files.file;
//             var filePath = path.join(__dirname, '..', '..', 'public', 'bookFiles', file.name).toString();
//             file.mv('./public/bookFiles/' + file.name);
//             sql.query(`UPDATE tb_book SET book_file = N'${filePath}', upload_date = '${date}', 
//                 upl_emp_id = N'${empId}', upload_state = 'true'
//                 WHERE book_id = N'${bookId}'`,
//                 (err, result) => {
//                     console.log(bookId);
//                     if (err) {
//                         return res.json('error');
//                     } else {
//                         return res.json({
//                             message: 'File has uploaded',
//                             data: {
//                                 name: file.name,
//                                 mimetype: file.mimetype,
//                                 size: file.size,
//                                 url: filePath,
//                             },
//                         });
//                     }
//                 });
//         } else {
//             return res.json({
//                 status: false,
//                 message: "Please choose file for upload!"
//             });
//         }
//     } catch (err) {
//         if (err.code == "LIMIT_FILE_SIZE") {
//             return res.status(500).send({
//                 message: "File size cannot be larger than 1000MB!",
//             });
//         }
//         res.status(500).send({
//             message: `Could not upload the file: ${req.file.originalname}. ${err}`,
//         });
//     }
// };

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

// // down load file (get url from database)
// exports.downloadBookFile = (req, res) => {
//     sql.query(`SELECT book_file FROM tb_book WHERE book_id = N'${req.body.book_id}'`,
//         (err, result) => {
//             if (err) {
//                 return res.json('error');
//             } else {
//                 return res.json(result.recordset[0]);
//             }
//         });
// };




// Create book request add:

exports.createBookRequest = async (req, res) => {
    const { book_id, book_name, book_group, proposal_file, offer_date, offer_emp_id } = req.body
    sql.query(`
    INSERT INTO tb_book (book_id,book_name, book_group, proposal_file, offer_date, offer_emp_id)  VALUES(N'${book_id}',N'${book_name}',N'${book_group}',N'${proposal_file}','${offer_date}',${offer_emp_id});`,
        (err, result) => {
            if (err) {
                res.send('error:', err)
                console.log(err)

            } else {
                res.send(result);
            }
        })
}


// get all getAllRequestBook
exports.getAllRequestBook = (req, res) => {
    sql.query(`select book_id, book_name, book_group, proposal_file, offer_date, offer_emp_id from tb_book ORDER BY book_name ASC;`,
        (err, result) => {
            if (err) {
                console.log('error while fetching user by id', err);
                return res.json(err);
            } else {
                console.log('get all author_group');
                res.send(result.recordset);
            }
        });
}

exports.deleteSingleRequestBook = (req, res) => {
    const { book_id } = req.body
    sql.query(`delete from tb_book where book_id='${book_id}';`,
        (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
            }
        })
}

// update RequestBookById
exports.updateRequestBookById = (req, res) => {

    const book_id = req.params.id

    const { book_name, book_group, proposal_file, offer_date, offer_emp_id } = req.body;

    sql.query(`
    UPDATE tb_book SET book_name=N'${book_name}', book_group=N'${book_group}', proposal_file=N'${proposal_file}', offer_date='${offer_date}', offer_emp_id=${offer_emp_id} WHERE book_id='${book_id}'
    `, (err, result) => {
        if (err) {
            res.send('  UPDATE tb_book error', err)
            console.log(err)
        } else {
            res.send({
                message: ` UPDATE tb_book is edited successfully. result: ${result}`
            });
        }
    });
}



// getRequestBookById
exports.getRequestBookById = (req, res) => {
    const book_id = req.params.id

    sql.query(`
    select book_name, book_group, proposal_file, offer_date, offer_emp_id  from tb_book where book_id='${book_id}'
    `, (err, result) => {
        if (err) {
            console.log('error tb_book:', err);
            return res.json('error tb_book:', err);
        } else {
            console.log('successfully fetcj book request by Id tb_book:');
            res.send(result.recordset);
        }
    });
}

