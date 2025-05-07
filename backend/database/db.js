const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Шлях до файлу бази даних (цей файл буде створений автоматично, якщо його ще немає)
const dbPath = path.resolve(__dirname, "dinoGame.db");

// Підключення до SQLite бази даних
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Читання SQL схеми з файлу schema.sql
const schemaPath = path.resolve(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

// Виконання SQL-скрипта для створення таблиць
db.exec(schema, (err) => {
  if (err) {
    console.error("Error initializing database schema:", err.message);
  } else {
    console.log("Database schema initialized.");
  }
});

// Обгортка в проміси для зручності (не обов'язково, але корисно для async/await)
const { promisify } = require("util");
db.run = promisify(db.run);
db.get = promisify(db.get);
db.all = promisify(db.all);

// Експортуємо базу даних для використання в інших частинах програми
module.exports = db;
