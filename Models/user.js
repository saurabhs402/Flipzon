const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare input password with the hashed password in the database
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate a JWT token for the user
userSchema.methods.generateAuthToken = function () {
    const JWT_SECRET_STR = process.env.JWT_SECRET_STR || 'your_jwt_secret_key';

    const token = jwt.sign({ userId: this._id }, JWT_SECRET_STR, { expiresIn: '1h' });
    return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
