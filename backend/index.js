const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend funcionando");
});

app.post("/login", (req, res) => {
    const usuarioPrueba = {
        rut: "12345678-9",
        contraseña: "123"
    };

    if (req.body.rut === usuarioPrueba.rut && req.body.contraseña === usuarioPrueba.contraseña) {
        return res.json({ ok: true, mensaje: "Login exitoso" });
    } else {
        return res.json({ ok: false, mensaje: "RUT o contraseña incorrectos" });
    }
});

app.listen(5000, () => {
    console.log("Servidor corriendo en puerto 5000");
});
