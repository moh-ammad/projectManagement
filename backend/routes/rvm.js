const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const RvmPayload = require("../models/RvmPayload");

dotenv.config();

const router = express.Router();

// CREATE - POST /api/rvm
router.post("/", async (req, res) => {
  const payload = req.body;

  try {
    // 1. Save to MongoDB
    const saved = await RvmPayload.create(payload);

    // 2. Forward payload to DropCowboy API
    const cowboyResponse = await axios.post(process.env.COWBOY_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        // Add Authorization headers here if needed
      },
    });

    console.log("✅ Payload forwarded to DropCowboy");

    // 3. Respond
    res.status(201).json({
      message: "Payload saved and forwarded",
      data: saved,
      cowboyResponse: cowboyResponse.data,
    });
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Something went wrong",
      error: error.response?.data || error.message,
    });
  }
});

// READ ALL - GET /api/rvm
router.get("/", async (req, res) => {
  try {
    const allPayloads = await RvmPayload.find().sort({ createdAt: -1 });
    res.json(allPayloads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch payloads" });
  }
});

// READ ONE - GET /api/rvm/:id
router.get("/:id", async (req, res) => {
  try {
    const payload = await RvmPayload.findById(req.params.id);
    if (!payload) return res.status(404).json({ message: "Payload not found" });
    res.json(payload);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch payload" });
  }
});

// UPDATE - PUT /api/rvm/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await RvmPayload.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Payload not found" });
    res.json({ message: "Payload updated", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update payload" });
  }
});

// DELETE - DELETE /api/rvm/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await RvmPayload.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Payload not found" });
    res.json({ message: "Payload deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete payload" });
  }
});

module.exports = router;
