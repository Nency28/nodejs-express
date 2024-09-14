const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/login', (req, res) => {
    res.render('auth/login', { message: req.flash('error') });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/auth/login');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/auth/login');
        }
        req.session.user = user;
        res.redirect('/students');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Login failed');
        res.redirect('/auth/login');
    }
});

router.get('/register', (req, res) => {
    res.render('auth/register', { message: req.flash('error') });
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        req.session.user = newUser;
        res.redirect('/students');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Registration failed');
        res.redirect('/auth/register');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

module.exports = router;
