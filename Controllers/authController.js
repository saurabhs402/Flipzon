const User = require('../Models/user');
const jwt = require('jsonwebtoken'); 

const JWT_SECRET_STR = process.env.JWT_SECRET_STR || 'your_jwt_secret_key';

async function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    console.log(token)

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_STR);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Failed to authenticate token' });
    }
}



// User signup
 async function signup (req, res)  {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create a new user
        user = new User({ username, email, password });
        await user.save();

        // Generate a token for the user
        const token = user.generateAuthToken();

        res.status(201).json({ token, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during signup' });
    }
};

// User login
 async function login (req, res) {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate a token for the user
        const token = user.generateAuthToken();

        res.status(200).json({ token, message: 'Logged in successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred during login' });
    }
};


module.exports = { authenticateToken, login, signup }