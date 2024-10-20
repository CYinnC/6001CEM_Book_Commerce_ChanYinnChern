const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto'); // For hashing
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: '', // Your MySQL password
    database: 'users', // Database name
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to database!');
});

// Hash password using SHA-256
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Sign Up Route
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = hashPassword(password);
    const defaultRole = 'user'; // Default role

    db.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
        [username, email, hashedPassword, defaultRole], 
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'User registered successfully!' });
        }
    );
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = hashPassword(password); // Hash the incoming password

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error(err); // Log the error for debugging
            return res.status(500).json({ error: 'Database query error: ' + err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'No user found.' });
        }

        const user = results[0];
        if (hashedPassword !== user.password) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        res.json({
            message: 'Login successful!',
            userId: user.id,
            role: user.role // Send back the user role
        });
    });
});



// Get all users
app.get('/users', (req, res) => {
    db.query('SELECT id, username, email, role FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Delete user
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).send(); // No content
    });
});

// Update user role
app.patch('/users/:id/role', (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;
    db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).send(); // No content
    });
});


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Add Book Route
app.post('/api/books', upload.single('image'), (req, res) => {
    const { title, author, condition, description, user_id, type } = req.body;
    const imagePath = req.file ? req.file.path : null; // Get the file path

    db.query(
        'INSERT INTO books (user_id, title, author, `condition`, description, image, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user_id, title, author, condition, description, imagePath, type], // Correct order
        (err) => {
            if (err) {
                console.error('SQL Error:', err); // Log detailed SQL error
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Book added successfully!' });
        }
    );
});

// Get all books
app.get('/api/books', (req, res) => {
    const userId = req.query.userId; // Get user ID from query parameters
    let query = 'SELECT * FROM books';
    let params = [];

    // If user ID is provided, filter by user ID
    if (userId) {
        query += ' WHERE user_id = ?';
        params.push(userId);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
