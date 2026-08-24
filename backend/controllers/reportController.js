const { db } = require("../config/db");

// Get Daily Sales Report
const getDailyReport = (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);

    // Sales Summary
    const summary = db.prepare(`
      SELECT 
        COUNT(*) as total_bills,
        COALESCE(SUM(total), 0) as total_sales,
        COALESCE(SUM(CASE WHEN payment_mode = 'cash' THEN total ELSE 0 END), 0) as cash_sales,
        COALESCE(SUM(CASE WHEN payment_mode = 'upi' THEN total ELSE 0 END), 0) as upi_sales,
        COALESCE(SUM(CASE WHEN order_type = 'dine-in' THEN total ELSE 0 END), 0) as dine_in_sales,
        COALESCE(SUM(CASE WHEN order_type = 'parcel' THEN total ELSE 0 END), 0) as parcel_sales
      FROM bills
      WHERE DATE(created_at) = DATE(?)
    `).get(date);

    // Items Sold Breakdown
    const itemsSold = db.prepare(`
      SELECT 
        bi.item_name,
        bi.item_name_ta,
        SUM(bi.qty) as total_qty,
        SUM(bi.total) as total_revenue
      FROM bill_items bi
      JOIN bills b ON bi.bill_id = b.id
      WHERE DATE(b.created_at) = DATE(?)
      GROUP BY bi.item_name
      ORDER BY total_qty DESC
    `).all(date);

    res.json({ date, summary, itemsSold });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDailyReport,
};