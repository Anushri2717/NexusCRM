const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/activities — global feed
router.get('/', async (req, res) => {
  try {
    const { type, limit = 30, cursor } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (cursor) filter._id = { $lt: cursor };

    const activities = await Activity.find(filter)
      .sort({ _id: -1 })
      .limit(Number(limit) + 1)
      .populate('performedBy', 'name')
      .populate('lead', 'name company');

    const hasMore = activities.length > Number(limit);
    if (hasMore) activities.pop();

    res.json({ activities, hasMore, nextCursor: hasMore ? activities[activities.length - 1]._id : null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/activities
router.post('/', async (req, res) => {
  try {
    const activity = await Activity.create({ ...req.body, performedBy: req.user._id });
    await activity.populate('performedBy', 'name');
    await activity.populate('lead', 'name company');
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
