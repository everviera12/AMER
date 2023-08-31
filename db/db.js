const mysql2 = require("mysql2");

const connection = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.log("\x1b[31m%s\x1b[0m", "ERROR: ", err);
    return;
  } else {
    console.log("\x1b[33m%s\x1b[0m", "connected");
  }
});

module.exports = connection;
