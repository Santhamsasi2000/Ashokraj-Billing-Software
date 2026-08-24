const { db } = require("../config/db");
const { printReceipt } = require("../services/printerService");

// Create new bill (Checkout & Auto Print)
const createBill = async (req, res) => {
  try {
    const { orderType, period, items, paymentMode, subtotal, total, autoPrint } = req.body;

    // Generate Bill Number: ASH-YYYYMMDD-001
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const countRow = db
      .prepare("SELECT COUNT(*) as count FROM bills WHERE created_at LIKE ?")
      .get(`${new Date().toISOString().slice(0, 10)}%`);

    const billNo = `ASH-${today}-${String(countRow.count + 1).padStart(3, "0")}`;

    // SQLite Transaction for atomic insert
    const createBillTx = db.transaction(() => {
      const billStmt = db.prepare(`
        INSERT INTO bills (bill_no, order_type, period, subtotal, total, payment_mode)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const billResult = billStmt.run(billNo, orderType, period, subtotal, total, paymentMode);
      const billId = billResult.lastInsertRowid;

      const itemStmt = db.prepare(`
        INSERT INTO bill_items (bill_id, item_name, item_name_ta, qty, price, total)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const item of items) {
        itemStmt.run(billId, item.name, item.name_ta, item.qty, item.price, item.qty * item.price);
      }

      return { billId, billNo };
    });

    const result = createBillTx();

    // Trigger Print (Optional autoPrint flag, defaults to true)
    let printStatus = { success: false };
    if (autoPrint !== false) {
      printStatus = await printReceipt({
        billNo: result.billNo,
        orderType,
        period,
        paymentMode,
        total,
        items,
      });
    }

    res.json({
      success: true,
      billId: result.billId,
      billNo: result.billNo,
      printed: printStatus.success,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bills
const getBills = (req, res) => {
  try {
    const bills = db.prepare("SELECT * FROM bills ORDER BY id DESC").all();
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBill,
  getBills,
};