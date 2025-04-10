
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Sleep = require('../models/Sleep');

// @route   GET api/sleep
// @desc    Get user's sleep records
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const sleep = await Sleep.find({ user: req.user.id }).sort({ date: -1 });
    res.json(sleep);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/sleep
// @desc    Add a new sleep record
// @access  Private
router.post('/', auth, async (req, res) => {
  const { sleepTime, wakeTime, quality, duration, notes, date } = req.body;

  try {
    const newSleep = new Sleep({
      user: req.user.id,
      sleepTime,
      wakeTime,
      quality,
      duration,
      notes,
      date
    });

    const sleep = await newSleep.save();
    res.json(sleep);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/sleep/:id
// @desc    Update a sleep record
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { sleepTime, wakeTime, quality, duration, notes } = req.body;

  // Build sleep object
  const sleepFields = {};
  if (sleepTime) sleepFields.sleepTime = sleepTime;
  if (wakeTime) sleepFields.wakeTime = wakeTime;
  if (quality) sleepFields.quality = quality;
  if (duration) sleepFields.duration = duration;
  if (notes) sleepFields.notes = notes;

  try {
    let sleep = await Sleep.findById(req.params.id);

    if (!sleep) return res.status(404).json({ msg: 'Sleep record not found' });

    // Make sure user owns the sleep record
    if (sleep.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    sleep = await Sleep.findByIdAndUpdate(
      req.params.id,
      { $set: sleepFields },
      { new: true }
    );

    res.json(sleep);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/sleep/:id
// @desc    Delete a sleep record
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let sleep = await Sleep.findById(req.params.id);

    if (!sleep) return res.status(404).json({ msg: 'Sleep record not found' });

    // Make sure user owns the sleep record
    if (sleep.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Sleep.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Sleep record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
