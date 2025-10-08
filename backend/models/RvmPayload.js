const mongoose = require("mongoose");

const payloadSchema = new mongoose.Schema({
  team_id: { type: String, required: true },
  secret: { type: String, required: true },
  brand_id: { type: String, required: true },
  recording_id: { type: String, required: true },
  phone_number: { type: String, required: true },
  forwarding_number: { type: String, required: true },
  foreign_id: { type: String, required: true },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

const RvmPayload = mongoose.model("RvmPayload", payloadSchema);

module.exports = RvmPayload;
