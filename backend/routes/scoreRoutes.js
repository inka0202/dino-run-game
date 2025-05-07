const express = require("express");
const router = express.Router();
const { saveScore, getScore } = require("../controllers/scoreController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, saveScore);
router.get("/", verifyToken, getScore); // новий маршрут

module.exports = router;
