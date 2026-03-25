const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend funcionando");
});

app.post("/login", (req, res) => {
    console.log(req.body);
    res.json({ ok: true, mensaje: "Login exitoso" });
});

app.listen(5000, () => {
    console.log("Servidor corriendo en puerto 5000");
});