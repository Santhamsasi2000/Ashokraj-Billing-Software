import React from "react";
import { FaChair, FaBox } from "react-icons/fa";

const OrderTypeSelector = ({ orderType, setOrderType }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-200 p-1 rounded-xl">
      <button
        onClick={() => setOrderType("dine-in")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${
          orderType === "dine-in"
            ? "bg-slate-900 text-white shadow"
            : "text-slate-700 hover:text-slate-900"
        }`}
      >
        <FaChair className="text-amber-400" /> Dine-In (உள்ளே)
      </button>

      <button
        onClick={() => setOrderType("parcel")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${
          orderType === "parcel"
            ? "bg-slate-900 text-white shadow"
            : "text-slate-700 hover:text-slate-900"
        }`}
      >
        <FaBox className="text-sky-400" /> Parcel (பார்சல்)
      </button>
    </div>
  );
};

export default OrderTypeSelector;