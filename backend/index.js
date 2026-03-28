const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:80", "http://localhost"],
    credentials: true,
}));
app.use(express.json());

/* ── Rutas ── */
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({ ok: true, mensaje: "API funcionando correctamente 🚀" });
});

/* ── Inicializar tabla y admin al arrancar ── */
async function initDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id           SERIAL PRIMARY KEY,
                email        VARCHAR(255) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at   TIMESTAMPTZ DEFAULT NOW()
            )
        `);
        console.log("✅ Tabla 'usuarios' lista.");

        // Insertar admin por defecto si no existe
        const adminEmail = "admin";
        const adminPass = "admin";
        const res = await pool.query("SELECT id FROM usuarios WHERE email = $1", [adminEmail]);

        if (res.rows.length === 0) {
            const bcrypt = require("bcrypt");
            const hash = await bcrypt.hash(adminPass, 12);
            await pool.query("INSERT INTO usuarios (email, password_hash) VALUES ($1, $2)", [adminEmail, hash]);
            console.log("👤 Usuario administrador (admin/admin) creado correctamente.");
        }
    } catch (err) {
        console.error("❌ Error al inicializar la base de datos:", err.message);
    }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    await initDB();
});