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
    WHERE tb_book.upload_state = 'true'
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
    INNER JOIN tb_author_detail ON tb_book.book_id = tb_author_detail.author_id 
    INNER JOIN tb_author ON tb_author_detail.author_id = tb_author.author_id
    WHERE (tb_book.book_name LIKE(N'%${req.body.search}%')
    OR tb_author.name LIKE(N'%${req.body.search}%') 
    OR tb_author.surname LIKE(N'%${req.body.search}%') AND tb_book.upload_state = 'true')
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
    WHERE tb_book.upload_state = 'true'
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
    WHERE tb_book.upload_state = 'true'
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
    WHERE tb_book.upload_state = 'true'
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
    WHERE tb_bookmark.member_id = ${req.body.member_id} AND tb_book.upload_state = 'true'
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
    sql.query(`SELECT (tb_author.name + '  '+ tb_author.surname ) as author
    FROM tb_author INNER JOIN tb_author_detail ON tb_author.author_id = tb_author_detail.author_id 
    INNER JOIN tb_book ON tb_author_detail.book_id = tb_book.book_id
    WHERE tb_author_detail.book_id = N'${req.body.book_id}' AND tb_book.upload_state = 'true'`,
        (err, result) => {
            if (err) {
                return res.json('error');
            } else {
                res.send(result.recordset);
            }
        });
}

//get book file from database
exports.getBookFile = (req, res) => {
    sql.query(`SELECT book_file FROM tb_book WHERE book_id = N'${req.body.book_id}' 
        AND upload_state = 'true'`,
        (err, result) => {
            if (err) {
                return res.json('error');
            } else {
                return res.json(result.recordset[0]);
            }
        })
};

//add view 
exports.addView = (req, res) => {
    sql.query(`UPDATE tb_book SET total_view = total_view + 1 
        WHERE book_id = N'${req.body.book_id}'`,
        (err, result) => {
            if (err) {
                return res.json('error');
            } else {
                return res.json(result.recordset);
            }
        });
};

//like
exports.like = (req, res) => {
    sql.query(`INSERT INTO tb_like VALUES(${req.body.member_id}, N'${req.body.book_id}')`,
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
        WHERE tb_like.member_id = ${req.body.member_id} AND tb_book.upload_state = 'true'`,
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
    sql.query(`DELETE FROM tb_like WHERE tb_like.member_id = ${req.body.member_id} 
    AND tb_like.book_id = N'${req.body.book_id}'`,
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
    sql.query(`INSERT INTO tb_bookmark VALUES(${req.body.member_id}, N'${req.body.book_id}')`,
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
        WHERE tb_bookmark.member_id = ${req.body.member_id} AND tb_book.upload_state = 'true'`,
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
    sql.query(`DELETE FROM tb_bookmark WHERE tb_bookmark.member_id = ${req.body.member_id} 
    AND tb_bookmark.book_id = N'${req.body.book_id}'`,
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
        WHERE book_id = N'${req.body.book_id}'`,
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
        WHERE book_id = N'${req.body.book_id}'`,
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
exports.addDownload = (req, res) => {
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
    const { book_id, book_name, book_group, proposal_file, offer_date, offer_emp_id, research_state, total_load, total_view, deleted } = req.body
    sql.query(`
    INSERT INTO tb_book (book_id, book_name, book_group, proposal_file, offer_date, offer_emp_id, research_state,total_load,total_view,deleted)  VALUES(N'${book_id}',N'${book_name}',N'${book_group}',N'${proposal_file}','${offer_date}',${offer_emp_id},${research_state},${total_load}, ${total_view}, ${deleted});`,
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
    sql.query(`select book_id, book_name, book_group, proposal_file, offer_date, offer_emp_id from tb_book where research_state=1 and deleted=0  ORDER BY book_name ASC;`,
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
    sql.query(`delete from tb_book where book_id = N'${book_id}';`,
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
    UPDATE tb_book SET book_name=N'${book_name}', book_group=N'${book_group}', proposal_file=N'${proposal_file}', offer_date='${offer_date}', offer_emp_id=${offer_emp_id},research_state=1,deleted=0 WHERE book_id=N'${book_id}'
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


// updateUnselected_proposal
exports.updateUnselected_proposal = (req, res) => {

    const { deleted, book_id } = req.body;

    sql.query(`
    UPDATE tb_book SET research_state=1, deleted='${deleted}' WHERE book_id=N'${book_id}'
    `, (err, result) => {
        if (err) {
            res.send('  UPDATE on status of delelte tb_book error', err)
            console.log(err)
        } else {
            res.send({
                message: ` UPDATE on status of delelte tb_book is edited successfully. result: ${result}`
            });
        }
    });
}

// getAllUnselected_proposals

exports.getAllUnselected_proposals = (req, res) => {
    sql.query(`select deleted,book_id, book_name, book_group, proposal_file, offer_date, offer_emp_id from tb_book where deleted=1 and research_state=1  ORDER BY book_name ASC;`,
        (err, result) => {
            if (err) {
                console.log('error while fetching user by id', err);
                return res.json(err);
            } else {
                console.log('get all book');
                res.send(result.recordset);
            }
        });
}

// 

exports.getUnselectedRequestProposalById = (req, res) => {
    const book_id = req.params.id
    sql.query(`
    select deleted, book_name, book_group, proposal_file, offer_date, offer_emp_id  from tb_book where book_id=N'${book_id}'
    `, (err, result) => {
        if (err) {
            console.log('error tb_book:', err);
            return res.json('error tb_book:', err);
        } else {
            console.log('successfully fetch book request by Id tb_book:');
            res.send(result.recordset);
        }
    });
}


// getRequestBookById
exports.getRequestBookById = (req, res) => {
    const book_id = req.params.id

    sql.query(`
    select book_name, book_group, proposal_file, offer_date, offer_emp_id  from tb_book where book_id=N'${book_id}'
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


// createApproveResearchBook

exports.createApproveResearchBook = (req, res) => {
    const { appro_date, appro_emp_id, book_id, date_line, fund, fund_id, research_state, deleted } = req.body
    sql.query(`UPDATE tb_book SET appro_date='${appro_date}',appro_emp_id='${appro_emp_id}',date_line='${date_line}',fund=${fund},fund_id=${fund_id},research_state=${research_state},deleted=${deleted} WHERE book_id=N'${book_id}';`,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
                console.log("create approve resarch err")

            } else {
                console.log("create approve resarch success")

                res.send(result);
            }
        })
}


// query all getAllApproveResearchBook

exports.getAllApproveResearchBook = (req, res) => {
    sql.query(`select *  from tb_book where research_state=2 and deleted=0  ORDER BY book_name ASC;`,
        (err, result) => {
            if (err) {
                console.log('error getAllApproveResearchBook', err);
                return res.json(err);
            } else {
                console.log('get all getAllApproveResearchBook');
                res.send(result.recordset);
            }
        });
}

// getSingleApproveResearchById

exports.getSingleApproveResearchById = (req, res) => {
    const book_id = req.params.id
    const _id = 1
    sql.query(`
    select * from tb_book where book_id=N'${book_id}'
    `, (err, result) => {
        if (err) {
            console.log('error getSingleApproveResearchById:', err);
            return res.json('error getSingleApproveResearchById:', err);
        } else {
            console.log('successfully getSingleApproveResearchById: ');
            res.status(200).json(result.recordset);
        }
    });
}



exports.cancelApproveResearchBook = (req, res) => {
    const { book_id } = req.body;
    sql.query(`
    UPDATE tb_book SET appro_date='',appro_emp_id=null,
    date_line='',fund=null,fund_id=null,research_state=1,
    deleted=0 WHERE book_id=N'${book_id}'
    `,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
                console.log("cancel approve resarch err")

            } else {
                console.log("cancel approve resarch success")

                res.send(result);
            }
        })
}

exports.updateApproveResearchBook = (req, res) => {
    const { book_id, book_name, book_group, proposal_file, fund_id, fund, appro_date, date_line, appro_emp_id, deleted, research_state } = req.body;
    sql.query(`
    UPDATE tb_book SET 
    book_name=N'${book_name}',book_group=N'${book_group}',proposal_file=N'${proposal_file}',fund_id=N'${fund_id}',
    fund=N'${fund}', appro_date=N'${appro_date}',
    date_line=N'${date_line}',appro_emp_id=N'${appro_emp_id}',deleted=N'${deleted}',research_state=N'${research_state}'
    WHERE book_id=N'${book_id}'
    `,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
                console.log("update approve resarch err")

            } else {
                console.log("update approve resarch success")
                res.send(result);
            }
        })
}



// createApproveResearchBookProcedure_0_50_percentage 

exports.createApproveResearchBookProcedure_0_50_percentage = (req, res) => {
    const { book_id } = req.body
    sql.query(`UPDATE tb_book SET research_state=3,deleted=0 WHERE book_id=N'${book_id}';`,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
                console.log("create approve resarch 50% err")

            } else {
                console.log("create approve resarch 50% success")

                res.send(result);
            }
        })
}

// cancelApproveResearchBookProcedure_0_50_percentage

exports.cancelApproveResearchBookProcedure_0_50_percentage = (req, res) => {
    const { book_id } = req.body
    sql.query(`UPDATE tb_book SET research_state=1,deleted=0 WHERE book_id=N'${book_id}';`,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
                console.log("create approve resarch 50% err")

            } else {
                console.log("create approve resarch 50% success")

                res.send(result);
            }
        })
}


// getAllApproveResearchBookProcedure_0_70_percentage


exports.getAllApproveResearchBookProcedure_0_70_percentage = (req, res) => {
    sql.query(`select * from tb_book where research_state=3 and deleted=0;`,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
            } else {
                console.log("create approve resarch 50% success")
                res.send(result.recordset);
            }
        })
}

// getAllApproveResearchBookProcedure_70_100_percentage

exports.getAllApproveResearchBookProcedure_70_100_percentage = (req, res) => {
    sql.query(`select * from tb_book where research_state=4 and deleted=0;`,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
            } else {
                console.log("create approve resarch 50% success")
                res.send(result.recordset);
            }
        })
}


exports.cancelApproveResearchSecondFaseBook = (req, res) => {
    const { book_id } = req.body;
    sql.query(`
    UPDATE tb_book SET research_state=2,
    deleted=0 WHERE book_id=N'${book_id}'
    `,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
                console.log("cancel approve resarch err")

            } else {
                console.log("cancel approve resarch success")

                res.send(result);
            }
        })
}


exports.cancelApproveResearchThirdFaseBook = (req, res) => {
    const { book_id } = req.body;
    sql.query(`
    UPDATE tb_book SET research_state=3,
    deleted=0 WHERE book_id=N'${book_id}'
    `,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
                console.log("cancel approve resarch err")

            } else {
                console.log("cancel approve resarch success")

                res.send(result);
            }
        })
}

// cancelApproveResearchThirdFaseBook
exports.cancelApproveResearchThirdFaseBook = (req, res) => {
    const { book_id } = req.body;
    sql.query(`
    UPDATE tb_book SET research_state=3,
    deleted=0 WHERE book_id=N'${book_id}'
    `,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
                console.log("cancel approve resarch err")

            } else {
                console.log("cancel approve resarch success")

                res.send(result);
            }
        })
}



exports.createApproveResearchBookProcedure_50_70_percentage = (req, res) => {
    const { book_id } = req.body
    sql.query(`UPDATE tb_book SET research_state=4,deleted=0 WHERE book_id=N'${book_id}';`,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
                console.log("create approve resarch 70% err")

            } else {
                console.log("create approve resarch 70% success")

                res.send(result);
            }
        })
}


// createResearch_paper_upload

exports.createResearch_paper_upload = (req, res) => {
    const { book_id, book_file, upload_date, upload_state, upl_emp_id } = req.body;
    sql.query(` 
    UPDATE tb_book SET 
dbo.tb_book.upl_emp_id=${upl_emp_id},
dbo.tb_book.upload_date='${upload_date}',
dbo.tb_book.upload_state=${upload_state},
dbo.tb_book.book_file=N'${book_file}', 
dbo.tb_book.research_state=5,
dbo.tb_book.deleted=0
WHERE dbo.tb_book.book_id=N'${book_id}' 
    `,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
                console.log("update approve resarch err")

            } else {
                console.log("update approve resarch success")

                res.send(result);
            }
        })
}


// cancelResearch_paper_upload

exports.cancelResearch_paper_upload = (req, res) => {
    const { book_id } = req.body;
    sql.query(` 
    UPDATE tb_book SET 
    dbo.tb_book.upl_emp_id=NULL,
    dbo.tb_book.upload_date=NULL,
    dbo.tb_book.upload_state=0,
    dbo.tb_book.book_file='', 
    dbo.tb_book.research_state=4,
    dbo.tb_book.deleted=0
    WHERE dbo.tb_book.book_id=N'${book_id}' 
    `,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
                console.log("cancel approve resarch err")

            } else {
                console.log("cancel approve resarch success")

                res.send(result);
            }
        })
}


// getAllApproveResearchBookFile

exports.getAllApproveResearchBookFile = (req, res) => {
    sql.query(`select * from tb_book where research_state=5 and deleted=0;`,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
            } else {
                console.log("select getAllApproveResearchBookFile")
                res.send(result.recordset);
            }
        })
}

// updateResearch_uploadState_false 
exports.updateResearch_uploadState_false = (req, res) => {
    const { book_id } = req.body;
    sql.query(`
    UPDATE tb_book SET
    dbo.tb_book.upload_state=0,
    dbo.tb_book.research_state=5,
    dbo.tb_book.deleted=0
    WHERE dbo.tb_book.book_id=N'${book_id}'`,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
            } else {
                console.log("updated update Research upload state false ")
                res.send(result.recordset);
            }
        })
}


// updateResearch_uploadState_true 
exports.updateResearch_uploadState_true = (req, res) => {
    const { book_id } = req.body;
    sql.query(`
    UPDATE tb_book SET
    dbo.tb_book.upload_state=1,
    dbo.tb_book.research_state=5,
    dbo.tb_book.deleted=0
    WHERE dbo.tb_book.book_id=N'${book_id}'`,
        (err, result) => {
            if (err) {
                res.send('error update:', err)
            } else {
                console.log("updated update Research upload state true ")
                res.send(result.recordset);
            }
        })
}
