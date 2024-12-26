const fs = require('fs');
const path = require('path');
const Question = require('../models/questionsModel');
const express = require('express');

const router = express.Router();

router.post('/questions/seed', async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../data/questions.json');
        const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ message: 'No questions found in the file.' });
        }

        const result = await Question.insertMany(questions);

        res.status(201).json({
            message: `${result.length} questions seeded successfully.`,
            questions: result,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to seed questions.', error });
    }
});

router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find(); // Fetch all questions from the database
        res.status(200).json({
            message: 'Questions fetched successfully.',
            questions,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch questions.', error });
    }
});
module.exports = router;
