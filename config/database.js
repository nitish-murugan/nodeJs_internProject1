const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        try {
            this.connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                port: process.env.DB_PORT
            });
            
            console.log('Connected to MySQL database successfully');
            return this.connection;
        } catch (error) {
            console.error('Database connection failed:', error.message);
            throw error;
        }
    }

    async createDatabase() {
        try {
            const tempConnection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                port: process.env.DB_PORT
            });

            await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
            console.log(`Database ${process.env.DB_NAME} created or already exists`);
            
            await tempConnection.end();
        } catch (error) {
            console.error('Error creating database:', error.message);
            throw error;
        }
    }

    async createTables() {
        try {
            const createSchoolsTable = `
                CREATE TABLE IF NOT EXISTS schools (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    address VARCHAR(500) NOT NULL,
                    latitude FLOAT NOT NULL,
                    longitude FLOAT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `;

            await this.connection.execute(createSchoolsTable);
            console.log('Schools table created successfully');
        } catch (error) {
            console.error('Error creating tables:', error.message);
            throw error;
        }
    }

    async initialize() {
        try {
            await this.createDatabase();
            await this.connect();
            await this.createTables();
        } catch (error) {
            console.error('Database initialization failed:', error.message);
            throw error;
        }
    }

    getConnection() {
        return this.connection;
    }

    async close() {
        if (this.connection) {
            await this.connection.end();
            console.log('Database connection closed');
        }
    }
}

module.exports = new Database();
