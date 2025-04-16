import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,     // ejemplo: 'localhost'
  user: process.env.DB_USER,     // ejemplo: 'root'
  password: process.env.DB_PASS, // ejemplo: 'tu_password'
  database: process.env.DB_NAME, // ejemplo: 'mi_base_de_datos'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
