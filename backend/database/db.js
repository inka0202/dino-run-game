const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

//Path to the database file (this file will be created automatically if it does not already exist)

const dbPath = path.resolve(__dirname, "dinoGame.db");

//Connection to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

//Reading SQL schema from schema.sql file
const schemaPath = path.resolve(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

//Execute SQL script to create tables
db.exec(schema, (err) => {
  if (err) {
    console.error("Error initializing database schema:", err.message);
  } else {
    console.log("Database schema initialized.");
  }
});

//Wrapper in proms for convenience (not necessary, but useful for async/await)

const { promisify } = require("util");
db.run = promisify(db.run);
db.get = promisify(db.get);
db.all = promisify(db.all);

//Export the database for use in other parts of the application
module.exports = db;
