import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaUtensils, FaSun, FaCloudSun, FaMoon } from "react-icons/fa";
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from "../services/api";

const MenuPage = () => {
  const [period, setPeriod] = useState("morning");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    name_ta: "",
    price: "",
    period: "morning",
    is_veg: 1,
  });

  useEffect(() => {
    fetchItems();
  }, [period]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getMenuItems(period);
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load menu", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      name_ta: "",
      price: "",
      period: period,
      is_veg: 1,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      name_ta: item.name_ta,
      price: item.price,
      period: item.period,
      is_veg: item.is_veg,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Please fill in item name and price!");
      return;
    }

    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, formData);
        alert("✅ Item updated successfully!");
      } else {
        await addMenuItem(formData);
        alert("✅ Item added successfully!");
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      alert("❌ Operation failed: " + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteMenuItem(id);
        fetchItems();
      } catch (err) {
        alert("❌ Failed to delete item");
      }
    }
  };

  return (
    <div className="p-6 bg-slate-100 min-h-[calc(100vh-65px)]">
      {/* Header & Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex-wrap gap-4">
        {/* Period Filter Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPeriod("morning")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${
              period === "morning"
                ? "bg-amber-500 text-white shadow"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <FaSun /> Morning (காலை)
          </button>
          <button
            onClick={() => setPeriod("afternoon")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${
              period === "afternoon"
                ? "bg-orange-500 text-white shadow"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <FaCloudSun /> Afternoon (மதியம்)
          </button>
          <button
            onClick={() => setPeriod("dinner")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${
              period === "dinner"
                ? "bg-indigo-600 text-white shadow"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <FaMoon /> Dinner (இரவு)
          </button>
        </div>

        {/* Add New Item Button */}
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl shadow transition active:scale-95 cursor-pointer"
        >
          <FaPlus /> Add New Item (புதிய உணவு)
        </button>
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-bold">Loading Menu...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-bold">
            No items in this period. Click "Add New Item" to create one.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-200 text-sm">
                <th className="p-4">Type</th>
                <th className="p-4">Item Name (English)</th>
                <th className="p-4">Item Name (தமிழ்)</th>
                <th className="p-4">Price (₹)</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium text-sm">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-md ${
                        item.is_veg === 1
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {item.is_veg === 1 ? "🟢 VEG" : "🔴 NON-VEG"}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900">{item.name}</td>
                  <td className="p-4 text-slate-600 font-bold">{item.name_ta}</td>
                  <td className="p-4 font-extrabold text-base text-slate-900">₹{item.price}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">
              {editingItem ? "✏️ Edit Item" : "➕ Add New Menu Item"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Item Name (English)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dosa"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-sm focus:outline-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Item Name (தமிழ்)
                </label>
                <input
                  type="text"
                  placeholder="e.g. தோசை"
                  value={formData.name_ta}
                  onChange={(e) => setFormData({ ...formData, name_ta: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-sm focus:outline-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="50"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-sm focus:outline-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Meal Period
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-bold text-sm bg-white focus:outline-amber-500"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Type (Veg / Non-Veg)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_veg: 1 })}
                    className={`py-2 rounded-xl font-extrabold text-sm border-2 transition ${
                      formData.is_veg === 1
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    🟢 VEG
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_veg: 0 })}
                    className={`py-2 rounded-xl font-extrabold text-sm border-2 transition ${
                      formData.is_veg === 0
                        ? "border-rose-500 bg-rose-50 text-rose-800"
                        : "border-slate-200 text-slate-500"
                    }`}
                  >
                    🔴 NON-VEG
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl text-sm"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;