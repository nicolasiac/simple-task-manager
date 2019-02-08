const sqlite3 = require('sqlite3');

const Helper = require('../helper');
const helper = new Helper();

createTables = function () {
  let db = new sqlite3.Database('./database/task.db');
  console.log('deleting tables');
  db.serialize(function () {
    db.run(`DROP TABLE IF EXISTS TaskWork`);
    db.run(`DROP TABLE IF EXISTS Tasks`);
    db.run(`DROP TABLE IF EXISTS Categories`);
    db.run(`DROP TABLE IF EXISTS Users`);

    console.log('creating tables');
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        userid INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT,
        username TEXT,
        password TEXT,
        isadmin INTEGER
      )`);

    db.run(`CREATE TABLE IF NOT EXISTS Categories (
        categoryid INTEGER PRIMARY KEY,
        categoryname TEXT
      )`);

    db.run(`CREATE TABLE IF NOT EXISTS Tasks (
        taskid INTEGER PRIMARY KEY,
        category_id INTEGER,
        taskname TEXT,
        description TEXT,
        FOREIGN KEY (category_id) REFERENCES categories (categoryid)
      )`);

    db.run(`CREATE TABLE IF NOT EXISTS TaskWork (
        taskworkid INTEGER PRIMARY KEY,
        task_id INTEGER,
        user_id INTEGER,
        minutes INTEGER,
        FOREIGN KEY (task_id) REFERENCES tasks (taskid),
        FOREIGN KEY (user_id) REFERENCES users (userid)
      )`);

    var hash = helper.hashPassword('1234');
    db.run(`INSERT INTO users(name,email,username,password, isadmin)
       VALUES('Admin','admin@admin.com', 'admin', '`+ hash + `',1)`);
       
    db.run(`INSERT INTO Categories(categoryname) VALUES('Administation')`);
    db.run(`INSERT INTO Categories(categoryname) VALUES('UI')`);
    db.run(`INSERT INTO Categories(categoryname) VALUES('Workflow')`); 
    
    db.run(`INSERT INTO Tasks(category_id, taskname, description) 
            VALUES(1, 'admin Task 1', 'admin Task 1 desc')`);
    db.run(`INSERT INTO Tasks(category_id, taskname, description) 
            VALUES(1, 'admin Task 2', 'admin Task 2 desc')`);
    db.run(`INSERT INTO Tasks(category_id, taskname, description) 
            VALUES(2, 'ui Task 1', 'ui Task 1 desc')`);
    db.run(`INSERT INTO Tasks(category_id, taskname, description) 
            VALUES(3, 'workflow Task 1', 'workflow Task 1 desc')`);
  
    db.run(`INSERT INTO TaskWork(task_id, user_id, minutes) 
            VALUES(1, 1, 20)`);
    db.run(`INSERT INTO TaskWork(task_id, user_id, minutes) 
            VALUES(1, 1, 100)`);
  });

  db.close();
}