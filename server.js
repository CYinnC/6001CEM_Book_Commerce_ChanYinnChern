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
        'SELECT * FROM users WHERE username = ? OR email = ?', 
        [username, hashedEmail], 
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length > 0) {
                return res.status(409).json({ message: 'Username or email already exists' });
            }

    
            db.query(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', 
                [username, hashedEmail, hashedPassword, defaultRole], 
                (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.status(201).json({ message: 'User registered successfully' });
                }
            );
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
            return res.status(404).json({ error: 'No user found' });
        }

        const user = results[0];
        if (hashedPassword !== user.password) {
            return res.status(401).json({ error: 'Invalid password' });
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
        res.status(200).json({ message: 'User deleted successfully!' });
    });
});

// Update user role
app.patch('/users/:id/role', (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;
    db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: `User role updated to ${role} successfully!` });
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
    const { title, author, condition, description, user_id, type, price, genres } = req.body; 
    const imagePath = req.file ? req.file.path : null;

    db.query(
        'INSERT INTO books (user_id, title, author, `condition`, description, image, type, price, recommended, genres) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [user_id, title, author, condition, description, imagePath, type, price, 'default', genres],
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

    db.query('DELETE FROM books WHERE id = ?', [bookId], (err, results) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ message: err.message });
        }

        if (results.affectedRows === 0) {
           
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book deleted successfully!' });
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

// Add trade request
app.post('/api/trades', (req, res) => {
    const { bookId, phoneNumber, meetupLocation, title, bookCondition, description, buyerId, sellerId } = req.body;

    const newTrade = {
        book_id: bookId,
        phone_number: phoneNumber,
        meet_up_location: meetupLocation,
        title,
        book_condition: bookCondition,
        description,
        buyer_id: buyerId, 
        seller_id: sellerId,
        status: 'pending',
    };

    db.query('INSERT INTO trades SET ?', newTrade, (err) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Trade created successfully!', trade: newTrade });
    });
});


// Get trade request
app.get('/api/trades', (req, res) => {
    db.query('SELECT * FROM trades', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


// Update trade status
app.put('/api/trades/:id', (req, res) => {
    const tradeId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    db.query('UPDATE trades SET status = ? WHERE id = ?', [status, tradeId], (err) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Trade request accepted' });
    });
});

// Delete trade request
app.delete('/api/trades/:id', (req, res) => {
    const tradeId = req.params.id;
    db.query('DELETE FROM trades WHERE id = ?', [tradeId], (err) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Trade request has been cancel' });
    });
});



// Add purchase request
app.post('/api/purchases', (req, res) => {
    const { bookId, phoneNumber, shippingAddress, buyerId, sellerId, status } = req.body;

    const newPurchase = {
        book_id: bookId,
        phone_number: phoneNumber,
        shipping_address: shippingAddress,
        buyer_id: buyerId, 
        seller_id: sellerId,
        status,
        created_time: new Date(),
    };

    db.query('INSERT INTO purchases SET ?', newPurchase, (err) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Purchase created successfully!', purchase: newPurchase });
    });
});

// Get purchase requests
app.get('/api/purchases', (req, res) => {
    db.query('SELECT * FROM purchases', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Update purchase status
app.put('/api/purchases/:id', (req, res) => {
    const purchaseId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    db.query('UPDATE purchases SET status = ? WHERE id = ?', [status, purchaseId], (err) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Purchase request accepted' });
    });
});



// Delete purchase request
app.delete('/api/purchases/:id', (req, res) => {
    const purchaseId = req.params.id;
    db.query('DELETE FROM purchases WHERE id = ?', [purchaseId], (err) => {
        if (err) {
            console.error('SQL Error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Purchase request has been canceled' });
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
            res.status(200).json({ message: `Book status updated to ${status} successfully!` });
        }
    );
});



// Add Complaint
app.post('/api/complaints', (req, res) => {
    const { username, email, issueType, detail } = req.body;

    db.query(
        'INSERT INTO complaints (username, email, issue_type, detail) VALUES (?, ?, ?, ?)', 
        [username, email, issueType, detail],
        (err) => {
            if (err) {
                console.error('SQL Error:', err);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Complaint submitted successfully!' });
        }
    );
});



// GET all complaints
app.get('/api/complaints', (req, res) => {
    const query = 'SELECT * FROM complaints';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching complaints:', err);
            return res.status(500).json({ error: 'Failed to fetch complaints' });
        }
        res.json(results);
    });
});

// DELETE complaint
app.delete('/api/complaints/:id', (req, res) => {
    const complaintId = req.params.id;
    const query = 'DELETE FROM complaints WHERE id = ?';

    db.query(query, [complaintId], (err, results) => {
        if (err) {
            console.error('Error deleting complaint:', err);
            return res.status(500).json({ error: 'Failed to delete complaint' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Complaint not found' });
        }
        res.json({ message: 'Complaint deleted successfully' });
    });
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
