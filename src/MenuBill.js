import React from "react";
import "./MenuBill.css";
import { Link } from "react-router-dom";

const MenuBill = () => {
  const items = [
    { id: 1, name: "เอสเพรสโซ่", price: 55 },
    { id: 2, name: "อเมริกาโน", price: 45 },
    { id: 3, name: "ลาเต้", price: 60 },
  ];

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="menu-bill">
      <header className="bill-header">
        {/* เพิ่มลิงก์กลับไปยังหน้า CoffeeShop */}
        <Link to="/coffee-shop">
          <button className="back-button">{"<"}</button>
        </Link>
        <h1>บิลค่าเมนู</h1>
      </header>
      <div className="bill-items">
        {items.map((item) => (
          <div key={item.id} className="bill-item">
            <span className="item-quantity">1x</span>
            <div className="item-details">
              <p className="item-name">{item.name}</p>
              <p className="item-note">สั่งโดย: นก</p>
            </div>
            <span className="item-price">{item.price}฿</span>
          </div>
        ))}
      </div>
      <div className="bill-total">
        <span>รวม</span>
        <span>{total}฿</span>
      </div>
      {/* เพิ่มลิงก์ไปยังหน้า OrderPage */}
      <Link to="/OrderPage">
        <button className="continue-button">ดำเนินการต่อ</button>
      </Link>
    </div>
  );
};

export default MenuBill;
