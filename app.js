// Dependencias de Terceros (npm)
const express = require("express");            // express para crear la aplicación web.
const dotenv = require("dotenv")              // dotenv para gestionar variables de entorno.
const bcryptjs = require("bcryptjs");        // bcryptjs para el cifrado de contraseñas.
const session = require("express-session"); // express-session para gestionar sesiones de usuario en Express.


const app = express();                    // Crea una instancia de la aplicación Express.
dotenv.config({ path: "./env/.env" });    // Configura las variables de entorno desde el archivo .env.


// Módulos y Archivos Locales
const connection = require("./db/db");      // Módulo de conexión a la base de datos.


app.use(express.urlencoded({ extended: false }));  // Middleware para el análisis de solicitudes URL codificadas y JSON.
app.use(express.json());


app.use("/resources", express.static("public"));    // Middleware para servir archivos estáticos desde la carpeta 'public'.
app.use("/resources", express.static(__dirname + "/public"));


app.set("view engine", "ejs"); // Motor de plantillas EJS


// Configura el middleware express-session para gestionar sesiones de usuario.
app.use(session({
  secret: 'secret',            // Clave secreta para firmar las cookies de sesión.
  resave: true,                // Vuelve a guardar la sesión en el almacén, incluso si no ha cambiado.
  saveUninitialized: true      // Guarda sesiones nuevas pero aún no inicializadas en el almacén.
}))


/* --------------------------------------------------------------
-----------------------ESTABLECIENDO RUTAS-----------------------
-------------------------------------------------------------  */

// ruta de inicio
app.get('/', function(req, res) {
  res.render("login.ejs");
});



/* --------------------------------------------------------------
----------------------------FIN RUTAS----------------------------
-------------------------------------------------------------  */


const port = process.env.PORT || 3000; // Configura el puerto del servidor, utilizando el puerto 3000 como valor predeterminado.


// Inicia el servidor Express y muestra un mensaje de inicio en la consola.
app.listen(port, () => {
  console.log(`Server is ready => http://127.0.0.1:${port}`);
});


// Manejo de errores: si ocurre algún error durante la ejecución del servidor, registra el error en la consola.
app.on("error", (err) => {
  console.error("Server error:", err);
});
