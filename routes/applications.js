const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { isAuthenticated, isCompany } = require('../middleware/auth');

// GET /applications — company views all applications for their internships
router.get('/', isAuthenticated, isCompany, async (req, res) => {
    try {
        const applications = await Application.find()
            .populate({ path: 'internship', match: { company: req.session.user.id } })
            .populate('student', 'name email');

        const filtered = applications.filter(a => a.internship);
        res.render('applications/index', {
            title: 'Applications — Conneto',
            applications: filtered,
            user: req.session.user
        });
    } catch (err) {
        res.status(500).send('Error loading applications');
    }
});

// POST /applications/:id/status — company updates application status
router.post('/:id/status', isAuthenticated, isCompany, async (req, res) => {
    try {
        await Application.findByIdAndUpdate(req.params.id, {
            status: req.body.status,
            interviewDate: req.body.interviewDate || undefined,
            interviewNote: req.body.note || undefined,
            updatedAt: Date.now()
        });
        res.redirect('/applications');
    } catch (err) {
        res.status(500).send('Error updating status');
    }
});

module.exports = router;
