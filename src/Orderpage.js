// OrderPage.js
import React from 'react';
import './Orderpage.css';
import { Link } from 'react-router-dom';

const OrderPage = () => {
  const items = [
    { id: 1, name: 'เอสเพรสโซ่', price: 55, quantity: 1, image: 'espresso.jpg' },
    { id: 2, name: 'อเมริกาโน', price: 45, quantity: 1, image: 'americano.jpg' },
    { id: 3, name: 'ลาเต้', price: 60, quantity: 1, image: 'latte.jpg' },
  ];

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="cart">
      <h2 className="cart-header">รถเข็น</h2>
      {items.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.name} className="item-image" />
          <div className="item-details">
            <p className="item-name">{item.name}</p>
            <span className="item-price">{item.price}฿</span>
          </div>
          <div className="quantity">
            <button className="quantity-button">-</button>
            <span className="quantity-value">{item.quantity}</span>
            <button className="quantity-button">+</button>
          </div>
        </div>
      ))}
      <div className="total">
        <span>รวมทั้งหมด</span>
        <span>{totalAmount.toFixed(2)}฿</span>
      </div>
      <Link to="/coffee-shop">
        <button className="checkout-button">สั้งซื้อ</button>
      </Link>
    </div>
  );
};

export default OrderPage;
