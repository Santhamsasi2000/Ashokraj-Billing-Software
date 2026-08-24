import React, { useState } from "react";
import Header from "./components/Header";
import POSPage from "./pages/POSPage";
import MenuPage from "./pages/MenuPage";
import ReportPage from "./pages/ReportPage";

const App = () => {
  const [activeTab, setActiveTab] = useState("pos");

  return (
    <div className="min-h-screen bg-slate-100 font-sans select-none">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "pos" && <POSPage />}
      {activeTab === "menu" && <MenuPage />}
      {activeTab === "reports" && <ReportPage />}
    </div>
  );
};

export default App;