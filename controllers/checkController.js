const express = require("express");

const { generateToken } = require("../utils/token");
const { findUserByUsername } = require("../queries/users");
const { authenticateToken } = require("../middlewares/authenticateToken");

const check = express.Router();

check.get("/check-auth", authenticateToken, (req, res) => {
  // Assuming authenticateToken middleware adds user info to req.user

  if (req.user) {
    const { user } = req;
    return res.status(200).json({
      isAuthenticated: true,
      user: {
        user,
      },
    });
  } else {
    // If for some reason, req.user is not set, treat as not authenticated
    res.status(401).json({ isAuthenticated: false });
  }
});

check.get("/user", authenticateToken, async (req, res) => {
  const { user } = req;
  try {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user)
      // Return the user information, excluding sensitive data like password
      res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = check;
