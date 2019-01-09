const express = require('express')
//const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 3128;

const app = express();
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

let db = new sqlite3.Database('./database/task.db');
// enabling foreign key constraints on sqlite db
db.run(`PRAGMA foreign_keys = ON`);


app.get('/', function (req, res) {
    res.send("Welcome to Invoicing App");
});

app.post('/admin/init', function (req, res) {
    // init tables
    const initDB = require('./database/initDB');
    createTables();

    return res.json({ status: true, message: 'DB Created' });
});

app.post('/register', function (req, res) {
    // check to make sure none of the fields are empty
    if (isEmpty(req.body.name) || isEmpty(req.body.email) ||
        isEmpty(req.body.username) || isEmpty(req.body.password)) {
        return res.json({
            'status': false,
            'message': 'All fields are required'
        });
    }
    let sql = `INSERT INTO users(name,email,username,password) VALUES(?,?,?,?)`;
    db.run(sql, [req.body.name, req.body.email, req.body.username, req.body.password],
        function (err) {
            if (err) {
                throw err;
            } else {
                return res.json({
                    status: true,
                    message: "User Created"
                });
            }
        });
    db.close();
});

app.listen(PORT, function () {
    console.log(`App running on localhost:${PORT}`);
});