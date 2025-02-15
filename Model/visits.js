
const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    timestamp: { type: Date, required: true },
    ip: { type: String, required: false }, // Make ip optional
    count: { type: Number, default: 1 },  // Add count field
    location: {
      country: { type: String, default: null },
      region: { type: String, default: null },
      city: { type: String, default: null },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
  });
// const Visit = mongoose.models.Visit || mongoose.model("Visit", visitSchema);

module.exports = mongoose.model('Visits', visitSchema);
