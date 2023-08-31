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


// REGISTRO

app.post("/register", async (req, res) => {
  const name = req.body.name
  const last_name_1 = req.body.last_name_1
  const last_name_2 = req.body.last_name_2
  const user_name = req.body.user_name
  const user_pass = req.body.user_pass

  let passHaash = await bcryptjs.hash(user_pass, 8);

  const userData = { 
    name: name, 
    last_name_1: last_name_1, 
    last_name_2: last_name_2,
    user_name: user_name,
    user_pass: passHaash,
  };

  connection.query('INSERT INTO userData SET ?', userData, async(error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.json(userData)
      console.log('\x1b[33m Datos insertados: \x1b[0m', userData);
    }
  })
})

// FIN DE REGISTRO

/* --------------------------------------------------------------
-----------------------ESTABLECIENDO RUTAS-----------------------
-------------------------------------------------------------  */

// ruta de inicio
app.get('/', (req, res) => {
  res.render("login");
});

// ruta de registro
app.get('/register', (req, res) => {
  res.render("register");
});

// ruta de el inicio del software
app.get('/index', (req, res) => {
  res.render("index");
});


/* --------------------------------------------------------------
----------------------------FIN RUTAS----------------------------
-------------------------------------------------------------  */


const port = process.env.PORT || 3000; // Configura el puerto del servidor, utilizando el puerto 3000 como valor predeterminado.
const ipLocal = "127.0.0.1"; //localhost
// const ip = "192.168.50.225"; //Soul5G

// Inicia el servidor Express y muestra un mensaje de inicio en la consola.
app.listen(port, ipLocal, () => {
  console.log(`Server is ready => http://${ipLocal}:${port}`);
});


// Manejo de errores: si ocurre algún error durante la ejecución del servidor, registra el error en la consola.
app.on("error", (err) => {
  console.error("Server error:", err);
});
