const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "ashokraj.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

function initDatabase() {
  // 1. Menu Items Table (ADDED short_code)
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      short_code TEXT UNIQUE,     -- e.g., "1", "25", "100"
      name TEXT NOT NULL,
      name_ta TEXT NOT NULL,
      price REAL NOT NULL,
      period TEXT NOT NULL,
      is_veg INTEGER DEFAULT 1,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_no TEXT UNIQUE NOT NULL,
      order_type TEXT NOT NULL,
      period TEXT NOT NULL,
      subtotal REAL NOT NULL,
      total REAL NOT NULL,
      payment_mode TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

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

  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const hasItems = db.prepare("SELECT COUNT(*) AS count FROM menu_items").get();
  if (hasItems.count === 0) {
    seedMenuItems();
  }
}

function seedMenuItems() {
  const insert = db.prepare(
    "INSERT INTO menu_items (short_code, name, name_ta, price, period, is_veg) VALUES (?, ?, ?, ?, ?, ?)"
  );

  const defaultItems = [
    // 🌅 MORNING (Codes 1 to 49)
    ["1", "Idli (2 pcs)", "இட்லி (2)", 40, "morning", 1],
    ["2", "Sambar Idli", "சாம்பார் இட்லி", 50, "morning", 1],
    ["3", "Plain Dosa", "சாதா தோசை", 50, "morning", 1],
    ["4", "Masala Dosa", "மசாலா தோசை", 70, "morning", 1],
    ["5", "Onion Dosa", "வெங்காய தோசை", 65, "morning", 1],
    ["6", "Rava Dosa", "ரவா தோசை", 60, "morning", 1],
    ["7", "Ghee Roast", "நெய் ரோஸ்ட்", 80, "morning", 1],
    ["8", "Podi Dosa", "பொடி தோசை", 60, "morning", 1],
    ["9", "Uttappam", "ஊத்தப்பம்", 50, "morning", 1],
    ["10", "Onion Uttappam", "வெங்காய ஊத்தப்பம்", 60, "morning", 1],
    ["11", "Pongal", "பொங்கல்", 60, "morning", 1],
    ["12", "Poori (2 pcs)", "பூரி (2)", 50, "morning", 1],
    ["13", "Medu Vadai", "மெது வடை", 15, "morning", 1],
    ["14", "Masala Vadai", "மசால் வடை", 15, "morning", 1],
    ["15", "Sambar Vadai", "சாம்பார் வடை", 25, "morning", 1],

    // ☀️ LUNCH (Codes 50 to 99)
    ["50", "Veg Meals", "சைவ சாப்பாடு", 100, "afternoon", 1],
    ["51", "Non-Veg Meals", "அசைவ சாப்பாடு", 130, "afternoon", 0],
    ["52", "Chicken Biryani", "சிக்கன் பிரியாணி", 160, "afternoon", 0],
    ["53", "Mutton Biryani", "மட்டன் பிரியாணி", 220, "afternoon", 0],
    ["54", "Egg Biryani", "முட்டை பிரியாணி", 120, "afternoon", 0],
    ["55", "Plain Biryani (Kuska)", "குஸ்கா", 100, "afternoon", 0],
    ["56", "Tomato Rice", "தக்காளி சாதம்", 60, "afternoon", 1],
    ["57", "Lemon Rice", "எலுமிச்சை சாதம்", 60, "afternoon", 1],
    ["58", "Tamarind Rice", "புளி சாதம்", 60, "afternoon", 1],
    ["59", "Curd Rice", "தயிர் சாதம்", 60, "afternoon", 1],
    ["60", "Sambar Rice", "சாம்பார் சாதம்", 70, "afternoon", 1],
    ["61", "Chicken 65", "சிக்கன் 65", 140, "afternoon", 0],
    ["62", "Pepper Chicken", "பெப்பர் சிக்கன்", 150, "afternoon", 0],
    ["63", "Fish Fry", "மீன் வறுவல்", 150, "afternoon", 0],
    ["64", "Mutton Chukka", "மட்டன் சுக்கா", 200, "afternoon", 0],
    ["65", "Egg Masala", "முட்டை மசாலா", 80, "afternoon", 0],
    ["66", "Omelette", "ஆம்லெட்", 20, "afternoon", 0],

    // 🌙 DINNER (Codes 100 to 149)
    ["100", "Parotta (2 pcs)", "பரோட்டா (2)", 40, "dinner", 1],
    ["101", "Egg Kothu Parotta", "முட்டை கொத்து", 90, "dinner", 0],
    ["102", "Chicken Kothu Parotta", "சிக்கன் கொத்து", 130, "dinner", 0],
    ["103", "Mutton Kothu Parotta", "மட்டன் கொத்து", 180, "dinner", 0],
    ["104", "Chapati (2 pcs)", "சப்பாத்தி (2)", 40, "dinner", 1],
    ["105", "Veg Fried Rice", "வெஜ் ஃபிரைட் ரைஸ்", 100, "dinner", 1],
    ["106", "Egg Fried Rice", "முட்டை ஃபிரைட் ரைஸ்", 120, "dinner", 0],
    ["107", "Chicken Fried Rice", "சிக்கன் ஃபிரைட் ரைஸ்", 140, "dinner", 0],
    ["108", "Veg Noodles", "வெஜ் நூடுல்ஸ்", 100, "dinner", 1],
    ["109", "Egg Noodles", "முட்டை நூடுல்ஸ்", 120, "dinner", 0],
    ["110", "Chicken Noodles", "சிக்கன் நூடுல்ஸ்", 140, "dinner", 0],
    ["111", "Kal Dosa (2 pcs)", "கல் தோசை (2)", 50, "dinner", 1],
    ["112", "Egg Dosa", "முட்டை தோசை", 70, "dinner", 0],
    ["113", "Chicken Kari Dosa", "கறி தோசை", 120, "dinner", 0],
    ["114", "Idli (2 pcs)", "இட்லி (2)", 40, "dinner", 1],

    // ☕ DRINKS & EXTRAS (Codes 200+)
    ["200", "Tea", "டீ", 15, "morning", 1],
    ["201", "Coffee", "காபி", 20, "morning", 1],
    ["202", "Black Tea", "பிளாக் டீ", 15, "morning", 1],
    ["203", "Milk", "பால்", 20, "morning", 1],
    ["204", "Badam Milk", "பாதாம் பால்", 40, "morning", 1],
    ["205", "Buttermilk", "மோர்", 20, "afternoon", 1],
    ["206", "Water Bottle 1L", "தண்ணீர் பாட்டில் 1L", 20, "afternoon", 1],
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(...item);
  });

  insertMany(defaultItems);
  console.log("🌱 50+ Menu Items Seeded with Short Codes!");
}

module.exports = { db, initDatabase };