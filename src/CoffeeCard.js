import React, { useState, useEffect } from 'react';
import './CoffeeCard.css';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function CoffeeCard() {
  const { id } = useParams(); // รับ id จาก URL parameter
  const [menuItem, setMenuItem] = useState(null); // เก็บข้อมูลเมนูใน state
  const [loading, setLoading] = useState(true); // สถานะโหลด
  const [error, setError] = useState(null); // สถานะข้อผิดพลาด

  // ดึงข้อมูลเมนูจาก API
  useEffect(() => {
    axios
      .get(`http://localhost:5000/menus/${id}`) // URL API ดึงข้อมูลเมนูเฉพาะ ID
      .then((response) => {
        console.log('Menu Data:', response.data); // Debug ข้อมูล
        setMenuItem(response.data); // ตั้งค่าข้อมูลเมนู
        setLoading(false); // เปลี่ยนสถานะโหลด
      })
      .catch((error) => {
        console.error('Error fetching menu:', error.response || error.message);
        setError('ไม่พบข้อมูลเมนูที่คุณเลือก'); // แสดงข้อความเมื่อมีข้อผิดพลาด
        setLoading(false); // เปลี่ยนสถานะโหลด
      });
  }, [id]);

  // แสดงสถานะต่าง ๆ
  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p>{error}</p>;
  if (!menuItem) return <p>ไม่พบข้อมูลเมนูที่คุณเลือก</p>;

  return (
    <div className="card">
      {/* ปุ่มย้อนกลับ */}
      <Link to="/" className="back-button">
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
        <p className="price">{menuItem.price}</p>
        <button className="add-to-cart">เพิ่มลงตะกร้า</button>
      </div>
    </div>
  );
}

export default CoffeeCard;
