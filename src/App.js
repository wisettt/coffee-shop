import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoffeeShop from "./CoffeeShop"; // หน้า CoffeeShop
import Orderpage from "./Orderpage"; // หน้า Order Page
import MenuBill from "./MenuBill"; // หน้า Menu Bill
import CoffeeCard from "./CoffeeCard"; // หน้า Coffee Card
import MenuDetails from "./MenuDetails"; // หน้า Menu Details
import RedirectToShop from "./RedirectToShop"; // เพิ่มหน้า Redirect เมื่อสแกน QR Code

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ หน้า RedirectToShop รองรับ table parameter */}
        <Route path="/" element={<RedirectToShop />} />

        {/* ✅ Route สำหรับ CoffeeShop รองรับโต๊ะ */}
        <Route path="/coffee-shop/:table?" element={<CoffeeShop />} />

        {/* ✅ Route สำหรับ Order Page */}
        <Route path="/Orderpage" element={<Orderpage />} />

        {/* ✅ Route สำหรับ Menu Bill */}
        <Route path="/MenuBill" element={<MenuBill />} />

        {/* ✅ Route สำหรับ Coffee Card */}
        <Route path="/CoffeeCard/:id" element={<CoffeeCard />} />

        {/* ✅ Route สำหรับ Menu Details */}
        <Route path="/MenuDetails/:id" element={<MenuDetails />} />

        {/* ✅ Default Route (กรณีใส่ URL ผิด) */}
        <Route path="*" element={<CoffeeShop />} />
      </Routes>
    </Router>
  );
};

export default App;
