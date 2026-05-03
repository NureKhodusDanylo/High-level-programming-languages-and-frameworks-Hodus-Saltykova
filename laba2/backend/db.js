const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user'
        )`, (err) => {
            if (err) {
                console.error('Error creating users table', err);
            } else {
                // Insert a default admin user if it doesn't exist
                const insertAdmin = `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`;
                db.get(`SELECT id FROM users WHERE email = ?`, ['admin@test.com'], (err, row) => {
                    if (!row) {
                        const hash = bcrypt.hashSync('admin123', 10);
                        db.run(insertAdmin, ['admin@test.com', hash, 'admin']);
                    }
                });
            }
        });

        // Create tasks table
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'pending',
            deadline DATETIME,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            userId INTEGER,
            FOREIGN KEY(userId) REFERENCES users(id)
        )`, (err) => {
            if (err) console.error('Error creating tasks table', err);
        });
    }
});

module.exports = db;
