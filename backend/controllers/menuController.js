const { db } = require("../config/db");

// Get menu items
const getMenuItems = (req, res) => {
  try {
    const { period } = req.query;
    let query = "SELECT * FROM menu_items WHERE is_active = 1";
    let params = [];

    if (period) {
      query += " AND period = ?";
      params.push(period);
    }

    query += " ORDER BY CAST(short_code AS INTEGER) ASC"; // Sort by Code Number
    const items = db.prepare(query).all(...params);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new menu item (ADDED short_code)
const addMenuItem = (req, res) => {
  try {
    const { short_code, name, name_ta, price, period, is_veg } = req.body;
    const stmt = db.prepare(
      "INSERT INTO menu_items (short_code, name, name_ta, price, period, is_veg) VALUES (?, ?, ?, ?, ?, ?)"
    );
    const result = stmt.run(short_code, name, name_ta, price, period, is_veg ? 1 : 0);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(400).json({ error: `Code '${req.body.short_code}' is already used!` });
    }
    res.status(500).json({ error: error.message });
  }
};

// Update menu item (ADDED short_code)
const updateMenuItem = (req, res) => {
  try {
    const { id } = req.params;
    const { short_code, name, name_ta, price, period, is_veg } = req.body;
    const stmt = db.prepare(
      "UPDATE menu_items SET short_code = ?, name = ?, name_ta = ?, price = ?, period = ?, is_veg = ? WHERE id = ?"
    );
    stmt.run(short_code, name, name_ta, price, period, is_veg ? 1 : 0, id);
    res.json({ success: true, message: "Item updated successfully" });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(400).json({ error: `Code '${req.body.short_code}' is already used!` });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete menu item
const deleteMenuItem = (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare("UPDATE menu_items SET is_active = 0 WHERE id = ?");
    stmt.run(id);
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
};