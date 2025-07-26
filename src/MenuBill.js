import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./MenuBill.css";

const MenuBill = () => {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table") || "1";
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`🔍 กำลังโหลดใบเสร็จสำหรับโต๊ะที่ ${tableNumber}...`);

    const savedReceipt = localStorage.getItem(`receipt_table_${tableNumber}`);
    
    if (savedReceipt) {
      try {
        const parsedReceipt = JSON.parse(savedReceipt);
        console.log("📦 โหลดใบเสร็จจาก localStorage:", parsedReceipt);

        if (
          !parsedReceipt || 
          !Array.isArray(parsedReceipt.items) || 
          (typeof parsedReceipt.total_amount === "undefined" && typeof parsedReceipt.totalAmount === "undefined")
        ) {
          console.error("❌ โครงสร้างข้อมูลใบเสร็จไม่ถูกต้อง", parsedReceipt);
          setOrderDetails(null);
        } else {
          setOrderDetails(parsedReceipt);
        }
      } catch (error) {
        console.error("❌ ข้อมูลใบเสร็จเสียหาย:", error);
        setOrderDetails(null);
      }
    } else {
      setOrderDetails(null);
    }
  }, [tableNumber]);

  // 🔥 เช็กสถานะโต๊ะจาก API ถ้าเป็น "paid" ให้ลบใบเสร็จ
  useEffect(() => {
    fetch(`http://localhost:5000/api/tables/${tableNumber}`)
      .then(res => {
        if (!res.ok) throw new Error(`❌ ไม่พบโต๊ะที่ ${tableNumber}`);
        return res.json();
      })
      .then(data => {
        if (data.status === "paid") {
          console.log(`🧾 โต๊ะที่ ${tableNumber} ชำระเงินแล้ว, ซ่อนบิล...`);
          
          // ✅ ลบข้อมูลบิลจาก LocalStorage
          localStorage.removeItem(`receipt_table_${tableNumber}`);
  
          // ✅ ซ่อนบิลทั้งหมด
          setOrderDetails(null);
        }
      })
      .catch(err => console.error("❌ ไม่สามารถตรวจสอบสถานะโต๊ะ:", err.message));
  }, [tableNumber]);
  
  
  return (
    <div className="menu-bill">
      <button className="back-button" onClick={() => navigate(`/coffee-shop?table=${tableNumber}`)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <h2 className="bill-header">🧾 ใบเสร็จคำสั่งซื้อ - โต๊ะที่ {tableNumber}</h2>

      {orderDetails ? (
        <div className="bill-items">
          {Array.isArray(orderDetails.items) && orderDetails.items.length > 0 ? (
            orderDetails.items.map((item, index) => (
              <div key={index} className="bill-item">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">x {item.quantity}</span>
                <span className="item-price">{(item.price * item.quantity).toFixed(2)}฿</span>
              </div>
            ))
          ) : (
            <p>❌ ไม่มีรายการสินค้า</p>
          )}
          
          <div className="bill-total">
            <span>รวมทั้งหมด</span>
            <span>
              {orderDetails?.total_amount || orderDetails?.totalAmount 
                ? Number(orderDetails.total_amount || orderDetails.totalAmount).toFixed(2) 
                : "0.00"}฿
            </span>
          </div>

          {orderDetails?.date && (
            <p className="order-date">📅 วันที่: {new Date(orderDetails.date).toLocaleString()}</p>
          )}
        </div>
      ) : (
        <p>❌ ไม่มีคำสั่งซื้อสำหรับโต๊ะที่ {tableNumber}</p>
      )}
    </div>
  );
};

export default MenuBill;
