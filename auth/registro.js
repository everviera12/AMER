const express = require("express");
const dotenv = require("dotenv");
const bcryptjs = require("bcryptjs");
const session = require("express-session");
const app = express();
dotenv.config({ path: "./env/.env" });
const connection = require("./db/db");

app.post("/register", async (req, res) => {
  const name = req.body.name;
  const last_name_1 = req.body.last_name_1;
  const last_name_2 = req.body.last_name_2;
  const user_name = req.body.user_name;
  const user_pass = req.body.user_pass;

  let passHaash = await bcryptjs.hash(user_pass, 8);

  const userData = {
    name: name,
    last_name_1: last_name_1,
    last_name_2: last_name_2,
    user_name: user_name,
    user_pass: passHaash,
  };

  connection.query(
    "INSERT INTO userData SET ?",
    userData,
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json(userData);
        console.log("\x1b[33m Datos insertados: \x1b[0m", userData);
      }
    }
  );
});
