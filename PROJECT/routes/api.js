const express = require('express');
const router = express.Router();
const { Workout } = require('../models');

// Get all workouts
router.get('/', async (req, res) => {
    try {
        const workouts = await Workout.findAll();
        res.json(workouts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch workouts' });
    }
});

// Add a new workout
router.post('/', async (req, res) => {
    try {
        const newWorkout = await Workout.create(req.body);
        res.json(newWorkout);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add workout' });
    }
});

module.exports = router;
