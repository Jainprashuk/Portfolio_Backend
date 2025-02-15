
const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    count: { type: Number, default: 1 },
    ip: { type: String, required: true },
    location: {
      country: String,
      region: String,
      city: String,
      latitude: Number,
      longitude: Number,
    },
    timestamps: { type: [Date], required: true },  // Array of timestamps
  });
// const Visit = mongoose.models.Visit || mongoose.model("Visit", visitSchema);

module.exports = mongoose.model('Visits', visitSchema);
