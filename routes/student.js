const express = require('express');
const router = express.Router();
const StudentProfile = require('../models/StudentProfile');
const Application = require('../models/Application');
const { isAuthenticated, isStudent } = require('../middleware/auth');

// GET /student/dashboard
router.get('/dashboard', isAuthenticated, isStudent, async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.session.user.id });
        const applications = await Application.find({ student: req.session.user.id })
            .populate('internship', 'title location stipend company');
        res.render('student/dashboard', {
            title: 'Student Dashboard — Conneto',
            user: req.session.user,
            profile,
            applications
        });
    } catch (err) {
        res.status(500).send('Dashboard error');
    }
});

// GET /student/profile/edit
router.get('/profile/edit', isAuthenticated, isStudent, async (req, res) => {
    const profile = await StudentProfile.findOne({ user: req.session.user.id });
    res.render('student/edit-profile', { title: 'Edit Profile — Conneto', user: req.session.user, profile });
});

// POST /student/profile/edit
router.post('/profile/edit', isAuthenticated, isStudent, async (req, res) => {
    const { college, degree, branch, year, gpa, skills, bio, phone, linkedin, github, portfolio, location } = req.body;
    await StudentProfile.findOneAndUpdate(
        { user: req.session.user.id },
        { college, degree, branch, year, gpa, skills: skills.split(',').map(s => s.trim()), bio, phone, linkedin, github, portfolio, location, updatedAt: Date.now() },
        { upsert: true, new: true }
    );
    res.redirect('/student/dashboard');
});

module.exports = router;
