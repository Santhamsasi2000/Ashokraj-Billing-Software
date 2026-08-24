const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "ashokraj.db");
const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma("journal_mode = WAL");

function initDatabase() {
  // 1. Menu Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      name_ta TEXT NOT NULL,
      price REAL NOT NULL,
      period TEXT NOT NULL,       -- 'morning', 'afternoon', 'dinner'
      is_veg INTEGER DEFAULT 1,   -- 1 = Veg, 0 = Non-Veg
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // 2. Bills Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_no TEXT UNIQUE NOT NULL,
      order_type TEXT NOT NULL,    -- 'dine-in', 'parcel'
      period TEXT NOT NULL,        -- 'morning', 'afternoon', 'dinner'
      subtotal REAL NOT NULL,
      total REAL NOT NULL,
      payment_mode TEXT NOT NULL,  -- 'cash', 'upi'
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // 3. Bill Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bill_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      item_name_ta TEXT NOT NULL,
      qty INTEGER NOT NULL,
      price REAL NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE
    );
  `);

  // 4. Settings Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Seed Default Menu if empty
  const hasItems = db.prepare("SELECT COUNT(*) AS count FROM menu_items").get();
  if (hasItems.count === 0) {
    seedMenuItems();
  }
}

function seedMenuItems() {
  const insert = db.prepare(
    "INSERT INTO menu_items (name, name_ta, price, period, is_veg) VALUES (?, ?, ?, ?, ?)"
  );

  const defaultItems = [
    // 🌅 Morning Items
    ["Idli (2 pcs)", "இட்லி (2)", 40, "morning", 1],
    ["Sambar Idli", "சாம்பார் இட்லி", 50, "morning", 1],
    ["Dosa", "தோசை", 50, "morning", 1],
    ["Masala Dosa", "மசாலா தோசை", 70, "morning", 1],
    ["Rava Dosa", "ரவா தோசை", 60, "morning", 1],
    ["Pongal", "பொங்கல்", 60, "morning", 1],
    ["Poori (2 pcs)", "பூரி (2)", 50, "morning", 1],
    ["Vadai", "வடை", 15, "morning", 1],
    ["Tea", "டீ", 15, "morning", 1],
    ["Coffee", "காபி", 20, "morning", 1],

    // ☀️ Afternoon Items
    ["Veg Meals", "சைவ சாப்பாடு", 100, "afternoon", 1],
    ["Non-Veg Meals", "அசைவ சாப்பாடு", 130, "afternoon", 0],
    ["Chicken Biryani", "சிக்கன் பிரியாணி", 160, "afternoon", 0],
    ["Mutton Biryani", "மட்டன் பிரியாணி", 220, "afternoon", 0],
    ["Egg Biryani", "முட்டை பிரியாணி", 120, "afternoon", 0],
    ["Sambar Rice", "சாம்பார் சாதம்", 70, "afternoon", 1],
    ["Curd Rice", "தயிர் சாதம்", 60, "afternoon", 1],
    ["Chicken 65", "சிக்கன் 65", 140, "afternoon", 0],
    ["Fish Fry", "மீன் வறுவல்", 150, "afternoon", 0],
    ["Buttermilk", "மோர்", 20, "afternoon", 1],

    // 🌙 Dinner Items
    ["Parotta (2 pcs)", "பரோட்டா (2)", 40, "dinner", 1],
    ["Egg Kothu Parotta", "முட்டை கொத்து", 90, "dinner", 0],
    ["Chicken Kothu Parotta", "சிக்கன் கொத்து", 130, "dinner", 0],
    ["Chapati (2 pcs)", "சப்பாத்தி (2)", 40, "dinner", 1],
    ["Egg Dosa", "முட்டை தோசை", 70, "dinner", 0],
    ["Chicken Fried Rice", "சிக்கன் ஃபிரைட் ரைஸ்", 140, "dinner", 0],
    ["Veg Fried Rice", "வெஜ் ஃபிரைட் ரைஸ்", 100, "dinner", 1],
    ["Chicken Noodles", "சிக்கன் நூடுல்ஸ்", 130, "dinner", 0],
    ["Idli (2 pcs)", "இட்லி (2)", 40, "dinner", 1],
    ["Tea", "டீ", 15, "dinner", 1],
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(...item);
  });

  insertMany(defaultItems);
  console.log("🌱 Default Menu Items Seeded!");
}

module.exports = { db, initDatabase };