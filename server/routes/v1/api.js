var mysql_dbc = require('../../db/db_con')()
var connection = mysql_dbc.init()
var fs = require('fs')
var crypto = require('crypto');
var spawn = require('child_process').spawn;
import async from 'async'
require('dotenv').config()

export const signUp = function (req, res) {
    var {
        id,
        name,
        password,
        email,
        phonenumber
    } = req.body
    if (!id || !name || !password) {
        res.json({
            code: 500,
            v: 'v1',
            status: 'ERR',
            detail: 'INVALID FORMAT'
        })
    } else {
        async.waterfall([
                (callback) => {
                    password = crypto.createHash('sha512').update(crypto.createHash('sha512').update(password).digest('base64')).digest('base64');
                    var sql = 'SELECT count(*) as count FROM user_list WHERE id = ? AND is_use = 1'
                    connection.query(sql, [id], (err, result) => {
                        if (err) {
                            callback({
                                err: 'QUERY',
                                message: 'QUERY ERROR'
                            })
                        } else {
                            if (result[0].count > 0) {
                                callback({
                                    err: 'ERR_SIGNUP',
                                    message: 'USERID ALREADY EXISTS'
                                })
                            } else {
                                callback(null, '')
                            }
                        }
                    })
                },
                (resultData, callback) => {
                    var sql = 'INSERT INTO user_list (id, name, password, email, phonenumber) values(?, ?, ?, ?, ?)'
                    connection.query(sql, [id, name, password, email, phonenumber], (err, result) => {
                        if (err) {
                            callback({
                                err: 'QUERY',
                                message: 'QUERY ERROR'
                            })
                        } else {
                            callback(null, '')
                        }
                    })
                }
            ],
            (err, result) => {
                if (err) {
                    res.json({
                        code: 500,
                        v: 'v1',
                        status: 'ERR_SIGNUP',
                        detail: err
                    })
                } else {
                    res.json({
                        code: 200,
                        v: 'v1',
                        status: 'SUCCESS',
                        detail: 'Sign up successful!'
                    })
                }
            })
    }
}

export const leaderboard = function (req, res) {
    async.waterfall([
            (callback) => {
                var sql = 'SELECT * FROM user_list WHERE is_use = 0 ORDER BY score desc, compare, endtime'
                connection.query(sql, [], (err, result) => {
                    if (err) {
                        callback({
                            err: 'QUERY',
                            message: 'QUERY ERROR'
                        })
                    } else {
                        let arr = []
                        if (result.length != 0) {
                            result.forEach((v, i) => {
                                arr.push({
                                    name: v.name,
                                    compare: v.compare,
                                    score: v.score
                                })
                            })
                            callback(null, arr)
                        } else {
                            callback(null, arr)
                        }
                    }
                })
            }
        ],
        (err, result) => {
            if (err) {
                res.json({
                    code: 500,
                    v: 'v1',
                    status: 'ERR_LEADERBOARD',
                    detail: err
                })
            } else {
                res.json({
                    code: 200,
                    v: 'v1',
                    status: 'SUCCESS',
                    detail: result
                })
            }
        })
}

export const updateScore = async function (req, res) {
    var {
        id,
        question,
        content
    } = req.body
    var score = await compile(id, question, content)
    if (!id) {
        res.json({
            code: 500,
            v: 'v1',
            status: 'ERR',
            detail: 'INVALID FORMAT'
        })
    } else {
        async.waterfall([
                (callback) => {
                    var sql = 'SELECT * FROM log WHERE user = ? AND question = ?'
                    connection.query(sql, [id, question], (err, result) => {
                        if (err) {
                            callback({
                                err: 'QUERY',
                                message: 'QUERY ERROR01'
                            })
                        } else {
                            if (result.length == 0) {
                                callback(null, result)
                            } else {
                                callback(null, result)
                            }
                        }
                    })
                },
                (resultData, callback) => {
                    if (resultData.length == 0) {
                        var sql = 'INSERT INTO log (user, question, score) values(?, ?, ?)'
                        connection.query(sql, [id, question, score], (err, result) => {
                            if (err) {
                                callback({
                                    err: 'QUERY',
                                    message: 'QUERY ERROR02'
                                })
                            } else {
                                callback(null, {
                                    score: score
                                })
                            }
                        })
                    } else {
                        var sql = 'SELECT * FROM log WHERE user = ? AND question = ?';
                        connection.query(sql, [id, question], (err, result) => {
                            if (err) {
                                callback({
                                    err: 'QUERY',
                                    message: 'QUERY ERROR03'
                                })
                            } else {
                                if (score > result[0].score) {
                                    var sql2 = 'UPDATE log SET score = ? WHERE user = ? AND question = ?';
                                    connection.query(sql2, [score, id, question], (err, result) => {
                                        if (err) {
                                            callback({
                                                err: 'QUERY',
                                                message: 'QUERY ERROR04'
                                            })
                                        } else {
                                            callback(null, {
                                                score: score
                                            });
                                        }
                                    })
                                } else {
                                    callback(null, {
                                        score: score
                                    });
                                }
                            }
                        })
                    }
                }
            ],
            (err, result) => {
                if (err) {
                    res.json({
                        code: 500,
                        v: 'v1',
                        status: 'ERR_UPDATESCORE',
                        detail: err
                    })
                } else {
                    res.json({
                        code: 200,
                        v: 'v1',
                        status: 'SUCCESS',
                        detail: result
                    })
                }
            })
    }
}

export const timeCompare = function (req, res) {
    var {
        id
    } = req.body
    var old, now, gap, sec_gap
    async.waterfall([
            (callback) => {
                var sql = 'SELECT starttime, endtime FROM user_list WHERE id = ?'
                connection.query(sql, [id], (err, result) => {
                    if (err) {
                        callback({
                            err: 'QUERY',
                            message: 'QUERY ERROR'
                        })
                    } else {
                        old = result[0].starttime
                        now = result[0].endtime
                        gap = now.getTime() - old.getTime()
                        sec_gap = gap / 1000
                        callback(null, '')
                    }
                })
            },
            (resultData, callback) => {
                var sql = 'UPDATE user_list SET compare = ?, is_use = 0 WHERE id = ?'
                connection.query(sql, [sec_gap, id], (err, result) => {
                    if (err) {
                        callback({
                            err: 'QUERY',
                            message: 'QUERY ERROR'
                        })
                    } else {
                        callback(null, '')
                    }
                })
            }
        ],
        (err, result) => {
            if (err) {
                res.json({
                    code: 500,
                    v: 'v1',
                    status: 'ERR_TIMECOMPARE',
                    detail: err
                })
            } else {
                res.json({
                    code: 200,
                    v: 'v1',
                    status: 'SUCCESS',
                    detail: 'Compare time successful'
                })
            }
        })
}

export const showQuestion = function (req, res) {
    var {
        idx
    } = req.body

    async.waterfall([
            (callback) => {
                var sql = 'SELECT * FROM question WHERE idx = ?';
                connection.query(sql, [idx], (err, result) => {
                    if (err) {
                        callback({
                            err: 'QUERY',
                            message: 'QUERY ERROR'
                        })
                    } else {
                        callback(null, {
                            question: result
                        })
                    }
                })
            }
        ],
        (err, result) => {
            if (err) {
                res.json({
                    code: 500,
                    v: 'v1',
                    status: 'ERR_SHOWCONTENT',
                    detail: err
                })
            } else {
                res.json({
                    code: 200,
                    v: 'v1',
                    status: 'SUCCESS',
                    detail: result
                })
            }
        })
}

export const allScore = function (req, res) {
    var {
        id
    } = req.body
    var score = 0
    async.waterfall([
            (callback) => {
                var sql = 'SELECT * FROM log WHERE user = ?'
                connection.query(sql, [id], (err, result) => {
                    if (err) {
                        callback({
                            err: 'QUERY',
                            message: 'QUERY ERROR'
                        })
                    } else if (result.length != 0) {
                        for (let i = 0; i < result.length; i++) {
                            score += result[i].score
                        }
                        callback(null, {
                            score: score
                        })
                    } else {
                        callback({
                            err: 'id',
                            message: 'ID NOTFOUND'
                        })
                    }
                })
            },
            (resultData, callback) => {
                var sql = 'UPDATE user_list SET score = ? WHERE id = ?'
                connection.query(sql, [score, id], (err, result) => {
                    if (err) {
                        callback({
                            err: 'QUERY',
                            message: 'QUERY ERROR'
                        })
                    } else {
                        callback(null, resultData)
                    }
                })
            }
        ],
        (err, result) => {
            if (err) {
                res.json({
                    code: 500,
                    v: 'v1',
                    status: 'ERR_TIMECOMPARE',
                    detail: err
                })
            } else {
                res.json({
                    code: 200,
                    v: 'v1',
                    status: 'SUCCESS',
                    detail: result
                })
            }
        })
}

var compile = function (id, question, content) {
    return new Promise(function (resolve, reject) {
        let file = 'code/code.py'
        fs.writeFile(file, content, 'utf8', function (err) {})
        var compile = spawn('python', [file])
        compile.stdout.on('data', function (data) {
            var score = data.toString('utf8').replace(/\n+$/, '')
            score *= 1
            resolve(score)
        })
        compile.stderr.on('data', function (data) {
            var score = 0
            resolve(score)
        })
    })
}