var mysql = require('mysql');
var express = require("express");
var session = require('express-session');
var bodyParser = require('body-parser');
var sess; //global session variable
//Below command is to connect with database
var connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'moneytree'
});
//Creating Pool of connection
var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'moneytree',
    debug: false
});
var app = express();
//secret key is must to set to working with sesssions in express
app.use(session({
    secret: 'gmi'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Below code is to enable CORS in node server
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


function get_et(req, res) {
    sess = req.session;

    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        result = [];
        connection.query('SELECT et_id FROM pm_et_relations WHERE pm_id =' + 1,
            function(err, rows, fields) {
                connection.release();

                if (!err) {
                    console.log(rows);
                    for (i = 0; i < rows.length - 1; i++) {
                        connection.query('SELECT name ,et_id  FROM equity_trader WHERE et_id =' + rows[i].et_id,
                            function(err, rows_et, fields) {
                                data = {
                                    id: rows_et[0].et_id,
                                    name: rows_et[0].name
                                };
                                result.push(data);

                                // console.log(result);

                                // console.log(rows[i].et_id);
                                // console.log(id[1]);



                            });

                    };
                    connection.query('SELECT name ,et_id  FROM equity_trader WHERE et_id =' + rows[i].et_id,
                        function(err, rows_et, fields) {
                            data = {
                                id: rows_et[0].et_id,
                                name: rows_et[0].name
                            };
                            result.push(data);
                            console.log(result);
                            res.json(result);
                            // res.end();

                            // console.log(rows[i].et_id);
                            // console.log(id[1]);



                        });

                    // res.json();
                    // res.end();
                } else {
                    console.log(err);
                }

            })

        // res.end();
    });
}

//Server listen port  is 3000
app.listen(3000);
console.log("Server started on 3000 ... nn");
//login post method
app.get('/get_et', function(req, res) {
    get_et(req, res);
    // res.end();
});