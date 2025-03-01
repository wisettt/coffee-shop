import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./MenuBill.css";

const MenuBill = () => {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table") || "1"; // ✅ ดึงหมายเลขโต๊ะจาก URL
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`🔍 กำลังโหลดใบเสร็จสำหรับโต๊ะที่ ${tableNumber}...`);

    // ✅ ตรวจสอบข้อมูลออเดอร์จาก localStorage ก่อน
    const localOrder = JSON.parse(localStorage.getItem(`orderDetails_table_${tableNumber}`));
    if (localOrder) {
      console.log("📦 โหลดออเดอร์จาก localStorage:", localOrder);
      setOrderDetails(localOrder);
      return; // ✅ ถ้ามีข้อมูลแล้ว ไม่ต้องโหลดจาก Backend
    }

    // ✅ โหลดออเดอร์จาก Backend ถ้าไม่มีข้อมูลใน localStorage
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:5000/orders?table=${tableNumber}`);
        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลคำสั่งซื้อได้");
        }
        const data = await response.json();

        console.log("✅ ออเดอร์ที่ได้รับจาก Backend:", data);

        if (data.length > 0) {
          setOrderDetails(data[0]); // ✅ ใช้ออเดอร์แรก
        } else {
          setOrderDetails(null);
        }
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        alert("ไม่สามารถดึงข้อมูลคำสั่งซื้อจากเซิร์ฟเวอร์");
      }
    };

    fetchOrders();
  }, [tableNumber]);

  const handleOrderReceived = async () => {
    console.log(`✅ โต๊ะที่ ${tableNumber}: รับเมนูเรียบร้อยแล้ว!`);
    
    try {
      // ส่งคำขอไปอัปเดตสถานะในฐานข้อมูล
      const response = await fetch(`http://localhost:5000/orders/${orderDetails.id}/received`, {
        method: 'POST',
      });
      if (response.ok) {
        alert(`โต๊ะที่ ${tableNumber}: รับเมนูเรียบร้อยแล้ว!`);
        // อัปเดตสถานะหลังจากรับเมนู
        setOrderDetails(prevOrder => ({
          ...prevOrder,
          status: 'received',
        }));
      } else {
        alert('❌ ไม่สามารถอัปเดตสถานะการรับเมนู');
      }
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      alert("ไม่สามารถอัปเดตสถานะการรับเมนู");
    }
  };

  return (
    <div className="menu-bill">
      {/* ปุ่มย้อนกลับ */}
      <button className="back-button" onClick={() => navigate(`/coffee-shop?table=${tableNumber}`)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <h2 className="bill-header">🧾 ใบเสร็จคำสั่งซื้อ - โต๊ะที่ {tableNumber}</h2>

      {orderDetails ? (
        <div className="bill-items">
          {orderDetails.items.map((item, index) => (
            <div key={index} className="bill-item">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">x {item.quantity}</span>
              <span className="item-price">{(item.price * item.quantity).toFixed(2)}฿</span>
            </div>
          ))}
          <div className="bill-total">
            <span>รวมทั้งหมด</span>
            <span>{orderDetails.totalAmount.toFixed(2)}฿</span>
          </div>
          <p className="order-date">📅 วันที่: {new Date(orderDetails.date).toLocaleString()}</p>
        </div>
      ) : (
        <p>❌ ไม่มีคำสั่งซื้อสำหรับโต๊ะที่ {tableNumber}</p>
      )}

      {/* ปุ่มสำหรับการจัดการ */}
      {orderDetails?.items.length > 0 && (
        <div className="button-group">
          <button className="action-button" onClick={handleOrderReceived}>
            ✅ รับเมนูแล้ว
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuBill;
