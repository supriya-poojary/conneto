const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const { isAuthenticated, isStudent } = require('../middleware/auth');

// GET /internships — browse all active internships
router.get('/', async (req, res) => {
    try {
        const { search, location, type } = req.query;
        const filter = { isActive: true };
        if (search) filter.title = { $regex: search, $options: 'i' };
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (type) filter.type = type;

        const internships = await Internship.find(filter)
            .populate('company', 'name')
            .sort({ createdAt: -1 });

        res.render('internships/index', {
            title: 'Browse Internships — Conneto',
            internships,
            user: req.session.user || null,
            filters: req.query
        });
    } catch (err) {
        res.status(500).send('Error loading internships');
    }
});

// GET /internships/:id — view single internship
router.get('/:id', async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id).populate('company', 'name');
        if (!internship) return res.status(404).render('404', { title: '404' });

        let hasApplied = false;
        if (req.session.user?.role === 'student') {
            hasApplied = await Application.exists({ internship: internship._id, student: req.session.user.id });
        }
        res.render('internships/detail', {
            title: `${internship.title} — Conneto`,
            internship,
            hasApplied,
            user: req.session.user || null
        });
    } catch (err) {
        res.status(500).send('Error loading internship');
    }
});

// POST /internships/:id/apply — student applies
router.post('/:id/apply', isAuthenticated, isStudent, async (req, res) => {
    try {
        await Application.create({
            internship: req.params.id,
            student: req.session.user.id,
            coverLetter: req.body.coverLetter
        });
        res.redirect('/student/dashboard');
    } catch (err) {
        res.status(500).send('Error applying');
    }
});

module.exports = router;
