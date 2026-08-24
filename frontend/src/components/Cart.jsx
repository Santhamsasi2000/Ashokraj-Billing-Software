import React from "react";
import { FaTrash, FaPlus, FaMinus, FaMoneyBillWave, FaQrcode } from "react-icons/fa";

const Cart = ({ cart, setCart, orderType, period, onCheckout, checkoutLoading }) => {
  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal;

  return (
    <div className="bg-white border-l border-slate-200 h-[calc(100vh-65px)] flex flex-col justify-between shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800">Current Order</h2>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-0.5">
            <span className="uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
              {orderType}
            </span>
            <span className="uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
              {period}
            </span>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200"
          >
            <FaTrash /> Clear
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
            <div className="text-4xl mb-2">🍛</div>
            <p className="font-bold text-sm">No Items Added</p>
            <p className="text-xs text-slate-400">Tap items on the left to add to bill</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-2">
              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
                <p className="text-xs text-slate-400">{item.name_ta} • ₹{item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => updateQty(item.id, -1)}
                  className="w-7 h-7 bg-white text-slate-700 font-bold rounded-lg flex items-center justify-center shadow-sm hover:bg-slate-200 active:scale-95 text-xs cursor-pointer"
                >
                  <FaMinus />
                </button>
                <span className="w-6 text-center font-extrabold text-sm text-slate-800">
                  {item.qty}
                </span>
                <button
                  onClick={() => updateQty(item.id, 1)}
                  className="w-7 h-7 bg-white text-slate-700 font-bold rounded-lg flex items-center justify-center shadow-sm hover:bg-slate-200 active:scale-95 text-xs cursor-pointer"
                >
                  <FaPlus />
                </button>
              </div>

              {/* Total Price */}
              <div className="text-right min-w-[60px]">
                <div className="font-extrabold text-slate-900 text-sm">
                  ₹{item.price * item.qty}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Checkout Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
        <div className="flex items-center justify-between text-2xl font-black text-slate-900 pt-1">
          <span>TOTAL</span>
          <span className="text-amber-600">₹{total}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            disabled={cart.length === 0 || checkoutLoading}
            onClick={() => onCheckout("cash")}
            className="flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow transition active:scale-95 cursor-pointer"
          >
            <FaMoneyBillWave className="text-xl" /> CASH (பணம்)
          </button>

          <button
            disabled={cart.length === 0 || checkoutLoading}
            onClick={() => onCheckout("upi")}
            className="flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow transition active:scale-95 cursor-pointer"
          >
            <FaQrcode className="text-xl" /> UPI (ஜிபே)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;