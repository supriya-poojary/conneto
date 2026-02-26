const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.render('index', { title: 'Conneto — Find Your Internship', user: req.session.user || null });
});

// About page
router.get('/about', (req, res) => {
    res.sendFile(require('path').join(__dirname, '../about.html'));
});

// Contact page
router.get('/contact', (req, res) => {
    res.sendFile(require('path').join(__dirname, '../contact.html'));
});

module.exports = router;
