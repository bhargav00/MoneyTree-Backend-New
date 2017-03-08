var mysql = require('mysql');
var express = require("express");
var session = require('express-session');
var bodyParser = require('body-parser');
const uuidV4 = require('uuid/v4');

var sess; //global session variable
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
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Below code is to enable CORS in node server
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//login function
function login(req, res) {
    
    if (req.body.username == null || req.body.password == null || req.body.type == null) {
        res.json({ status: 'incomplete data' });
        res.end();
        return;
    }
    pool
        .getConnection(function(err, connection) {
            if (err) {
                res.json({ "code": 100, "status": "Error in connection database" });
                return;
            }
            //table selection logic based on the type input got from request
            var table_name;
            if (req.body.type == 'pm') {
                table_name = 'portfolio_manager';
            } else if (req.body.type == 'et') {
                table_name = 'equity_trader';
            } else {
                res.json({ status: 'invalid data' });
                res.end();
                return;
            }
            connection
                .query('SELECT * from ' + table_name + ' where username="' + req.body.username + '" and password="' + req.body.password + '"', function(err, rows, fields) {
                    if (!err) {
                        if (rows.length == 1) {
                            connection.release();
                            res.json({ status: 'succesful', access_type: req.body.type });
                            res.end();
                        } else {
                            res.json({ status: 'failure' });
                            res.end();
                        }
                    } else {
                        console.log('Error while performing Query.');
                        res.end();
                    }
                });
            connection.on('error', function(err) {
                res.json({ "status": "Error in connection database" });
                return;
            });
        });
}

//create order function
function create_order(req, res, order_type) {

    if (req.body.side == null || req.body.s_id == null || req.body.quantity == null) {
        res.json({ status: 'incomplete data' });
        res.end();
        return;
    }

    pool
        .getConnection(function(err, connection) {
            if (err) {
                res.json({ "code": 100, "status": "Error in connection database" });
                return;
            }
            var status;
            if (order_type == 'order') {
                status = 'open';
            } else {
                status = 'draft';
            }
            connection
            .query("INSERT INTO orders VALUES (NULL, '" + req.body.side + " ',' " + req.body.symbol + "', '" + req.body.quantity + "', '" + req.body.limit_price + "', '" + req.body.stop_loss + "', '" + req.body.quantity + "', '" + 0 + "', '"+status+"',1,1 , '" + req.body.s_id + "','" + req.body.current_price + "','" + (new Date().toLocaleString()) + "')", function (err, rows, fields) {
                
                    if (!err) {
                        res.json({ status: 'succesful' });
                        res.end();
                    } else {
                        console.log(err);
                        res.end();
                    }

                })

        });
}

//search component function
function search(req, res) {
    pool
        .getConnection(function(err, connection) {
            if (err) {
                res.json({ "code": 100, "status": "Error in connection database" });
                return;
            }
            connection.query('SELECT * from stock where stock_name like"' + req.params.string + "%" + '"  ',
                function(err, rows, fields) {

                    if (err) throw err;
                    var stock = [];
                    for (i = 0; i < rows.length; i++) {
                        var obj = {
                            s_id: rows[i].s_id,
                            stock_name: rows[i].stock_name,
                            price: rows[i].price,
                        };
                        stock.push(obj);
                    }
                    res.json({ stock });
                    res.end();
                });
        });
}

//order history function
function history(req, res) {
    var access_type = 'pm';
    pool
        .getConnection(function(err, connection) {
            if (err) {
                res.json({ "code": 100, "status": "Error in connection database" });
                return;
            }
            var table_name;
            var id;
            var id2;
            var u_id;
            if (access_type == 'pm') {
                table_name = 'equity_trader';
                id = 'et_id';
                id2 = 'pm_id';
                u_id = 1;

            } else if (access_type == 'et') {
                table_name = 'portfolio_manager';
                id = 'pm_id';
                id2 = 'et_id';
                u_id = 1;
            } else {
                res.json({
                    status: 'unable to get user access type!'
                });
                return;
            }

            //selection from db
            var sel = 'order_id,stock_name,name,side,symbol,total_qty,limit_price,stop_price,date(order_timestamp) as date,time(order_timestamp) as time';
            //sql query
            connection.query('SELECT ' + sel + ' FROM orders INNER JOIN stock on orders.s_id=stock.s_id INNER JOIN ' + table_name + '  on orders.' + id + '=' + table_name + '.' + id + ' WHERE ' + id2 + '=' + u_id + '',
                function(err, rows, fields) {

                    if (err) throw err;

                    var table = [];
                    for (i = 0; i < rows.length; i++) {
                        var obj = {
                            order_id: rows[i].order_id,
                            stock_name: rows[i].stock_name,
                            name: rows[i].name,
                            side: rows[i].side,
                            symbol: rows[i].symbol,
                            total_qty: rows[i].total_qty,
                            limit_price: rows[i].limit_price,
                            stop_price: rows[i].stop_price,
                            date: rows[i].date,
                            time: rows[i].time,
                        };
                        table.push(obj);
                    }
                    res.json({ table });
                    res.end();
                });

        });
}


//function for order book and draft view
function view_order(req, res, status) {
    id = 1;
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }

        if (status === 'draft') {
            connection.query('SELECT order_id,side,symbol,total_qty,limit_price,stop_price,status,current_price,order_timestamp as timestamp,equity_trader.name as trader FROM orders INNER JOIN stock on orders.s_id=stock.s_id INNER JOIN equity_trader on orders.et_id=equity_trader.et_id INNER JOIN portfolio_manager on orders.pm_id=portfolio_manager.pm_id WHERE orders.status = "draft"',
                function(err, rows, fields) {
                    var table = [];
                    for (i = 0; i < rows.length; i++) {
                        data = rows[i];
                        table.push(data);

                    }
                    res.json({ table });
                    res.end();
                });
        } else if (status == 'incomplete') {
            connection.query('SELECT * FROM orders INNER JOIN stock on orders.s_id=stock.s_id INNER JOIN portfolio_manager on orders.pm_id=portfolio_manager.pm_id INNER JOIN equity_trader on orders.et_id=equity_trader.et_id WHERE orders.status = "open" ',
                function(err, rows, fields) {
                    var table = [];
                    for (i = 0; i < rows.length; i++) {
                        data = rows[i];
                        table.push(data);

                    }
                    res.json({ table });
                    res.end();
                });
        }
    });

}

// get et data
function get_et(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        result = [];
        connection.query('SELECT et_id FROM pm_et_relations WHERE pm_id =1',

            function(err, rows, fields) {
                connection.release();

                if (!err) {
                    for (i = 0; i < rows.length - 1; i++) {
                        connection.query('SELECT name ,et_id  FROM equity_trader WHERE et_id =' + rows[i].et_id,
                            function(err, rows_et, fields) {
                                data = {
                                    id: rows_et[0].et_id,
                                    name: rows_et[0].name
                                };
                                result.push(data);
                            });

                    };
                    connection.query('SELECT name ,et_id  FROM equity_trader WHERE et_id =' + rows[i].et_id,
                        function(err, rows_et, fields) {
                            data = {
                                id: rows_et[0].et_id,
                                name: rows_et[0].name
                            };
                            result.push(data);

                            res.json(result);
                            res.end();
                        });

                } else {
                    console.log(err);
                    res.end();
                }

            })
    });
}


//block creation
function create_block(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        result = [];
        connection.query('SELECT * FROM block WHERE et_id =1 and status="open"',
            function(err, rows, fields) {
                connection.release();

                if (!err) {
                    //console.log(rows);
                    // var temp_qty = 0,flag;
                    // for (i = 0; i < rows.length - 1; i++) {
                    //     var current_token = rows[i].s_id + rows[i].side + rows[i].symbol;
                    //     temp_qty = rows[i].total_qty;
                    //     for (j = i + 1; j < rows.length; j++) {
                    //         var next_token = rows[j].s_id + rows[j].side + rows[j].symbol;
                    //         if (current_token == next_token) {
                    //             //
                    //             if(i==rows.length-2)
                    //             {
                    //                 //block creation 
                    //             }
                    //             temp_qty += rows[j].total_qty;
                    //             console.log(temp_qty);
                    //             i++;
                    //         }
                    //         else {
                    //             console.log(temp_qty);
                    //             //DB block creation logic
                    //             break;
                    //         }
                    //     }
                    //    flag=i;
                    // }
                    // if(flag==rows.length-2){}
                    // res.json(temp_qty);
                    res.json(rows);
                    res.end();
                } else {
                    console.log(err);
                    res.end();
                }
            })
    });
}

//accept order function
function accept_order(req, res) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({
                "code": 100,
                "status": "Error in connection database"
            });
            return;
        }
        connection.query('UPDATE orders SET status="accepted" WHERE order_id =' + req.body.order_id,
            function(err, rows, fields) {
                connection.release();

                if (!err) {
                    res.json({ status: 'Successfully sent for block creation' });
                    res.end();
                } else {
                    console.log(err);
                    res.end();
                }

            })
    });
}

//login post method
app.post('/login', function(req, res) {
    console.log('got login request');
    login(req, res);
    console.log('Login successful');
});

//create draft post method
app.post('/create_draft', function(req, res) {
    console.log('Create draft request received');
    create_order(req, res, 'draft');
    console.log('Draft created');
});

//create order method
app.post('/create_order', function(req, res) {
    console.log('Create order request received');    
    create_order(req, res, 'order');
    console.log('recieved order');
    
});

//logout get method
app.get('/logout', function(req, res) {
    console.log('got logout get request');
    res.json({ status: 'succesful' });
    console.log('Logout successful');    
    res.end();
});

//search component get method
app.get('/search/:string', function(req, res) {
    console.log('stock search request received');
    search(req, res);
});

//order history method
app.get('/history', function(req, res) {
    console.log('order history request received');
    history(req, res);
    console.log('order history sent');    
});

//get et method
app.get('/get_et', function(req, res) {
    console.log('et request received');    
    get_et(req, res);
    console.log('et sent');
});

//view draft method
app.get('/view_draft', function(req, res) {
    console.log('View Draft Request');
    view_order(req, res, 'draft');
    console.log('draft details sent');
});

//order book method
app.get('/order_book', function(req, res) {
    console.log('Order book Request');
    view_order(req, res, 'incomplete');
    console.log('order book sent');
});

//create block method
app.get('/create_block', function(req, res) {
    console.log('got create block request');
    create_block(req, res);
    console.log('block created');
});

//accept order post method
app.post('/accept_order', function(req, res) {
    console.log('accept order request received');
    accept_order(req, res);
    console.log('order accepted');
});

//server listening..........
app.listen(3000);
console.log("Server started on 3000 ... nn");