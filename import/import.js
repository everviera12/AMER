// Importaciones de módulos externos
const express = require("express");
const dotenv = require("dotenv");
const bcryptjs = require("bcryptjs");
const session = require("express-session");
const mysql = require("mysql2");

// Importaciones de archivos locales
const connection = require("./db/db");
const authRoutes = require("./auth/routes");
const productRoutes = require("./products/routes");

// Configurar variables de entorno
dotenv.config({ path: "./env/.env" });

// Exportar módulos
module.exports = {
  express,
  dotenv,
  bcryptjs,
  session,
  mysql,
  connection,
  authRoutes,
  productRoutes,
};
