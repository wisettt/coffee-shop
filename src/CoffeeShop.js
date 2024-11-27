import React, { useEffect, useState } from 'react';
import './CoffeeShop.css';
import { Link } from "react-router-dom";
import axios from 'axios';  // ใช้ axios ในการดึงข้อมูล

const CoffeeShop = () => {
  const [menus, setMenus] = useState([]);
  const boxCount = 10;  // กำหนดจำนวนเมนูที่จะโชว์

  // ดึงข้อมูลเมนูจาก API
  useEffect(() => {
    axios.get('http://localhost:5000/menus')  // URL ของ API ที่ดึงข้อมูลเมนู
      .then(response => {
        setMenus(response.data);  // ตั้งค่าข้อมูลเมนูที่ดึงมา
      })
      .catch(error => {
        console.error('Error fetching menus:', error);
      });
  }, []);

  return (
    <div className="coffeeShop">
      {/* ครอบวงกลมด้วย Link */}
      <Link to="/OrderPage">
        <div className="circle1"></div>
      </Link>
      <Link to="/MenuBill">
        <div className="circle2"></div>
      </Link>

      <header className="header">
        <h1 className="title">วิเศษ หล่อ</h1>
      </header>

      <div className="orderSummary">
        <div className="orderInfo">
          โต๊ะที่
          <i className="fa fa-angle-down arrowIcon"></i>
        </div>

        <div className="orderIcons">
          <Link to="/OrderPage">
            <i className="fa fa-shopping-cart orderIcon"></i>
          </Link>
          <i className="fa fa-receipt orderIcon"></i>
        </div>
      </div>

      <div className="menu">
        <h2 className="menuTitle">เมนูแนะนำ</h2>
        <div className="menuItems">
          <div className="boxContainer">
            {menus.slice(0, boxCount).map((menu) => (
              <Link key={menu.id} to={`/CoffeeCard/${menu.id}`}>
                <div className="menu-item">
                  {menu.image && (
                    <img src={`http://localhost:5000${menu.image}`} alt={menu.name} className="menu-item-image" />
                  )}
                  <div className="menu-item-details">
                    <p className="menu-item-name">{menu.name}</p>
                    <p className="menu-item-price">{`฿${menu.price.toFixed(2)}`}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeShop;
