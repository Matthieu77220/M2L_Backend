// Import des dépendances
import mysql2 from "mysql2"
import 'dotenv/config'


const db = mysql2.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true // permet d'executer plusieurs requetes SQL
})

export default db;
