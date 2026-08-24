import React, { useState, useEffect } from "react";
import { FaUtensils, FaClipboardList, FaChartBar, FaClock } from "react-icons/fa";

const Header = ({ activeTab, setActiveTab }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
      {/* Brand Name */}
      <div className="flex items-center gap-3">
        <div className="bg-amber-600 p-2 rounded-xl text-white text-xl">
          <FaUtensils />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-wide text-amber-500">
            ASHOKRAJ RESTAURANT
          </h1>
          <p className="text-xs text-slate-400">Kalayarkovil, Sivaganga</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab("pos")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
            activeTab === "pos"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-300 hover:text-white"
          }`}
        >
          <FaUtensils /> Billing (POS)
        </button>
        <button
          onClick={() => setActiveTab("menu")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
            activeTab === "menu"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-300 hover:text-white"
          }`}
        >
          <FaClipboardList /> Manage Menu
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
            activeTab === "reports"
              ? "bg-amber-600 text-white shadow"
              : "text-slate-300 hover:text-white"
          }`}
        >
          <FaChartBar /> Daily Report
        </button>
      </nav>

      {/* Live Date & Time */}
      <div className="flex items-center gap-2 text-slate-300 text-sm font-bold bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
        <FaClock className="text-amber-500" />
        <span>{time.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
        <span>•</span>
        <span>{time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
      </div>
    </header>
  );
};

export default Header;