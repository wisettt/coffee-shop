import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./MenuDetails.css";

const API_URL = "http://localhost:5000"; // ✅ ใช้เป็นตัวแปรหลัก

const MenuDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table") || "1"; // ✅ ดึงค่าหมายเลขโต๊ะจาก URL
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuDetails = async () => {
      try {
        console.log("🌐 Fetching all menus from:", `${API_URL}/api/menu/public-menu`);
        const response = await axios.get(`${API_URL}/api/menu/public-menu`);
        
        if (response.data.success && Array.isArray(response.data.data)) {
          // ✅ ค้นหาเมนูที่ตรงกับ ID ที่ต้องการ
          const selectedMenu = response.data.data.find((item) => item.id === parseInt(id));
          
          if (selectedMenu) {
            setMenu(selectedMenu);
          } else {
            setError("ไม่พบข้อมูลเมนู");
          }
        } else {
          setError("ไม่สามารถโหลดข้อมูลเมนูได้");
        }
      } catch (error) {
        console.error("❌ Error fetching menus:", error.response ? error.response.data : error.message);
        setError("เกิดข้อผิดพลาดในการโหลดเมนู");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuDetails();
  }, [id]);

  const addToCart = () => {
    if (!menu) return;

    const cart = JSON.parse(localStorage.getItem(`cart_table_${tableNumber}`)) || [];
    console.log(`🛒 กำลังเพิ่มสินค้าในโต๊ะ ${tableNumber}, ตะกร้าปัจจุบัน:`, cart);

    const existingItemIndex = cart.findIndex((item) => item.id === menu.id);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ ...menu, quantity: 1 });
    }

    localStorage.setItem(`cart_table_${tableNumber}`, JSON.stringify(cart)); // ✅ แยกตะกร้าของแต่ละโต๊ะ
    alert(`เพิ่มเมนูลงตะกร้าของโต๊ะที่ ${tableNumber} แล้ว!`);
  };

  if (loading) return <div className="menu-details-loading">กำลังโหลด...</div>;
  if (error) return <div className="menu-details-error">{error}</div>;

  return (
    <div className="menu-details">
      {/* ✅ ปุ่มไปตะกร้า ส่งค่าหมายเลขโต๊ะไป OrderPage */}
      <div className="icon-group">
        <Link to={`/Orderpage?table=${tableNumber}`} className="icon-container">
          <FontAwesomeIcon icon={faShoppingCart} />
        </Link>
      </div>

      <header className="menu-details-header">
        {/* ✅ ปุ่มย้อนกลับไปยัง CoffeeShop พร้อมค่าหมายเลขโต๊ะ */}
        <Link to={`/coffee-shop?table=${tableNumber}`} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <h1>{menu.name}</h1>
      </header>

      <div className="menu-details-content">
        {menu.image && (
          <img
            src={`${API_URL}${menu.image}`}
            alt={menu.name}
            className="menu-details-image"
          />
        )}
        <div className="menu-details-info">
          <p>
            <strong>ชื่อเมนู:</strong> {menu.name}
          </p>
          <p>
            <strong>ราคา:</strong> {menu.price} บาท
          </p>
          <p>
            <strong>รายละเอียด:</strong> {menu.details}
          </p>
        </div>
        <button className="add-to-cart-button" onClick={addToCart}>
          เพิ่มลงตะกร้า
        </button>
      </div>
    </div>
  );
};

export default MenuDetails;
