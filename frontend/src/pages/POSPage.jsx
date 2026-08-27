import React, { useState, useEffect, useRef } from "react";
import PeriodSelector from "../components/PeriodSelector";
import OrderTypeSelector from "../components/OrderTypeSelector";
import MenuGrid from "../components/MenuGrid";
import Cart from "../components/Cart";
import { getMenuItems, createBill } from "../services/api";

const POSPage = () => {
  const [period, setPeriod] = useState("morning");
  const [orderType, setOrderType] = useState("dine-in");
  
  const [menuItems, setMenuItems] = useState([]);      // Items for selected period
  const [allMenuItems, setAllMenuItems] = useState([]); // ALL items for rapid code entry
  
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // ⌨️ RAPID ENTRY STATE
  const [rapidCode, setRapidCode] = useState("");
  const inputRef = useRef(null);

  // Initialize
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) setPeriod("morning");
    else if (hour >= 11 && hour < 16) setPeriod("afternoon");
    else setPeriod("dinner");

    fetchAllItemsForRapidEntry();
  }, []);

  // Fetch only active period items for grid
  useEffect(() => { fetchGridMenu(); }, [period]);

  const fetchGridMenu = async () => {
    setLoading(true);
    const res = await getMenuItems(period);
    setMenuItems(res.data);
    setLoading(false);
  };

  const fetchAllItemsForRapidEntry = async () => {
    const res = await getMenuItems(""); // Fetch all without period filter
    setAllMenuItems(res.data);
  };

  // ⌨️ KEEP INPUT FOCUSED
  useEffect(() => {
    const keepFocus = () => inputRef.current?.focus();
    window.addEventListener("click", keepFocus);
    keepFocus();
    return () => window.removeEventListener("click", keepFocus);
  }, []);

  // ⌨️ HANDLE F9 (CASH) AND F10 (UPI)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F9") {
        e.preventDefault();
        handleCheckout("cash");
      }
      if (e.key === "F10") {
        e.preventDefault();
        handleCheckout("upi");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...item, qty: 1 }];
    });
  };

  // ⌨️ HANDLE RAPID KEYBOARD ENTRY
  const handleRapidSubmit = (e) => {
    e.preventDefault();
    if (!rapidCode.trim()) return;

    // Search globally across all items (Cashier might type Lunch code during Morning)
    const item = allMenuItems.find(i => i.short_code === rapidCode.trim());
    
    if (item) {
      addToCart(item);
    } else {
      alert(`❌ Invalid Item Code: ${rapidCode}`);
    }
    setRapidCode(""); // Clear input instantly
  };

  const handleCheckout = async (paymentMode) => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    try {
      const res = await createBill({ orderType, period, paymentMode, subtotal, total: subtotal, items: cart });
      if (res.data.success) setCart([]);
    } catch (err) {
      alert("❌ Checkout Failed: " + err.message);
    } finally {
      setCheckoutLoading(false);
      inputRef.current?.focus(); // Return focus after checkout
    }
  };

  return (
    <div className="flex h-[calc(100vh-65px)] bg-slate-100 overflow-hidden relative">
      
      {/* ⌨️ RAPID ENTRY BAR (Always active) */}
      <div className="absolute top-4 right-[420px] z-10 bg-slate-900 p-2 rounded-xl shadow-xl flex items-center gap-2 border-2 border-amber-500">
        <span className="text-amber-400 font-extrabold text-sm pl-2">CODE:</span>
        <form onSubmit={handleRapidSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={rapidCode}
            onChange={(e) => setRapidCode(e.target.value)}
            placeholder="Type Number & Enter"
            className="w-40 bg-white text-slate-900 font-black text-xl rounded-lg px-3 py-1 outline-none text-center"
          />
        </form>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden mt-14">
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
          <PeriodSelector period={period} setPeriod={setPeriod} />
          <OrderTypeSelector orderType={orderType} setOrderType={setOrderType} />
        </div>
        <div className="flex-1 overflow-hidden">
          <MenuGrid items={menuItems} addToCart={addToCart} loading={loading} />
        </div>
      </div>

      <div className="w-80 lg:w-96 2xl:w-[420px]">
        {/* ADD SHORTCUT LABELS TO CART BUTTONS */}
        <Cart cart={cart} setCart={setCart} orderType={orderType} period={period} onCheckout={handleCheckout} checkoutLoading={checkoutLoading} />
      </div>
    </div>
  );
};

export default POSPage;