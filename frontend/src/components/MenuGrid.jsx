import React from "react";

const MenuGrid = ({ items, addToCart, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 font-bold">
        Loading Menu Items...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 font-bold">
        No Menu Items Found for this period.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3 overflow-y-auto max-h-[calc(100vh-170px)] p-1">
      {items.map((item) => {
        const isVeg = item.is_veg === 1;

        return (
          <button
            key={item.id}
            onClick={() => addToCart(item)}
            className={`p-4 bg-white border-2 rounded-2xl shadow-sm hover:shadow-md transition active:scale-95 text-left flex flex-col justify-between h-32 cursor-pointer ${
              isVeg
                ? "border-emerald-500 hover:bg-emerald-50/50"
                : "border-rose-500 hover:bg-rose-50/50"
            }`}
          >
            {/* Top row: Badge & Price */}
            <div className="flex items-center justify-between w-full">
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                  isVeg ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                }`}
              >
                {isVeg ? "🟢 VEG" : "🔴 NON-VEG"}
              </span>
              <span className="text-xl font-extrabold text-slate-900">₹{item.price}</span>
            </div>

            {/* Bottom row: Item Name */}
            <div>
              <h3 className="text-base font-bold text-slate-800 line-clamp-1 leading-tight">
                {item.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">{item.name_ta}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MenuGrid;