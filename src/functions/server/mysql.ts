// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database
export const connection = async () => await mysql.createConnection({ host: process.env.HOST, user: process.env.USER, password: process.env.PASSWORD, database: process.env.DATABASE })