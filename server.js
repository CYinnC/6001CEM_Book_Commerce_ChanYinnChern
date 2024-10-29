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
    user: 'root',
    password: '',
    database: 'users',
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to database!');
});

// Hash password
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Hash email
const hashEmail = (email) => {
    return crypto.createHash('sha256').update(email).digest('hex');
};

// Sign Up 
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = hashPassword(password);
    const hashedEmail = hashEmail(email);
    const defaultRole = 'user';

    db.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
        [username, hashedEmail, hashedPassword, defaultRole], 
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'User registered successfully!' });
        }
    );
});

// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = hashPassword(password);
    const hashedEmail = hashEmail(email);

    db.query('SELECT * FROM users WHERE email = ?', [hashedEmail], (err, results) => {
        if (err) {
            console.error(err);
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
            role: user.role
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
        res.status(204).send();
    });
});

// Update user role
app.patch('/users/:id/role', (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;
    db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).send();
    });
});


//file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Add Book
app.post('/api/books', upload.single('image'), (req, res) => {
    const { title, author, condition, description, user_id, type, price } = req.body; 
    const imagePath = req.file ? req.file.path : null;

    db.query(
        'INSERT INTO books (user_id, title, author, `condition`, description, image, type, price, recommended) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [user_id, title, author, condition, description, imagePath, type, price, 'default'],
        (err) => {
            if (err) {
                console.error('SQL Error:', err);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Book added successfully!' });
        }
    );
});

// Get all books
app.get('/api/books', (req, res) => {
    const userId = req.query.userId;
    let query = 'SELECT * FROM books';
    let params = [];

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

app.get('/api/book-counts', (req, res) => {
    db.query('SELECT type, COUNT(*) AS count FROM books GROUP BY type', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: err.message });
        }
        const counts = results.reduce((acc, row) => {
            acc[row.type] = row.count;
            return acc;
        }, { selling: 0, trading: 0 });

        res.json(counts);
    });
});


// Delete Book
app.delete('/api/books/:id', (req, res) => {
    const bookId = req.params.id;
    db.query('DELETE FROM books WHERE id = ?', [bookId], (err) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send();
    });
});



// Get user by ID
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT username FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(results[0]); // Return the user object
    });
});


// Get a book by ID
app.get('/api/books/:id', (req, res) => {
    const bookId = req.params.id;
    db.query(
        'SELECT books.*, users.username FROM books JOIN users ON books.user_id = users.id WHERE books.id = ?',
        [bookId],
        (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ error: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Book not found.' });
            }
            res.json(results[0]);
        }
    );
});


// Add Request
app.post('/api/requests', (req, res) => {
    const { bookId, requestType, phoneNumber, meetupLocation, title, bookCondition, description, buyerId, sellerId } = req.body;

    const newRequest = {
        book_id: bookId,
        request_type: requestType,
        phone_number: phoneNumber,
        meet_up_location: meetupLocation,
        title,
        book_condition: bookCondition,
        description,
        buyer_id: buyerId, 
        seller_id: sellerId,
        status: 'pending',
    };

    db.query('INSERT INTO requests SET ?', newRequest, (err) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Request created successfully!', request: newRequest });
    });
});


// Get all requests
app.get('/api/requests', (req, res) => {
    db.query('SELECT * FROM requests', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


// Delete Request
app.delete('/api/requests/:id', (req, res) => {
    const requestId = req.params.id;
    db.query('DELETE FROM requests WHERE id = ?', [requestId], (err) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send();
    });
});

// Update recommendation status
app.put('/api/recommendations', (req, res) => {
    const { book_id, status } = req.body;

    if (!book_id || status === undefined) {
        return res.status(400).json({ error: 'Book ID and status are required.' });
    }

    db.query(
        'UPDATE books SET recommended = ? WHERE id = ?',
        [status, book_id],
        (err) => {
            if (err) {
                console.error('SQL Error:', err);
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: `Book recommendation status updated to ${status} successfully!` });
        }
    );
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
