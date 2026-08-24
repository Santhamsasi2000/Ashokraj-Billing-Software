import React, { useState, useEffect } from "react";
import PeriodSelector from "../components/PeriodSelector";
import OrderTypeSelector from "../components/OrderTypeSelector";
import MenuGrid from "../components/MenuGrid";
import Cart from "../components/Cart";
import { getMenuItems, createBill } from "../services/api";
import { FaPrint, FaTimes } from "react-icons/fa";

const POSPage = () => {
  const [period, setPeriod] = useState("morning");
  const [orderType, setOrderType] = useState("dine-in");
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Print Receipt Modal State
  const [printedBill, setPrintedBill] = useState(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) setPeriod("morning");
    else if (hour >= 11 && hour < 16) setPeriod("afternoon");
    else setPeriod("dinner");
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [period]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await getMenuItems(period);
      setMenuItems(res.data);
    } catch (err) {
      console.error("Failed to load menu", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleCheckout = async (paymentMode) => {
    if (cart.length === 0) return;

    setCheckoutLoading(true);
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    const billData = {
      orderType,
      period,
      paymentMode,
      subtotal,
      total: subtotal,
      items: cart,
      autoPrint: false, // Don't trigger thermal printer on backend for HP test
    };

    try {
      const res = await createBill(billData);
      if (res.data.success) {
        // Prepare bill data for HP print popup
        const completedBill = {
          billNo: res.data.billNo,
          orderType,
          period,
          paymentMode,
          subtotal,
          total: subtotal,
          items: cart,
          date: new Date().toLocaleString("en-IN"),
        };

        setPrintedBill(completedBill);
        setCart([]); // Clear cart
      }
    } catch (err) {
      alert("❌ Checkout Failed: " + err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Trigger Windows Print Dialog (HP Printer)
  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="flex h-[calc(100vh-65px)] bg-slate-100 overflow-hidden">
      {/* Left Area */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex-wrap gap-2">
          <PeriodSelector period={period} setPeriod={setPeriod} />
          <OrderTypeSelector orderType={orderType} setOrderType={setOrderType} />
        </div>

        <div className="flex-1 overflow-hidden">
          <MenuGrid items={menuItems} addToCart={addToCart} loading={loading} />
        </div>
      </div>

      {/* Right Cart */}
      <div className="w-80 lg:w-96 2xl:w-[420px]">
        <Cart
          cart={cart}
          setCart={setCart}
          orderType={orderType}
          period={period}
          onCheckout={handleCheckout}
          checkoutLoading={checkoutLoading}
        />
      </div>

      {/* ========================================== */}
      {/* 🧾 RECEIPT POPUP MODAL (For HP Printer)   */}
      {/* ========================================== */}
      {printedBill && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col items-center space-y-4">
            <h3 className="font-extrabold text-emerald-600 text-lg">
              ✅ Bill Created Successfully!
            </h3>

            {/* Printable Area (Simulates Receipt) */}
            <div
              id="printable-receipt"
              className="border border-slate-300 p-4 rounded-xl w-full bg-slate-50 font-mono text-xs space-y-2 text-slate-800"
            >
              <div className="text-center font-bold text-sm">
                ASHOKRAJ RESTAURANT
              </div>
              <div className="text-center text-[10px] text-slate-500">
                Kalayarkovil, Sivaganga • Ph: 9876543210
              </div>
              <div className="border-b border-dashed border-slate-400 my-2"></div>

              <div>Bill No: {printedBill.billNo}</div>
              <div>Date : {printedBill.date}</div>
              <div>
                Type : {printedBill.orderType.toUpperCase()} | {printedBill.paymentMode.toUpperCase()}
              </div>
              <div className="border-b border-dashed border-slate-400 my-2"></div>

              {/* Items List */}
              <div className="space-y-1">
                {printedBill.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {item.name} x{item.qty}
                    </span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="border-b border-dashed border-slate-400 my-2"></div>
              <div className="flex justify-between font-bold text-sm">
                <span>TOTAL:</span>
                <span>₹{printedBill.total}</span>
              </div>
              <div className="border-b border-dashed border-slate-400 my-2"></div>

              <div className="text-center text-[10px]">
                நன்றி! மீண்டும் வருக!
                <br />
                Thank You! Visit Again!
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full pt-2">
              <button
                onClick={triggerPrint}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaPrint /> PRINT ON HP
              </button>
              <button
                onClick={() => setPrintedBill(null)}
                className="py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSPage;