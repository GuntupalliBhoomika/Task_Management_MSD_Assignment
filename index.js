const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Serve static files from the public directory
app.use(express.static('public'));

// Define a simple route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // Serve index.html on the root route
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const User = require('./models/User'); // Import the User model
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For token generation

// Registration route
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser  = new User({ username, password: hashedPassword });
        await newUser .save();

        res.status(201).json({ message: 'User  registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a token (optional)
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});
// Assuming you have already set up your Express app and connected to MongoDB

// GET route to fetch all users
app.get('/users', async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find({});
        
        // Send the users as a JSON response
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});