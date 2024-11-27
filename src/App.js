import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoffeeShop from "./CoffeeShop";
import Orderpage from './Orderpage.js';
import MenuBill from "./MenuBill";
import CoffeeCard from './CoffeeCard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/coffee-shop" element={<CoffeeShop />} />
        <Route path="/Orderpage" element={<Orderpage />} />
        <Route path="/MenuBill" element={<MenuBill />} />
        {/* กำหนด Default Route */}
        <Route path="*" element={<CoffeeShop />} />
        <Route path="/CoffeeCard/:id" element={<CoffeeCard />} />
      </Routes>
    </Router>
  );
};

export default App;
