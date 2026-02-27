const express = require('express');
const router = express.Router();
const path = require('path');

// Project root directory
const ROOT = path.resolve(__dirname, '..');

// Home page
router.get('/', (req, res) => {
    res.render('index', { title: 'Conneto — Find Your Internship', user: req.session.user || null });
});

// About page
router.get('/about', (req, res) => {
    res.sendFile(path.join(ROOT, 'about.html'));
});

// Contact page
router.get('/contact', (req, res) => {
    res.sendFile(path.join(ROOT, 'contact.html'));
});

module.exports = router;
