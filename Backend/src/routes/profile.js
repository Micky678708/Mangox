const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/me", auth, async (req, res) => {
  try {
    const { bio } = req.body;

    const user = User.findByIdAndUpdate
     res.json({
   _id: user._id,
   username: user.username,
   email: user.email
});


    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
