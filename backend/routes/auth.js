const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();
const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/* ──────────────────────────────────────────
   POST /api/auth/register
   Body: { email, password }
────────────────────────────────────────── */
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ ok: false, mensaje: "Email y contraseña son requeridos." });
    }

    if (password.length < 6) {
        return res.status(400).json({ ok: false, mensaje: "La contraseña debe tener al menos 6 caracteres." });
    }

    try {
        // Verificar si el email ya existe
        const existing = await pool.query("SELECT id FROM usuarios WHERE email = $1", [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ ok: false, mensaje: "El email ya está registrado." });
        }

        // Hashear contraseña y guardar
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        const result = await pool.query(
            "INSERT INTO usuarios (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
            [email, hash]
        );

        const usuario = result.rows[0];
        const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: "7d" });

        return res.status(201).json({ ok: true, mensaje: "Usuario registrado exitosamente.", token, usuario });
    } catch (err) {
        console.error("Error en /register:", err.message);
        return res.status(500).json({ ok: false, mensaje: "Error interno del servidor." });
    }
});

/* ──────────────────────────────────────────
   POST /api/auth/login
   Body: { email, password }
────────────────────────────────────────── */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ ok: false, mensaje: "Email y contraseña son requeridos." });
    }

    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ ok: false, mensaje: "Credenciales inválidas." });
        }

        const usuario = result.rows[0];
        const match = await bcrypt.compare(password, usuario.password_hash);

        if (!match) {
            return res.status(401).json({ ok: false, mensaje: "Credenciales inválidas." });
        }

        const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: "7d" });

        return res.json({
            ok: true,
            mensaje: "Login exitoso.",
            token,
            usuario: { id: usuario.id, email: usuario.email, created_at: usuario.created_at },
        });
    } catch (err) {
        console.error("Error en /login:", err.message);
        return res.status(500).json({ ok: false, mensaje: "Error interno del servidor." });
    }
});

module.exports = router;
