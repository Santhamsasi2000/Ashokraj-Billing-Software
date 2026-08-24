const { db } = require("../config/db");

// Get menu items (filtered by period optional)
const getMenuItems = (req, res) => {
  try {
    const { period } = req.query;
    let query = "SELECT * FROM menu_items WHERE is_active = 1";
    let params = [];

    if (period) {
      query += " AND period = ?";
      params.push(period);
    }

    query += " ORDER BY id ASC";
    const items = db.prepare(query).all(...params);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new menu item
const addMenuItem = (req, res) => {
  try {
    const { name, name_ta, price, period, is_veg } = req.body;
    const stmt = db.prepare(
      "INSERT INTO menu_items (name, name_ta, price, period, is_veg) VALUES (?, ?, ?, ?, ?)"
    );
    const result = stmt.run(name, name_ta, price, period, is_veg ? 1 : 0);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update menu item
const updateMenuItem = (req, res) => {
  try {
    const { id } = req.params;
    const { name, name_ta, price, period, is_veg } = req.body;
    const stmt = db.prepare(
      "UPDATE menu_items SET name = ?, name_ta = ?, price = ?, period = ?, is_veg = ? WHERE id = ?"
    );
    stmt.run(name, name_ta, price, period, is_veg ? 1 : 0, id);
    res.json({ success: true, message: "Item updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete (soft delete) menu item
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