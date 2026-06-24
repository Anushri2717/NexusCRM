const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/pipeline — stage breakdown + summary stats
router.get('/', async (req, res) => {
  try {
    const matchFilter = req.user.role === 'sales_rep' ? { assignedTo: req.user._id } : {};

    const stageData = await Lead.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 },
          totalValue: { $sum: '$dealValue' }
        }
      }
    ]);

    const tempData = await Lead.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$temperature', count: { $sum: 1 } } }
    ]);

    const totals = await Lead.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          totalPipeline: { $sum: '$dealValue' },
          wonDeals: { $sum: { $cond: [{ $eq: ['$stage', 'closed-won'] }, 1, 0] } },
          wonValue: { $sum: { $cond: [{ $eq: ['$stage', 'closed-won'] }, '$dealValue', 0] } }
        }
      }
    ]);

    // Monthly won deals for performance chart
    const monthlyWon = await Lead.aggregate([
      { $match: { ...matchFilter, stage: 'closed-won' } },
      {
        $group: {
          _id: { year: { $year: '$updatedAt' }, month: { $month: '$updatedAt' } },
          count: { $sum: 1 },
          value: { $sum: '$dealValue' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.json({
      stageData,
      tempData,
      totals: totals[0] || { totalLeads: 0, totalPipeline: 0, wonDeals: 0, wonValue: 0 },
      monthlyWon
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
