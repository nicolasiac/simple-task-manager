const sqlite3 = require('sqlite3');


createTables = function () {
  let db = new sqlite3.Database('./database/task.db');
  console.log('deleting tables');

  db.run(`DROP TABLE IF EXISTS TaskWork`);
  db.run(`DROP TABLE IF EXISTS Tasks`);
  db.run(`DROP TABLE IF EXISTS Categories`);
  db.run(`DROP TABLE IF EXISTS Users`);

  console.log('creating tables');
  db.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT,
        username TEXT,
        password TEXT
      )`);

  db.run(`CREATE TABLE IF NOT EXISTS Categories (
        id INTEGER PRIMARY KEY,
        name TEXT
      )`);

  db.run(`CREATE TABLE IF NOT EXISTS Tasks (
        id INTEGER PRIMARY KEY,
        categoryid INTEGER,
        name TEXT,
        description TEXT,
        FOREIGN KEY (categoryid) REFERENCES categories (id)
      )`);

  db.run(`CREATE TABLE IF NOT EXISTS TaskWork (
        id INTEGER PRIMARY KEY,
        taskid INTEGER,
        userid INTEGER,
        minutes INTEGER,
        FOREIGN KEY (taskid) REFERENCES tasks (id),
        FOREIGN KEY (userid) REFERENCES users (id)
      )`);

  db.close();
}