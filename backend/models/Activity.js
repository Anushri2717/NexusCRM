const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['email', 'call', 'note', 'meeting', 'stage-change', 'deal-won', 'deal-lost'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number }, // minutes, for calls/meetings
  emailSubject: { type: String },
  emailBody: { type: String },
  outcome: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema);
