// Dependencias de Terceros (npm)
const express = require("express");            // express para crear la aplicación web.
const dotenv = require("dotenv")              // dotenv para gestionar variables de entorno.
const bcryptjs = require("bcryptjs");        // bcryptjs para el cifrado de contraseñas.
const session = require("express-session"); // express-session para gestionar sesiones de usuario en Express.


const app = express();                     // Crea una instancia de la aplicación Express.
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
-------------------RUTAS PARA MANEJAR LA LOGICA------------------
-------------------------------------------------------------  */
// registro
app.post("/register", async (req, res) => {             // espera solicitudes post del formulario registerView.ejs
  try {
  // Extraer los datos del formulario de registro enviados a través de la solicitud POST.
  const name = req.body.name;                  // Nombre del usuario
  const last_name_1 = req.body.last_name_1;   // Primer apellido del usuario
  const last_name_2 = req.body.last_name_2;   // Segundo apellido del usuario
  const user_name = req.body.user_name;       // Nombre de usuario elegido
  const user_pass = req.body.user_pass;       // Contraseña del usuario

  // Genera un hash seguro de la contraseña del usuario antes de almacenarla en la base de datos.
  let passHash = await bcryptjs.hash(user_pass, 8);

  // se crea un objeto 'userData' con los datos del usuario.
    const userData = {
      name: name,
      last_name_1: last_name_1,
      last_name_2: last_name_2,
      user_name: user_name,
      user_pass: passHash,
    };

    // Realiza una consulta para insertar los datos del usuario en la base de datos
    connection.query(
      "INSERT INTO userData SET ?",  // consulta SQL para inesrtar los datos a la db
      userData,                     //  datos del usuario a insertar
      async (error, results) => {
        if (error) {
          // Envía una respuesta de error al cliente con un mensaje descriptivo
          console.log(error);
          res.status(500).json({ message: "Error al procesar la solicitud" });  
        } else {
          // alerta de registro exitoso
          res.render("registerView", {
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
    res.status(500).json({ message: "Error al procesar la solicitud" }); // manejo de errores al momento de insertar los datos
  }
});

// login
app.post("/index", async (req, res) => {
  try {
    const user = req.body.user_name;
    const pass = req.body.user_pass;

    if (user && pass) {
      connection.query("SELECT * FROM userData WHERE user_name = ?", [user], async (error, results) => {
        if (error) {
          console.error("Error en la consulta:", error);
          res.status(500).send("Error en la consulta a la base de datos");
          return;
        }

        if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].user_pass))) {
          res.render('loginView', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "USUARIO y/o PASSWORD incorrectas",
            alertIcon:'error',
            showConfirmButton: true,
            timer: false,
            ruta: '',
          })
        } else {
          // req.session.user_name = results[0].
          res.render('indexView', {
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "Bienvenido",
            alertIcon:'success',
            showConfirmButton: false,
            ruta: '/indexView'
          })
        }
      });
    } else {
      // Datos faltantes
      res.status(400).send("Usuario y contraseña son obligatorios");
    }
  } catch (error) {
    console.error("Error en el manejo de la solicitud:", error);
    res.status(500).send("Error en el servidor");
  } 
});

// log out
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
})

/* --------------------------------------------------------------
---------------FIN RUTAS PARA MANEJAR LA LOGICA------------------
-------------------------------------------------------------  */


/* --------------------------------------------------------------
---------------ESTABLECIENDO RUTAS DE LAS PAGINAS ---------------
-------------------------------------------------------------  */

// ruta de inicio
app.get('/', (req, res) => {
  res.render("loginView"); // plantilla html llamada login.ejs
});

// ruta de registro
app.get('/register', (req, res) => {
  res.render("registerView"); // plantilla html llamada registerView.ejs
});

// ruta de el inicio del software
app.get('/index', (req, res) => {
  res.render("indexView"); // plantilla html llamada index.ejs
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
