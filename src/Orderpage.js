import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Orderpage.css";

const OrderPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table") || "1"; 

  const [items, setItems] = useState([]);

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem(`cart_table_${tableNumber}`)) || [];
    setItems(cartData);
  }, [tableNumber]);

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const updateQuantity = (id, action) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        if (action === "increase") {
          return { ...item, quantity: item.quantity + 1 };
        } else if (action === "decrease" && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
      }
      return item;
    });

    setItems(updatedItems);
    localStorage.setItem(`cart_table_${tableNumber}`, JSON.stringify(updatedItems));
  };

  const removeItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem(`cart_table_${tableNumber}`, JSON.stringify(updatedItems));
  };

  const handleCheckout = async () => {
    try {
      const orderDetails = {
        table: tableNumber,
        items: items,
        totalAmount: totalAmount,
        date: new Date().toISOString(),
      };

      console.log("✅ ออเดอร์ที่ส่งไปยัง Backend:", orderDetails);

      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });

      const data = await response.json();
      console.log("✅ คำตอบจาก Backend:", data);

      if (data.message && data.message.includes("บันทึกออเดอร์โต๊ะที่")) {
        localStorage.setItem(`orderDetails_table_${tableNumber}`, JSON.stringify(orderDetails));
        localStorage.removeItem(`cart_table_${tableNumber}`);
        setItems([]);
        navigate(`/MenuBill?table=${tableNumber}`);
      } else {
        alert("❌ ไม่สามารถส่งออเดอร์ได้");
      }
    } catch (error) {
      console.error("❌ Error sending order to database:", error);
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="cart">
      <h2 className="cart-header">🚀 รถเข็น โต๊ะที่: {tableNumber}</h2>

      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              src={`http://localhost:5000${item.image}`}
              alt={item.name}
              className="item-image"
            />
            <div className="item-details">
              <p className="item-name">{item.name}</p>
              <span className="item-price">{item.price}฿</span>
            </div>
            <div className="quantity">
              <button
                className="quantity-button"
                onClick={() => updateQuantity(item.id, "decrease")}
              >
                -
              </button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                className="quantity-input"
              />
              <button
                className="quantity-button"
                onClick={() => updateQuantity(item.id, "increase")}
              >
                +
              </button>
            </div>
            <button className="remove-button" onClick={() => removeItem(item.id)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        ))
      ) : (
        <p>🛒 ตะกร้าว่างเปล่า</p>
      )}

      <div className="total">
        <span>รวมทั้งหมด</span>
        <span>{totalAmount.toFixed(2)}฿</span>
      </div>

      <button className="checkout-button" onClick={handleCheckout} disabled={items.length === 0}>
        {items.length === 0 ? "ไม่มีสินค้าในตะกร้า" : "สั่งซื้อ"}
      </button>
    </div>
  );
};

export default OrderPage;
