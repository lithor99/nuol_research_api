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
                return res.json(result.recordset);
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
    const { book_id, book_name, book_group, proposal_file, offer_date, offer_emp_id, research_state } = req.body
    sql.query(`
    INSERT INTO tb_book (book_id, book_name, book_group, proposal_file, offer_date, offer_emp_id, research_state)  VALUES(N'${book_id}',N'${book_name}',N'${book_group}',N'${proposal_file}','${offer_date}',${offer_emp_id},${research_state});`,
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
    sql.query(`select book_id, book_name, book_group, proposal_file, offer_date, offer_emp_id from tb_book where research_state=0  ORDER BY book_name ASC;`,
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
    UPDATE tb_book SET book_name=N'${book_name}', book_group=N'${book_group}', proposal_file=N'${proposal_file}', offer_date='${offer_date}', offer_emp_id=${offer_emp_id} WHERE book_id=N'${book_id}'
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

    const { appro_date, appro_emp_id, book_id, date_line, fund, fund_id, research_state } = req.body
    sql.query(`UPDATE tb_book SET appro_date='${appro_date}',appro_emp_id='${appro_emp_id}',date_line='${date_line}',fund=${fund},fund_id=${fund_id},research_state=${research_state} WHERE book_id=N'${book_id}';`,
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
    sql.query(`select book_id, book_name, book_group, proposal_file, offer_date, offer_emp_id,appro_date,date_line  from tb_book where research_state=1  ORDER BY book_name ASC;`,
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


// cancelApproveResearchBook

exports.cancelApproveResearchBook = (req, res) => {
    const { book_id, research_state, appro_date, appro_emp_id, date_line, fund, fund_id } = req.body
    sql.query(`UPDATE tb_book SET appro_date='${appro_date}',appro_emp_id='${appro_emp_id}',date_line='${date_line}',fund=${fund},fund_id=${fund_id},research_state=${research_state} WHERE book_id=N'${book_id}';`,
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














//////////////////////////////////////  Report  //////////////////////////////////////////////////
// get author as book
exports.getAuthorReport = (req, res)=>{
    sql.query(`SELECT (SELECT tb_author.name+' '+tb_author.surname+', '
	FROM tb_book INNER JOIN tb_author_detail ON tb_book.book_id=tb_author_detail.book_id INNER JOIN tb_author 
	ON tb_author_detail.author_id=tb_author.author_id
	WHERE tb_book.book_id='${req.body.book_id}' FOR XML PATH(''))  AS author`,
    (err, result)=>{
        if (err) {
            console.log('get authors report error:' + err)
            return res.json('get authors report error:' + err)
        } else {
            return res.json(result.recordset[0])
        }
    })
}



// offer books report in one year-----------------------------------------------------
// count offer books in one year
exports.countOfferBookReportOneYear = (req, res) => {
    sql.query(`SELECT COUNT(tb_book.book_name) AS allBooks,
	    (SELECT COUNT(tb_book.book_group) FROM tb_book
	    WHERE tb_book.book_group=N'ວິທະຍາສາດທຳມະຊາດ' AND Year(tb_book.offer_date) = '${req.body.report_year}' AND tb_book.research_state=1
	    ) AS naturalBook,
	    (SELECT COUNT(tb_book.book_group)
	    FROM tb_book
	    WHERE tb_book.book_group=N'ວິທະຍາສາດສັງຄົມ' AND Year(tb_book.offer_date) = '${req.body.report_year}' AND tb_book.research_state=1
	    ) AS socialBook
    FROM tb_book
    WHERE Year(tb_book.offer_date) = '${req.body.report_year}' AND tb_book.research_state=1`,
        (err, result) => {
            if (err) {
                console.log('count offer books error:' + err)
                return res.json('count offer books error:' + err)
            } else {
                return res.json(result.recordset[0])
            }
        })
}

// select natural offer books in one year
exports.naturalOfferBookReportOneYear = (req, res) => {
    sql.query(`SELECT tb_book.book_name FROM tb_book
    WHERE tb_book.book_group=N'ວິທະຍາສາດທຳມະຊາດ' 
    AND Year(tb_book.offer_date) = '${req.body.report_year}' AND tb_book.research_state=1`,
        (err, result) => {
            if (err) {
                console.log('select natural offer books error:' + err)
                return res.json('select natural offer books error:' + err)
            } else {
                return res.json(result.recordset)
            }
        })
}

// select social offer books in one year
exports.socialOfferBookReportOneYear = (req, res) => {
    sql.query(`SELECT tb_book.book_name FROM tb_book
    WHERE tb_book.book_group=N'ວິທະຍາສາດສັງຄົມ' 
    AND Year(tb_book.offer_date) = '${req.body.report_year}' AND tb_book.research_state=1`,
        (err, result) => {
            if (err) {
                console.log('select social offer books error:' + err)
                return res.json('select social offer books error:' + err)
            } else {
                return res.json(result.recordset)
            }
        })
}



// offer books report between year---------------------------------------------
// count offer books in between year
exports.countOfferBookReportBetweenYear = (req, res) => {
    sql.query(`SELECT COUNT(tb_book.book_name) AS allBooks,
	    (SELECT COUNT(tb_book.book_group) FROM tb_book
	    WHERE tb_book.book_group=N'ວິທະຍາສາດທຳມະຊາດ' 
        AND (Year(tb_book.offer_date) BETWEEN '${req.body.from_year}' AND '${req.body.until_year}') 
        AND tb_book.research_state=1
	    ) AS naturalBook,
	    (SELECT COUNT(tb_book.book_group)
	    FROM tb_book
	    WHERE tb_book.book_group=N'ວິທະຍາສາດສັງຄົມ' 
        AND (Year(tb_book.offer_date) BETWEEN '${req.body.from_year}' AND '${req.body.until_year}') 
        AND tb_book.research_state=1
	    ) AS socialBook
    FROM tb_book
    WHERE (Year(tb_book.offer_date) BETWEEN '${req.body.from_year}' AND '${req.body.until_year}') AND tb_book.research_state=1`,
        (err, result) => {
            if (err) {
                console.log('count offer books error:' + err)
                return res.json('count offer books error:' + err)
            } else {
                return res.json(result.recordset[0])
            }
        })
}

// select natural offer books in between year
exports.naturalOfferBookReportBetweenYear = (req, res) => {
    sql.query(`SELECT tb_book.book_name FROM tb_book
    WHERE tb_book.book_group=N'ວິທະຍາສາດທຳມະຊາດ' 
    AND (Year(tb_book.offer_date) BETWEEN '${req.body.from_year}' AND '${req.body.until_year}') 
    AND tb_book.research_state=1`,
        (err, result) => {
            if (err) {
                console.log('select natural offer books error:' + err)
                return res.json('select natural offer books error:' + err)
            } else {
                return res.json(result.recordset)
            }
        })
}

// select social offer books in between year
exports.socialOfferBookReportBetweenYear = (req, res) => {
    sql.query(`SELECT tb_book.book_name FROM tb_book
    WHERE tb_book.book_group=N'ວິທະຍາສາດສັງຄົມ' 
    AND (Year(tb_book.offer_date) BETWEEN '${req.body.from_year}' AND '${req.body.until_year}')
    AND tb_book.research_state=1`,
        (err, result) => {
            if (err) {
                console.log('select social offer books error:' + err)
                return res.json('select social offer books error:' + err)
            } else {
                return res.json(result.recordset)
            }
        })
}



// books report in one year-----------------------------------------------------------
// count books in one year
exports.countBookReportOneYear = (req, res) => {
    sql.query(`SELECT COUNT(tb_book.book_name) AS allBooks,
	    (SELECT COUNT(tb_book.book_group) FROM tb_book
	    WHERE tb_book.book_group=N'ວິທະຍາສາດທຳມະຊາດ' AND Year(tb_book.offer_date) = '${req.body.report_year}' AND tb_book.research_state!=1
	    ) AS naturalBook,
	    (SELECT COUNT(tb_book.book_group)
	    FROM tb_book
	    WHERE tb_book.book_group=N'ວິທະຍາສາດສັງຄົມ' AND Year(tb_book.offer_date) = '${req.body.report_year}' AND tb_book.research_state!=1
	    ) AS socialBook
    FROM tb_book
    WHERE Year(tb_book.offer_date) = '${req.body.report_year}' AND tb_book.research_state!=1`,
        (err, result) => {
            if (err) {
                console.log('count offer books error:' + err)
                return res.json('count offer books error:' + err)
            } else {
                return res.json(result.recordset[0])
            }
        })
}

// select natural books in one year
exports.naturalBookReportOneYear = (req, res) => {
    sql.query(`SELECT tb_book.book_name , tb_fund.fund_name
    FROM tb_book INNER JOIN tb_fund ON tb_book.fund_id=tb_fund.fund_id
    WHERE tb_book.book_group=N'ວິທະຍາສາດທຳມະຊາດ' 
    AND Year(tb_book.offer_date) = '${req.body.report_year}' AND tb_book.research_state!=1`,
        (err, result) => {
            if (err) {
                console.log('select natural offer books error:' + err)
                return res.json('select natural offer books error:' + err)
            } else {
                return res.json(result.recordset)
            }
        })
}

// select social books in one year
exports.socialBookReportOneYear = (req, res) => {
    sql.query(`SELECT tb_book.book_name , tb_fund.fund_name
    FROM tb_book INNER JOIN tb_fund ON tb_book.fund_id=tb_fund.fund_id
    WHERE tb_book.book_group=N'ວິທະຍາສາດສັງຄົມ' 
    AND Year(tb_book.offer_date) = '${req.body.report_year}' AND tb_book.research_state!=1`,
        (err, result) => {
            if (err) {
                console.log('select social offer books error:' + err)
                return res.json('select social offer books error:' + err)
            } else {
                return res.json(result.recordset)
            }
        })
}



// books report between year------------------------------------------------
// count books in between year
exports.countBookReportBetweenYear = (req, res) => {
    sql.query(`SELECT COUNT(tb_book.book_name) AS allBooks,
	    (SELECT COUNT(tb_book.book_group) FROM tb_book
	    WHERE tb_book.book_group=N'ວິທະຍາສາດທຳມະຊາດ' 
        AND (Year(tb_book.offer_date) BETWEEN '${req.body.from_year}' AND '${req.body.until_year}') 
        AND tb_book.research_state!=1
	    ) AS naturalBook,
	    (SELECT COUNT(tb_book.book_group)
	    FROM tb_book
	    WHERE tb_book.book_group=N'ວິທະຍາສາດສັງຄົມ' 
        AND (Year(tb_book.offer_date) BETWEEN '${req.body.from_year}' AND '${req.body.until_year}') 
        AND tb_book.research_state!=1
	    ) AS socialBook
    FROM tb_book
    WHERE (Year(tb_book.offer_date) BETWEEN '${req.body.from_year}' AND '${req.body.until_year}') 
    AND tb_book.research_state!=1`,
        (err, result) => {
            if (err) {
                console.log('count offer books error:' + err)
                return res.json('count offer books error:' + err)
            } else {
                return res.json(result.recordset[0])
            }
        })
}

// select natural books in between year
exports.naturalBookReportBetweenYear = (req, res) => {
    sql.query(`SELECT tb_book.book_name , tb_fund.fund_name
    FROM tb_book INNER JOIN tb_fund ON tb_book.fund_id=tb_fund.fund_id
    WHERE tb_book.book_group=N'ວິທະຍາສາດທຳມະຊາດ' 
    AND (Year(tb_book.offer_date) BETWEEN '${req.body.from_year}' AND '${req.body.until_year}') 
    AND tb_book.research_state!=1`,
        (err, result) => {
            if (err) {
                console.log('select natural offer books error:' + err)
                return res.json('select natural offer books error:' + err)
            } else {
                return res.json(result.recordset)
            }
        })
}

// select social books in between year
exports.socialBookReportBetweenYear = (req, res) => {
    sql.query(`SELECT tb_book.book_name, tb_fund.fund_name
    FROM tb_book INNER JOIN tb_fund ON tb_book.fund_id=tb_fund.fund_id
    WHERE tb_book.book_group=N'ວິທະຍາສາດສັງຄົມ' 
    AND (Year(tb_book.offer_date) BETWEEN '${req.body.from_year}' AND '${req.body.until_year}')
    AND tb_book.research_state!=1`,
        (err, result) => {
            if (err) {
                console.log('select social offer books error:' + err)
                return res.json('select social offer books error:' + err)
            } else {
                return res.json(result.recordset)
            }
        })
}


////////////////////////////// approved books report ///////////////////////////////////
exports.approvedBookReport = (req, res) => {
    sql.query(`SELECT tb_book.book_name, tb_book.book_group, tb_fund.fund_name, 
    tb_book.fund, tb_book.appro_date, tb_book.date_line
    FROM tb_book INNER JOIN tb_fund ON tb_book.fund_id=tb_fund.fund_id
    WHERE tb_book.research_state BETWEEN 2 AND 3`,
        (err, result) => {
            if (err) {
                console.log('query appoved book error:' + err)
                return res.json('query appoved book error:' + err)
            } else {
                return res.json(result.recordset)
            }
        })
}


////////////////////////////// unapprove books report ///////////////////////////////////
// unapprove books report in one year
exports.unapproveBookReportOneYear = (req, res) => {
    sql.query(`SELECT tb_book.book_name, tb_book.book_group, tb_book.offer_date
    FROM tb_book
    WHERE tb_book.research_state=1 AND (Year(tb_book.offer_date) ='${req.body.report_year}')`,
        (err, result) => {
            if (err) {
                console.log('query unapprove book error:' + err)
                return res.json('query unapprove book error:' + err)
            } else {
                return res.json(result.recordset)
            }
        })
}

// unapprove books report in between year 
exports.unapproveBookReportBetweenYear = (req, res) => {
    sql.query(`SELECT tb_book.book_name, tb_book.book_group, tb_book.offer_date
    FROM tb_book
    WHERE tb_book.research_state=1 
    AND (Year(tb_book.offer_date) BETWEEN '${req.body.from_year}' AND '${req.body.until_year}')`,
        (err, result) => {
            if (err) {
                console.log('query unapprove book error:' + err)
                return res.json('query unapprove book error:' + err)
            } else {
                return res.json(result.recordset)
            }
        })
}

////////////////////////////////// nearly dateline books report /////////////////////////////
exports.nearlyDatelineBookReport = (req, res) => {
    sql.query(`SELECT tb_book.book_name, tb_book.book_group, 
	CASE WHEN tb_book.research_state=2 THEN '50%' ELSE '70%' END  AS complete, tb_book.appro_date, 
    tb_book.date_line, (DATEDIFF(DAY, GETDATE(), tb_book.date_line)) AS time_left 
    FROM tb_book
    WHERE tb_book.research_state BETWEEN 2 AND 3  
    AND  FORMAT(tb_book.date_line,'yyyy-MM') BETWEEN FORMAT(DATEADD(month, 0, (GETDATE())),'yyyy-MM') 
    AND FORMAT(DATEADD(month, ${req.body.total_month}, (GETDATE())),'yyyy-MM')`,
        (err, result) => {
            if (err) {
                console.log('query nearly dateline book error:' + err)
                return res.json('query nearly dateline book error:' + err)
            } else {
                return res.json(result.recordset)
            }
        })
}

//////////////////////////// over dateline books report ////////////////////////////////////
exports.overDatelineBookReport = (req, res) => {
    sql.query(`SELECT tb_book.book_name, tb_book.book_group,
	CASE WHEN tb_book.research_state=2 THEN '50%' ELSE '70%' END  AS complete, tb_book.appro_date, 
    tb_book.date_line, (DATEDIFF(DAY, GETDATE(), tb_book.date_line)) AS time_left 
    FROM tb_book
    WHERE tb_book.research_state BETWEEN 2 AND 3 
    AND  FORMAT(tb_book.date_line,'yyyy-MM') <= FORMAT(GETDATE(),'yyyy-MM')`,
        (err, result) => {
            if (err) {
                console.log('query over dateline book error:' + err)
                return res.json('query over dateline book error:' + err)
            } else {
                return res.json(result.recordset)
            }
        })
}


//////////////////////////// complete books report ////////////////////////////////////
// complete books report in year
exports.completeBookReportOneYear = (req, res) => {
    sql.query(`SELECT tb_book.book_name, tb_book.book_group, tb_book.year_print, tb_book.appro_date, tb_book.date_line
    FROM tb_book
    WHERE tb_book.research_state=4 AND (Year(tb_book.offer_date)='${req.body.report_year}')`,
        (err, result) => {
            if (err) {
                console.log('query complete book in year error:' + err)
                return res.json('query complete book in year error:' + err)
            } else {
                return res.json(result.recordset)
            }
        })
}

// complete books report between year
exports.completeBookReportBetweenYear = (req, res) => {
    sql.query(`SELECT tb_book.book_name, tb_book.book_group, tb_book.year_print, tb_book.appro_date, tb_book.date_line
    FROM tb_book
    WHERE tb_book.research_state=4 
    AND (Year(tb_book.offer_date) BETWEEN '${req.body.from_year}' AND '${req.body.until_year}')`,
        (err, result) => {
            if (err) {
                console.log('query complete book between year error:' + err)
                return res.json('query complete book between year error:' + err)
            } else {
                return res.json(result.recordset)
            }
        })
}


