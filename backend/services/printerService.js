const { ThermalPrinter, PrinterTypes } = require("node-thermal-printer");

/**
 * Print receipt on 80mm ESC/POS Thermal Printer
 * @param {Object} billData Bill object containing billNo, items, orderType, paymentMode, total, etc.
 * @param {string} printerName Windows printer name (e.g., 'POS-80', 'TVS RP 3160 GOLD')
 */
const printReceipt = async (billData, printerName = "POS-80") => {
  try {
    let printer = new ThermalPrinter({
      type: PrinterTypes.EPSON, // ESC/POS Standard protocol (Works with 99% thermal printers)
      interface: `printer:${printerName}`, // Windows USB printer name
      characterSet: "SLOVENIA",
      removeSpecialCharacters: false,
      lineCharacter: "-",
    });

    // Check printer connection (Optional safety)
    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      console.warn(`⚠️ Warning: Printer '${printerName}' not connected. Skipping physical print.`);
      return { success: false, error: "Printer not connected" };
    }

    // === HEADER ===
    printer.alignCenter();
    printer.bold(true);
    printer.setTextSize(1, 1);
    printer.println("ASHOKRAJ RESTAURANT");
    printer.bold(false);
    printer.setTextSize(0, 0);
    printer.println("Kalayarkovil, Sivaganga");
    printer.println("Ph: 9876543210");
    printer.drawLine();

    // === BILL DETAILS ===
    printer.alignLeft();
    printer.println(`Bill No : ${billData.billNo}`);
    printer.println(`Date    : ${new Date().toLocaleString("en-IN")}`);
    printer.println(`Type    : ${billData.orderType.toUpperCase()} | ${billData.period.toUpperCase()}`);
    printer.println(`Payment : ${billData.paymentMode.toUpperCase()}`);
    printer.drawLine();

    // === ITEMS TABLE ===
    // 80mm paper = 42 characters per line width
    // Item Name (20) | Qty (4) | Price (8) | Total (10)
    printer.bold(true);
    printer.println("Item                 Qty   Price     Total");
    printer.bold(false);
    printer.drawLine();

    billData.items.forEach((item) => {
      const name = (item.name || item.item_name).substring(0, 19).padEnd(20);
      const qty = String(item.qty).padStart(4);
      const price = String(item.price).padStart(8);
      const itemTotal = String(item.qty * item.price).padStart(10);

      printer.println(`${name}${qty}${price}${itemTotal}`);
    });

    printer.drawLine();

    // === TOTAL SUMMARY ===
    printer.alignRight();
    printer.bold(true);
    printer.setTextSize(1, 1);
    printer.println(`TOTAL: Rs.${billData.total}`);
    printer.setTextSize(0, 0);
    printer.bold(false);
    printer.drawLine();

    // === FOOTER ===
    printer.alignCenter();
    printer.println("Thank You! Visit Again!");
    printer.println("--------------------------------");
    printer.cut();

    // Send data to Windows Spooler
    await printer.execute();
    console.log(`✅ Bill ${billData.billNo} printed successfully!`);
    return { success: true };
  } catch (error) {
    console.error("❌ Print Failed:", error.message);
    // Graceful error handle - bill is saved in SQLite even if printer fails
    return { success: false, error: error.message };
  }
};

module.exports = { printReceipt };