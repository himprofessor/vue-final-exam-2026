const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const { errorHandler, notFound } = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// ---- Global middleware ------------------------------------------------
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// ---- Health check -------------------------------------------------------
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "TaskFlow API is running" });
});

// ---- Routes -------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tasks", taskRoutes);

// ---- 404 + error handling (must be LAST) --------------------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
