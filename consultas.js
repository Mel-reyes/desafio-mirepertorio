const { Pool } = require("pg");

const pool = new Pool({
    user: "melireyes",
    host: "localhost",
    password: "1234",
    database: "repertorio",
    port: 5432,
});

const insertar = async (datos) => {
    const { cancion, artista, tono } = datos; 
    const consulta = {
        text: "INSERT INTO canciones (cancion, artista, tono) VALUES ($1, $2, $3)",
        values: [cancion, artista, tono] 
    };
    try {
        const result = await pool.query(consulta);
        return result;
    } catch (error) {
        console.error("Error al insertar en la base de datos:", error.message);
        throw error; 
    }
};

const consultar = async () => {
    try {
        const result = await pool.query("SELECT * FROM canciones");
        return result.rows;
    } catch (error) {
        console.error("Error al consultar la base de datos:", error.message);
        throw error; 
    }
};

const editar = async (datos) => {
    const { id, cancion, artista, tono } = datos;

    if (id) {
        // Si se proporciona un ID, realizar una edición
        const consulta = {
            text: `UPDATE canciones SET cancion = $2, artista = $3, tono = $4 WHERE id = $1 RETURNING *`,
            values: [id, cancion, artista, tono],
        };
        try {
            const result = await pool.query(consulta);
            console.log("Registro editado con éxito:", result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error("Error al editar el registro en la base de datos:", error.message);
            throw error;
        }
    } else {
        // Si no se proporciona un ID, realizar una inserción
        const consulta = {
            text: "INSERT INTO canciones (cancion, artista, tono) VALUES ($1, $2, $3) RETURNING *",
            values: [cancion, artista, tono]
        };
        try {
            const result = await pool.query(consulta);
            console.log("Registro insertado con éxito:", result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error("Error al insertar en la base de datos:", error.message);
            throw error;
        }
    }
};

const eliminar = async (id) => {
    try {
        const result = await pool.query("DELETE FROM canciones WHERE id = $1 RETURNING *", [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al eliminar el registro de la base de datos:", error.message);
        throw error; 
    }
};

module.exports = { insertar, consultar, editar, eliminar };

function editarCancion(id) {
    const nuevaCancion = document.getElementById("cancion").value;
    const nuevoArtista = document.getElementById("artista").value;
    const nuevoTono = document.getElementById("tono").value;
  
    // Verificar si se proporcionó un ID (es decir, si se está editando o insertando)
    if (id) {
      // Si se proporciona un ID, significa que se está editando una canción existente
      axios
        .put(`/cancion/${id}`, {
          cancion: nuevaCancion,
          artista: nuevoArtista,
          tono: nuevoTono,
        })
        .then(() => {
          getData(); // Actualizar la lista de canciones
        })
        .catch((error) => {
          console.error("Error al guardar los cambios:", error);
          // Manejar el error, mostrar un mensaje de error al usuario
        });
    } else {
      // Si no se proporciona un ID, significa que se está insertando una nueva canción
      axios
        .post("/cancion", {
          cancion: nuevaCancion,
          artista: nuevoArtista,
          tono: nuevoTono,
        })
        .then(() => {
          getData(); // Actualizar la lista de canciones
        })
        .catch((error) => {
          console.error("Error al insertar la canción:", error);
          // Manejar el error, mostrar un mensaje de error al usuario, etc.
        });
    }
  
    // Restaurar la interfaz a su estado inicial (ocultar el botón "Guardar cambios" y mostrar el botón "Editar")
    document.getElementById("guardar").style.display = "none";
    document.getElementById("editar").style.display = "block";
  }
