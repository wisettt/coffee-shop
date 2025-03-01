import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import axios from "axios";
import "./CoffeeShop.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faReceipt, faCoffee, faSearch } from "@fortawesome/free-solid-svg-icons";

const CoffeeShop = () => {
    const [searchParams] = useSearchParams();
    const { table: pathTable } = useParams(); // ✅ รองรับ Path Parameters `/coffee-shop/2`
    
    // ✅ เลือกหมายเลขโต๊ะจาก Query Parameter หรือ Path Parameter
    const tableNumber = searchParams.get("table") || pathTable || "1"; 

    const [menus, setMenus] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await axios.get("http://localhost:5000/menu");
                console.log("🔹 API Response:", response.data);

                if (Array.isArray(response.data)) {
                    // ✅ กรองเมนูที่พร้อมขายเท่านั้น
                    const availableMenus = response.data.filter(menu => menu.isAvailable === 1);
                    setMenus(availableMenus);
                } else if (response.data.success && Array.isArray(response.data.data)) {
                    // ✅ กรองเมนูที่พร้อมขายเท่านั้น
                    const availableMenus = response.data.data.filter(menu => menu.isAvailable === 1);
                    setMenus(availableMenus);
                } else {
                    console.error("❌ Error: API response is not an array", response.data);
                    setMenus([]);
                    setError("ไม่สามารถโหลดเมนูได้");
                }
            } catch (error) {
                console.error("❌ Error fetching menus:", error);
                setMenus([]);
                setError("เกิดข้อผิดพลาดในการโหลดเมนู");
            } finally {
                setLoading(false);
            }
        };
        fetchMenus();
    }, []);

    // ✅ ค้นหาจาก search bar
    const searchedMenus = menus.filter((menu) =>
        menu.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>กำลังโหลดเมนู...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>❌ {error}</p>
            </div>
        );
    }

    return (
        <div className="coffee-shop">
            <div className="icon-group">
                <Link to={`/Orderpage?table=${tableNumber}`} className="icon-container cart-icon">
                    <FontAwesomeIcon icon={faShoppingCart} />
                </Link>
                <Link to={`/MenuBill?table=${tableNumber}`} className="icon-container receipt-icon">
                    <FontAwesomeIcon icon={faReceipt} />
                </Link>
            </div>

            <header className="header">
                <div className="header-content">
                    <h1 className="title">ร้านกาแฟ</h1>
                    <p>คุณกำลังอยู่ที่โต๊ะ: <strong>{tableNumber}</strong></p>
                </div>
            </header>

            <div className="search-bar">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input
                    type="text"
                    className="form-control"
                    placeholder="ค้นหาเมนู..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="menu">
                <h2 className="menu-title">
                    <FontAwesomeIcon icon={faCoffee} className="coffee-icon" />
                    เมนูทั้งหมด
                </h2>

                <div className="menu-items">
                    {searchedMenus.length > 0 ? (
                        searchedMenus.map((menu) => (
                            <Link
                                key={menu.id}
                                to={`/MenuDetails/${menu.id}?table=${tableNumber}`}
                                className="menu-item-link"
                            >
                                <div className="menu-item">
                                    {menu.image && (
                                        <img
                                            src={`http://localhost:5000${menu.image}`}
                                            alt={menu.name}
                                            className="menu-item-image"
                                            loading="lazy"
                                        />
                                    )}
                                    <div className="menu-item-details">
                                        <p className="menu-item-name">{menu.name}</p>
                                        <p className="menu-item-price">{menu.price} บาท</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>ไม่มีเมนูที่ตรงกับคำค้นหา</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoffeeShop;
