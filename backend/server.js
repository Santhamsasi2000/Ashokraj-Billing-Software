require("dotenv").config();
const express = require("express");
const cors = require ("cors");
const Database = require("better-sqlite3");
const path =require("path");
const { initDatabase } = require("./config/db");

// Routes Imports
const menuRoutes = require("./routes/menuRoutes");
const billRoutes = require("./routes/billRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middlewares
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// 2. Initialize SQLite Database
initDatabase();

// Mount Routes
app.use("/api/menu", menuRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/reports", reportRoutes);


// 3. Test route
app.get('/', (req, res) => {
  res.send({ message: "Ashokraj Billing API is running!" });
});

// 4. Start server
app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});
