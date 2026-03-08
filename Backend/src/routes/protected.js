const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Bad auth format" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded.userId (because you sign({ userId: user._id }))
    const user = await User.findById(decoded.userId).select("_id email");
    if (!user) return res.status(401).json({ error: "User not found" });

    return res.json({ user: { id: user._id, email: user.email } });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;
