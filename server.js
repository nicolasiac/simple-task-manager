const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const middleware = require('./middleware');
const Helper = require('./helper');
const helper = new Helper();

const PORT = process.env.PORT || 3128;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function isEmpty(str) {
  return !str || 0 === str.length;
}

function runDBRun(sql, params, callback) {
  let db = new sqlite3.Database('./database/task.db');
  db.run(sql, params, callback);
  db.close();
}

function runDBAll(sql, params, callback) {
  let db = new sqlite3.Database('./database/task.db');
  db.all(sql, params, callback);
  db.close();
}

runDBRun(`PRAGMA foreign_keys = ON`, [], function() {});

app.post('/admin/init', function(req, res) {
  // init tables
  const initDB = require('./database/initDB');
  createTables();

  return res.json({ status: true, message: 'DB Created' });
});

app.post('/register', function(req, res) {
  // check to make sure none of the fields are empty
  if (
    isEmpty(req.body.name) ||
    isEmpty(req.body.email) ||
    isEmpty(req.body.username) ||
    isEmpty(req.body.password)
  ) {
    return res.json({
      status: false,
      message: 'All fields are required'
    });
  }
  var hash = helper.hashPassword(req.body.password);

  let sql = `INSERT INTO users(name,email,username,password, isadmin) VALUES(?,?,?,?,0)`;
  runDBRun(
    sql,
    [req.body.name, req.body.email, req.body.username, hash],
    function(err) {
      if (err) {
        throw err;
      } else {
        return res.json({
          status: true,
          message: 'User Created'
        });
      }
    }
  );
});

app.post('/login', function(req, res) {
  let sql = `SELECT * from users where username='${req.body.username}'`;

  runDBAll(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    if (rows.length == 0) {
      return res.json({
        status: false,
        message: 'Sorry, wrong username'
      });
    }
    let user = rows[0];

    let authenticated = helper.comparePasswords(
      req.body.password,
      user.password
    );
    delete user.password;
    if (authenticated) {
      //  create payload for JWT
      const payload = { user: user };
      // create token
      let token = helper.generateToken(payload);

      return res.json({
        status: true,
        user: user,
        token: token
      });
    }

    return res.json({
      status: false,
      message: 'Wrong Password, please retry'
    });
  });
});

app.post('/task', middleware.checkToken, function(req, res) {
  if (isEmpty(req.body.taskid)) {
    let sql = `INSERT INTO Tasks(category_id,taskname,description) VALUES(?,?,?)`;
    runDBRun(
      sql,
      [req.body.category_id, req.body.taskname, req.body.description],
      function(err) {
        if (err) {
          throw err;
        } else {
          return res.json({
            status: true,
            message: 'Task Created'
          });
        }
      }
    );
  } else {
    let sql = `UPDATE Tasks SET category_id = ? ,taskname = ?, description = ? WHERE taskid= ?`;
    runDBRun(
      sql,
      [
        req.body.category_id,
        req.body.taskname,
        req.body.description,
        req.body.taskid
      ],
      function(err) {
        if (err) {
          throw err;
        } else {
          return res.json({
            status: true,
            message: 'Task Updated'
          });
        }
      }
    );
  }
});

app.get('/data', middleware.checkToken, function(req, res) {
  let sql = `select * From Categories`;

  runDBAll(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    if (rows.length == 0) {
      return res.json({
        status: false,
        message: 'no categories'
      });
    } else {
      var categories = rows;

      let sql = `select * From Tasks`;
      runDBAll(sql, [], (err, taskRows) => {
        if (err) {
          throw err;
        }

        categories.forEach(cat => {
          cat.Tasks = taskRows.filter(item => {
            return item.category_id === cat.categoryid;
          });
        });

        return res.json({
          status: true,
          items: categories
        });
      });
    }
  });
});

app.post('/task', middleware.checkToken, function(req, res) {
  if (
    isEmpty(req.body.categoryid) ||
    isEmpty(req.body.name) ||
    isEmpty(req.body.description)
  ) {
    return res.json({
      status: false,
      message: 'All fields are required'
    });
  }
  let sql = `INSERT INTO Tasks(category_id,taskname,description) VALUES(?,?,?)`;
  runDBRun(
    sql,
    [req.body.categoryid, req.body.name, req.body.description],
    function(err) {
      if (err) {
        throw err;
      } else {
        return res.json({
          status: true,
          message: 'Task Created'
        });
      }
    }
  );
});

app.listen(PORT, function() {
  console.log(`App running on localhost:${PORT}`);
});
