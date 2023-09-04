const express = require("express");
const register = express.Router();

const connection = require("../db/db");
const bcryptjs = require("bcryptjs");

register.post("../views/registerView.ejs", async (req, res) => {
  try {
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
          res.status(500).json({ message: "Error al procesar la solicitud" });
        } else {
          res.render("register", {
            alert: true,
            alertTitle: "Registro",
            alertMessage: "Registro completo",
            alertIcon: "success",
          });
          console.log("\x1b[34m Datos insertados: \x1b[0m", userData);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al procesar la solicitud" });
  }
});
module.exports = register;
