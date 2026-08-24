import React, { useState, useEffect } from "react";
import { FaMoneyBillWave, FaQrcode, FaReceipt, FaUtensils, FaCalendarAlt } from "react-icons/fa";
import { getDailyReport } from "../services/api";

const ReportPage = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [selectedDate]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await getDailyReport(selectedDate);
      setReport(res.data);
    } catch (err) {
      console.error("Failed to load report", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-100 min-h-[calc(100vh-65px)] space-y-6">
      {/* Date Picker Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">📊 Daily Sales Report</h2>
          <p className="text-xs text-slate-500 font-bold">
            Sales overview & items sold breakdown
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
          <FaCalendarAlt className="text-amber-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent font-extrabold text-slate-800 text-sm focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-bold">Loading Report...</div>
      ) : !report ? (
        <div className="p-12 text-center text-slate-400 font-bold">No data found</div>
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Sales */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500">TOTAL SALES</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  ₹{report.summary.total_sales}
                </h3>
                <p className="text-[11px] font-bold text-slate-400 mt-1">
                  {report.summary.total_bills} bills generated
                </p>
              </div>
              <div className="bg-amber-100 text-amber-700 p-3 rounded-2xl text-2xl">
                <FaReceipt />
              </div>
            </div>

            {/* Cash Sales */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500">CASH SALES (பணம்)</p>
                <h3 className="text-2xl font-black text-emerald-600 mt-1">
                  ₹{report.summary.cash_sales}
                </h3>
              </div>
              <div className="bg-emerald-100 text-emerald-700 p-3 rounded-2xl text-2xl">
                <FaMoneyBillWave />
              </div>
            </div>

            {/* UPI Sales */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500">UPI SALES (ஜிபே)</p>
                <h3 className="text-2xl font-black text-blue-600 mt-1">
                  ₹{report.summary.upi_sales}
                </h3>
              </div>
              <div className="bg-blue-100 text-blue-700 p-3 rounded-2xl text-2xl">
                <FaQrcode />
              </div>
            </div>

            {/* Dine-In vs Parcel */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500">DINE-IN vs PARCEL</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-extrabold text-amber-800">
                    🪑 ₹{report.summary.dine_in_sales}
                  </span>
                  <span className="text-sm font-extrabold text-sky-800">
                    📦 ₹{report.summary.parcel_sales}
                  </span>
                </div>
              </div>
              <div className="bg-slate-100 text-slate-700 p-3 rounded-2xl text-2xl">
                <FaUtensils />
              </div>
            </div>
          </div>

          {/* Items Sold Breakdown Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-extrabold text-slate-800 text-base">
                🍛 Items Sold Today ({report.itemsSold.length} items)
              </h3>
            </div>

            {report.itemsSold.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-bold">
                No items sold on this date.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-200 text-xs uppercase tracking-wider">
                    <th className="p-4">Item Name</th>
                    <th className="p-4">Item Name (தமிழ்)</th>
                    <th className="p-4 text-center">Qty Sold</th>
                    <th className="p-4 text-right">Total Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium text-sm">
                  {report.itemsSold.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-bold text-slate-900">{item.item_name}</td>
                      <td className="p-4 text-slate-600 font-bold">{item.item_name_ta}</td>
                      <td className="p-4 text-center">
                        <span className="bg-slate-100 font-black px-3 py-1 rounded-lg text-slate-800">
                          {item.total_qty}
                        </span>
                      </td>
                      <td className="p-4 text-right font-black text-amber-600 text-base">
                        ₹{item.total_revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportPage;