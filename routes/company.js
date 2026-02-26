const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');
const { isAuthenticated, isCompany } = require('../middleware/auth');

// GET /company/dashboard
router.get('/dashboard', isAuthenticated, isCompany, async (req, res) => {
    try {
        const profile = await CompanyProfile.findOne({ user: req.session.user.id });
        const internships = await Internship.find({ company: req.session.user.id });
        res.render('company/dashboard', {
            title: 'Company Dashboard — Conneto',
            user: req.session.user,
            profile,
            internships
        });
    } catch (err) {
        res.status(500).send('Dashboard error');
    }
});

// GET /company/post-internship
router.get('/post-internship', isAuthenticated, isCompany, (req, res) => {
    res.render('company/post-internship', { title: 'Post Internship — Conneto', user: req.session.user, error: null });
});

// POST /company/post-internship
router.post('/post-internship', isAuthenticated, isCompany, async (req, res) => {
    try {
        const { title, description, location, type, duration, stipend, skills, openings, deadline } = req.body;
        await Internship.create({
            company: req.session.user.id,
            title, description, location, type, duration,
            stipend: stipend || 0,
            skills: skills.split(',').map(s => s.trim()),
            openings: openings || 1,
            deadline: deadline || undefined
        });
        res.redirect('/company/dashboard');
    } catch (err) {
        res.render('company/post-internship', { title: 'Post Internship — Conneto', user: req.session.user, error: 'Failed to post. Try again.' });
    }
});

// GET /company/applicants/:internshipId — view all applicants for one internship
router.get('/applicants/:internshipId', isAuthenticated, isCompany, async (req, res) => {
    try {
        const applications = await Application.find({ internship: req.params.internshipId })
            .populate('student', 'name email')
            .populate('internship', 'title');
        res.render('company/applicants', {
            title: 'Applicants — Conneto',
            user: req.session.user,
            applications
        });
    } catch (err) {
        res.status(500).send('Error loading applicants');
    }
});

// GET /company/student/:studentId — view student profile
router.get('/student/:studentId', isAuthenticated, isCompany, async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.params.studentId }).populate('user', 'name email');
        if (!profile) return res.status(404).render('404', { title: '404' });
        res.render('company/view-student', {
            title: `${profile.user.name}'s Profile — Conneto`,
            user: req.session.user,
            profile
        });
    } catch (err) {
        res.status(500).send('Error loading student profile');
    }
});

module.exports = router;
