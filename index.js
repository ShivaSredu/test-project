const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require("cors")

const app = express();
const port = 3005;

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Chintu1999',
    database: 'sample'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as ID', db.threadId);
});


app.post('/users', (req, res) => {
    const { first_name, last_name, email, mobile_number, city, district, state, country } = req.body;
    const sql = `INSERT INTO users (first_name, last_name, email, mobile_number, city, district, state, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(sql, [first_name, last_name, email, mobile_number, city, district, state, country], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId,message:"User Created Successfully" });
    });
});

app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/users/:id', (req, res) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result[0]);
    });
});

app.put('/users/:id', (req, res) => {
    const { first_name, last_name, email, mobile_number, city, district, state, country } = req.body;
    const sql = `UPDATE users SET first_name = ?, last_name = ?, email = ?, mobile_number = ?, city = ?, district = ?, state = ?, country = ? WHERE id = ?`;

    db.query(sql, [first_name, last_name, email, mobile_number, city, district, state, country, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ id: req.params.id, ...req.body });
    });
});

app.delete('/users/:id', (req, res) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
