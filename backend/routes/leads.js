const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');
const { protect, authorize } = require('../middleware/auth');

// All routes require auth
router.use(protect);

// GET /api/leads  — cursor-based pagination
router.get('/', async (req, res) => {
  try {
    const { cursor, limit = 20, stage, temperature, search, assignedTo } = req.query;
    const filter = {};

    if (req.user.role === 'sales_rep') filter.assignedTo = req.user._id;
    if (stage) filter.stage = stage;
    if (temperature) filter.temperature = temperature;
    if (assignedTo && req.user.role === 'admin') filter.assignedTo = assignedTo;
    if (search) filter.$text = { $search: search };
    if (cursor) filter._id = { $lt: cursor };

    const leads = await Lead.find(filter)
      .sort({ _id: -1 })
      .limit(Number(limit) + 1)
      .populate('assignedTo', 'name email');

    const hasMore = leads.length > Number(limit);
    if (hasMore) leads.pop();

    res.json({
      leads,
      nextCursor: hasMore ? leads[leads.length - 1]._id : null,
      hasMore
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/leads/:id
router.get('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    const activities = await Activity.find({ lead: lead._id })
      .sort({ createdAt: -1 })
      .populate('performedBy', 'name');
    res.json({ lead, activities });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/leads
router.post('/', async (req, res) => {
  try {
    const lead = await Lead.create({ ...req.body, assignedTo: req.body.assignedTo || req.user._id });
    await Activity.create({
      type: 'note',
      title: 'Lead created',
      lead: lead._id,
      performedBy: req.user._id
    });
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/leads/:id
router.put('/:id', async (req, res) => {
  try {
    const prev = await Lead.findById(req.params.id);
    if (!prev) return res.status(404).json({ message: 'Lead not found' });

    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    }).populate('assignedTo', 'name email');

    if (prev.stage !== lead.stage) {
      await Activity.create({
        type: 'stage-change',
        title: `Stage changed to ${lead.stage}`,
        description: `From "${prev.stage}" → "${lead.stage}"`,
        lead: lead._id,
        performedBy: req.user._id
      });
    }
    res.json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/leads/:id — admin only
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    await Activity.deleteMany({ lead: req.params.id });
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
