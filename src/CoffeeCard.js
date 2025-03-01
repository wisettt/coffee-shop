import React, { useState, useEffect } from 'react';
import './CoffeeCard.css';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function CoffeeCard() {
  const { id } = useParams(); // รับ id จาก URL parameter
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table") || "1"; // ✅ ดึงหมายเลขโต๊ะจาก URL
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/menus/${id}`) // ดึงข้อมูลเมนูเฉพาะ ID
      .then((response) => {
        setMenuItem(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('ไม่พบข้อมูลเมนูที่คุณเลือก');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p>{error}</p>;
  if (!menuItem) return <p>ไม่พบข้อมูลเมนูที่คุณเลือก</p>;

  // ✅ ฟังก์ชันเพิ่มเมนูลงตะกร้าแยกโต๊ะ
  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem(`cart_table_${tableNumber}`)) || [];
    const existingItemIndex = cart.findIndex(item => item.id === menuItem.id);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ ...menuItem, quantity: 1 });
    }

    localStorage.setItem(`cart_table_${tableNumber}`, JSON.stringify(cart)); // ✅ บันทึกตะกร้าของโต๊ะนั้นๆ
    alert(`เพิ่มเมนูลงตะกร้าของโต๊ะที่ ${tableNumber} แล้ว!`);
  };

  return (
    <div className="card">
      {/* ปุ่มย้อนกลับ (กลับไป CoffeeShop พร้อมหมายเลขโต๊ะ) */}
      <Link to={`/coffee-shop?table=${tableNumber}`} className="back-button">
        ย้อนกลับ
      </Link>

      <div className="image-container">
        <img
          src={`http://localhost:5000${menuItem.imageUrl}`} // URL รูปภาพ
          alt={menuItem.name}
          className="coffee-image"
        />
      </div>
      <div className="details">
        <h3 className="coffee-name">{menuItem.name}</h3>
        <p className="price">{menuItem.price} บาท</p>
        <button className="add-to-cart" onClick={addToCart}>เพิ่มลงตะกร้า</button>
      </div>

      {/* ไอคอน */}
      <div className="icon-group">
        {/* ไปที่หน้าหลักของโต๊ะนั้นๆ */}
        <Link to={`/coffee-shop?table=${tableNumber}`} className="icon-container">
          <i className="fa fa-home" />
        </Link>

        {/* ไปที่ตะกร้าของโต๊ะนั้นๆ */}
        <Link to={`/Orderpage?table=${tableNumber}`} className="icon-container">
          <i className="fa fa-shopping-cart" />
        </Link>
      </div>
    </div>
  );
}

export default CoffeeCard;
