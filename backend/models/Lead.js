const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, default: '' },
  company: { type: String, required: true },
  position: { type: String, default: '' },
  stage: {
    type: String,
    enum: ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
    default: 'prospecting'
  },
  temperature: {
    type: String,
    enum: ['hot', 'warm', 'cold'],
    default: 'warm'
  },
  dealValue: { type: Number, default: 0 },
  source: {
    type: String,
    enum: ['website', 'referral', 'cold-call', 'linkedin', 'email', 'other'],
    default: 'other'
  },
  notes: { type: String, default: '' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [{ type: String }],
  expectedClose: { type: Date },
  lastContacted: { type: Date }
}, { timestamps: true });

LeadSchema.index({ name: 'text', company: 'text', email: 'text' });

module.exports = mongoose.model('Lead', LeadSchema);
