
const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const auth = require('../middleware/auth');

// Get all moods for current user
router.get('/', auth, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new mood entry
router.post('/', auth, async (req, res) => {
  const { mood, note } = req.body;

  try {
    const newMood = new Mood({
      user: req.user.id,
      mood,
      note
    });

    const savedMood = await newMood.save();
    res.json(savedMood);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
