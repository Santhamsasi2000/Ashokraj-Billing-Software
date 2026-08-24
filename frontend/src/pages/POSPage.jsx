import React, { useState, useEffect } from "react";
import PeriodSelector from "../components/PeriodSelector";
import OrderTypeSelector from "../components/OrderTypeSelector";
import MenuGrid from "../components/MenuGrid";
import Cart from "../components/Cart";
import { getMenuItems, createBill } from "../services/api";

const POSPage = () => {
  const [period, setPeriod] = useState("morning");
  const [orderType, setOrderType] = useState("dine-in");
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Auto-detect current period based on system time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) setPeriod("morning");
    else if (hour >= 11 && hour < 16) setPeriod("afternoon");
    else setPeriod("dinner");
  }, []);

  // Fetch menu when period changes
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
    };

    try {
      const res = await createBill(billData);
      if (res.data.success) {
        alert(`✅ Bill Created: ${res.data.billNo}`);
        setCart([]);
      }
    } catch (err) {
      alert("❌ Checkout Failed: " + err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-65px)] bg-slate-100 overflow-hidden">
      {/* Left Main Area */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
        {/* Top Selectors Bar */}
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex-wrap gap-2">
          <PeriodSelector period={period} setPeriod={setPeriod} />
          <OrderTypeSelector orderType={orderType} setOrderType={setOrderType} />
        </div>

        {/* Menu Items Grid */}
        <div className="flex-1 overflow-hidden">
          <MenuGrid items={menuItems} addToCart={addToCart} loading={loading} />
        </div>
      </div>

      {/* Right Cart Sidebar */}
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
    </div>
  );
};

export default POSPage;