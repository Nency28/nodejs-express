const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Ensure this path is correct

router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.render('students/index', { students: students, message: [] });
    } catch (error) {
        res.render('students/index', { students: [], message: [error.message] });
    }
});

router.get('/new', (req, res) => {
    res.render('students/new', { message: [] });
});

router.post('/', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.redirect('/students');
    } catch (error) {
        res.render('students/new', { message: [error.message] });
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            res.redirect('/students');
        } else {
            res.render('students/edit', { student: student, message: [] });
        }
    } catch (error) {
        res.redirect('/students');
    }
});

router.put('/:id', async (req, res) => {
    try {
        await Student.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/students');
    } catch (error) {
        res.render('students/edit', { student: req.body, message: [error.message] });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            res.redirect('/students');
        } else {
            res.render('students/show', { student: student, message: [] });
        }
    } catch (error) {
        res.redirect('/students');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.redirect('/students');
    } catch (error) {
        res.redirect('/students');
    }
});

module.exports = router;
