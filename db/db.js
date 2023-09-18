const mysql2 = require("mysql2");

const connection = mysql2.createConnection({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
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
