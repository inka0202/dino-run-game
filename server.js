const express = require("express");
const app = express();
const path = require("path");

const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./backend/routes/authRoutes");
const scoreRoutes = require("./backend/routes/scoreRoutes");

// Load environment variables from .env
dotenv.config();
// Middlewares
app.use(cors());
app.use(express.json()); // для читання JSON з body
app.use(express.static(path.join(__dirname, "public"))); // Frontend

// API Routes
app.use("/api/auth", authRoutes); // /api/auth/login, /api/auth/register
app.use("/api/score", scoreRoutes); // /api/score (POST, GET)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
