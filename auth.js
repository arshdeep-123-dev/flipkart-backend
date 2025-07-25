const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

//User model definition
const User = mongoose.model('User', new mongoose.Schema({
    email: String, 
    password: String
})); // Assuming you have a User model defined in models/User.js

//signup router
router.post('/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        email,
        password: hashedPassword
    });

    await newUser.save();
    // res.status(201).json({ message: "User created successfully" });

    const token = jwt.sign({userID: newUser._id}, 'secret', {expiresIn: '1h'});
    res.status(200).json({ token });
})

// login router
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userID: user._id }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ token });
});

//jwt middleware
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if(authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'secret', (err, user) => {
            if(err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else{
        res.sendStatus(401);
    }
}

module.exports = {router, authenticateJWT};