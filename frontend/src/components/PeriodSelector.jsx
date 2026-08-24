import React from "react";
import { FaSun, FaCloudSun, FaMoon } from "react-icons/fa";

const PeriodSelector = ({ period, setPeriod }) => {
  const periods = [
    { id: "morning", label: "Morning", ta: "காலை", icon: <FaSun />, color: "bg-amber-500" },
    { id: "afternoon", label: "Afternoon", ta: "மதியம்", icon: <FaCloudSun />, color: "bg-orange-500" },
    { id: "dinner", label: "Dinner", ta: "இரவு", icon: <FaMoon />, color: "bg-indigo-600" },
  ];

  return (
    <div className="flex items-center gap-2">
      {periods.map((p) => {
        const active = period === p.id;
        return (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition shadow-sm ${
              active
                ? `${p.color} text-white ring-2 ring-offset-1 ring-slate-400 scale-105`
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="text-lg">{p.icon}</span>
            <div className="text-left leading-tight">
              <div className="text-sm font-bold">{p.label}</div>
              <div className="text-[10px] opacity-80">{p.ta}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PeriodSelector;