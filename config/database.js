const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

class Database {
    constructor() {
        this.db = null;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            try {
                const dbPath = path.resolve(process.env.DB_FILE || './database/schools.db');
                const dbDir = path.dirname(dbPath);
                
                const fs = require('fs');
                if (!fs.existsSync(dbDir)) {
                    fs.mkdirSync(dbDir, { recursive: true });
                }

                this.db = new sqlite3.Database(dbPath, (err) => {
                    if (err) {
                        console.error('Database connection failed:', err.message);
                        reject(err);
                    } else {
                        console.log('Connected to SQLite database successfully');
                        resolve(this.db);
                    }
                });
            } catch (error) {
                console.error('Database connection failed:', error.message);
                reject(error);
            }
        });
    }

    async createTables() {
        return new Promise((resolve, reject) => {
            try {
                const createSchoolsTable = `
                    CREATE TABLE IF NOT EXISTS schools (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        address TEXT NOT NULL,
                        latitude REAL NOT NULL,
                        longitude REAL NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `;

                this.db.run(createSchoolsTable, (err) => {
                    if (err) {
                        console.error('Error creating tables:', err.message);
                        reject(err);
                    } else {
                        console.log('Schools table created successfully');
                        this.insertSampleData().then(resolve).catch(reject);
                    }
                });
            } catch (error) {
                console.error('Error creating tables:', error.message);
                reject(error);
            }
        });
    }

    async insertSampleData() {
        return new Promise((resolve, reject) => {
            const checkData = `SELECT COUNT(*) as count FROM schools`;
            
            this.db.get(checkData, (err, row) => {
                if (err) {
                    console.error('Error checking existing data:', err.message);
                    reject(err);
                    return;
                }

                if (row.count > 0) {
                    console.log('Sample data already exists, skipping insertion');
                    resolve();
                    return;
                }

                const insertData = `
                    INSERT INTO schools (name, address, latitude, longitude) VALUES
                    ('Delhi Public School', 'Sector 24, Rohini, New Delhi, Delhi 110085', 28.7041, 77.1025),
                    ('Ryan International School', 'Sector 25, Rohini, New Delhi, Delhi 110085', 28.7051, 77.1035),
                    ('St. Mary''s School', 'R K Puram, New Delhi, Delhi 110022', 28.5706, 77.1807),
                    ('Modern School', 'Barakhamba Road, New Delhi, Delhi 110001', 28.6250, 77.2197),
                    ('Sardar Patel Vidyalaya', 'Lodhi Estate, New Delhi, Delhi 110003', 28.5933, 77.2507),
                    ('The Heritage School', 'Vasant Vihar, New Delhi, Delhi 110057', 28.5506, 77.1601),
                    ('Bluebells School International', 'Kailash Colony, New Delhi, Delhi 110048', 28.5355, 77.2425),
                    ('Mount Abu Public School', 'Rohini, New Delhi, Delhi 110085', 28.7041, 77.1125)
                `;

                this.db.exec(insertData, (err) => {
                    if (err) {
                        console.error('Error inserting sample data:', err.message);
                        reject(err);
                    } else {
                        console.log('Sample data inserted successfully');
                        resolve();
                    }
                });
            });
        });
    }

    async initialize() {
        try {
            await this.connect();
            await this.createTables();
        } catch (error) {
            console.error('Database initialization failed:', error.message);
            throw error;
        }
    }

    getConnection() {
        return this.db;
    }

    async close() {
        return new Promise((resolve) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed');
                    }
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    async run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    async get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = new Database();
