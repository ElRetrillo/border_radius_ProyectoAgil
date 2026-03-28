const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST || "db",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

pool.on("connect", () => {
    console.log("✅ Conectado a PostgreSQL");
});

pool.on("error", (err) => {
    console.error("❌ Error en el pool de PostgreSQL:", err.message);
});

module.exports = pool;
