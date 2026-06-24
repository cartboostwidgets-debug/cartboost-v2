const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: {
        rejectUnauthorized: false // Necesario para Render/Railway
    }
});

// Crear tabla de tiendas si no existe
pool.query(`
    CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        user_uid VARCHAR(255) NOT NULL,
        store_id INTEGER NOT NULL,
        store_name VARCHAR(255),
        store_url VARCHAR(255),
        access_token TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
`).catch(err => console.error('Error creando tabla PostgreSQL:', err));

module.exports = pool;
