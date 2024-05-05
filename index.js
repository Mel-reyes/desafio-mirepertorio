const http = require("http");
const fs = require("fs");
const url = require("url");
const { insertar, consultar, editar, eliminar } = require("./consultas.js");

http.createServer(async (req, res) => {
    // Ruta para cargar la página HTML en localhost:3000/
    if (req.url == "/" && req.method === "GET") {
        res.setHeader("content-type", "text/html");
        res.end(fs.readFileSync("index.html", "utf8"));
    }

    //  insertar en la base de datos
    if (req.url == "/cancion" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", async () => {
            try {
                const datos = JSON.parse(body);
                console.log("Datos recibidos para insertar:", datos); 
                const respuesta = await insertar(datos);
                res.end(JSON.stringify(respuesta));
            } catch (error) {
                console.error("Error al insertar en la base de datos:", error.message);
                res.statusCode = 500;
                res.end("Error al insertar en la base de datos");
            }
        });
    }

    
    if (req.url == "/canciones" && req.method === "GET") {
        const registros = await consultar();
        res.end(JSON.stringify(registros));
    }

    // Ruta para editar un registro (incluyendo id en el envío desde el frontEnd)
    if (req.url.startsWith("/cancion/") && req.method == "PUT") {
        const id = req.url.split("/")[2]; // Extraer el ID del URL
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", async () => {
            try {
                const datos = JSON.parse(body);
                console.log("Datos recibidos:", datos);
                const respuesta = await editar(id, datos); // Envía el ID y los datos para editar
                res.end(JSON.stringify(respuesta));
            } catch (error) {
                console.error("Error al procesar la solicitud:", error);
                res.statusCode = 400;
                res.end("Error en el formato de los datos");
            }
        });
    }

    // Ruta para eliminar un registro
    if (req.url.startsWith("/cancion") && req.method == "DELETE") {
        const { id } = url.parse(req.url, true).query;
        const idInt = parseInt(id, 10); 
        const respuesta = await eliminar(idInt);
        res.end(JSON.stringify(respuesta));
    }
}).listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});

