const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const secretKey = "clave_secreta";
const refreshSecretKey = "clave_secreta_refresh";

const usuarios = [
    {
        rut: "12345678-9",
        pwdHash: bcrypt.hashSync("123", 10),
    }
];

let refreshTokens = [];
app.post("/login", async (req, res) => {
    const { rut, contraseña } = req.body;
    const usuario = usuarios.find(u => u.rut === rut);
    if (!usuario) { return res.json({ ok: false, mensaje: "RUT o contraseña incorrectos" });}
    
    const match = await bcrypt.compare(contraseña, usuario.pwdHash);
    if (!match) { return res.json({ ok: false, mensaje: "RUT o contraseña incorrectos" });}

    const token = jwt.sign({ rut: usuario.rut }, secretKey, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ rut: usuario.rut }, refreshSecretKey, { expiresIn: "7d" });

    refreshTokens.push(refreshToken);

    res.json({ ok: true, token, refreshToken });


})

app.post("/refresh", (req, res) => {
    const { token } = req.body;
    if (!token || !refreshTokens.includes(token)) {
        return res.json({ ok: false, mensaje: "Token no válido" });
    }

    try {
        const user = jwt.verify(token, refreshSecretKey);

        const newAccessToken = jwt.sign({ rut: user.rut }, secretKey, { expiresIn: "15m" });
        res.json({ ok: true, token: newAccessToken });
        
    } catch (error) {
        return res.json({ ok: false, mensaje: "Token no válido" });
    }
});

const verificarToken = (req, res, next) => {
    const header = req.headers.authorization;
    if(!header){ return res.status(401).json({ ok: false, mensaje: "No autorizado" });}

    const token = header.split(" ")[1];
    try{
        const decoded= jwt.verify(token, secretKey);
        req.user = decoded;
        next();

    }catch {
        return res.status(401).json({ ok: false, mensaje: "Token no válido" });
    }
}

app.post("/logout", (req, res) => {
    const { token } = req.body;

    refreshTokens = refreshTokens.filter(t => t !== token);

    res.json({ ok: true, mensaje: "Logout exitoso" });
});

app.get("/perfil", verificarToken,(req, res) => {
    res.json({usuario: req.user });
});


app.listen(5000, () => {
    console.log("Servidor corriendo en puerto 5000");
});
