const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

// Database file path
const DB_FILE = path.join(__dirname, "guests.db");

// Initialize SQLite database
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
  } else {
    console.log("Connected to SQLite database");
    db.run(
      `CREATE TABLE IF NOT EXISTS guests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guestname TEXT,
        guestnumber TEXT,
        phonenumber TEXT,
        vege BOOLEAN
      )`,
      (err) => {
        if (err) {
          console.error("Error creating table:", err.message);
        }
      }
    );
  }
});

// Middleware
app.use(express.json());

// Serve Angular app
const angularPath = path.join(__dirname, "../dist/testproj1/browser");
if (fs.existsSync(angularPath)) {
  app.use("/ui", express.static(angularPath));

  // Handle SPA routing
  app.get("/ui/*", (req, res) => {
    res.sendFile(path.join(angularPath, "index.html"));
  });
}

// API Routes
app.get("/guests", (req, res) => {
  db.all("SELECT * FROM guests", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/guests", (req, res) => {
  const { guestname, guestnumber, phonenumber, vege } = req.body;
  if (!guestname || !guestnumber || !phonenumber) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    `INSERT INTO guests (guestname, guestnumber, phonenumber, vege) VALUES (?, ?, ?, ?)`,
    [guestname, guestnumber, phonenumber, vege],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, guestname, guestnumber, phonenumber, vege });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
