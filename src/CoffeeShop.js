import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useSearchParams, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CoffeeShop.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faShoppingCart,
    faReceipt,
    faCoffee,
    faSearch,
    faSpinner
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:5000"; // เปลี่ยนเป็น API Server

const CoffeeShop = () => {
    const [searchParams] = useSearchParams();
    const { table: pathTable } = useParams();
    const navigate = useNavigate();

    // ✅ ดึงค่าโต๊ะจาก QR Code (ล็อกค่า)
    const [selectedTable, setSelectedTable] = useState("");
    const [isValidTable, setIsValidTable] = useState(true);

    useEffect(() => {
        const tableFromURL = searchParams.get("table") || pathTable || "";
        setSelectedTable(tableFromURL);

        // ✅ ตรวจสอบว่าโต๊ะมีอยู่จริงไหม
        if (tableFromURL) {
            axios.get(`${API_URL}/api/tables`)
                .then((response) => {
                    const tableExists = response.data.some(table => table.number.toString() === tableFromURL);
                    setIsValidTable(tableExists);
                })
                .catch((error) => {
                    console.error("❌ Error fetching tables:", error);
                    setIsValidTable(false);
                });
        }
    }, [searchParams, pathTable]);

    // ✅ ดึงเมนูอาหาร
    const [menus, setMenus] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMenus = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/menu/public-menu`);
            if (response.data.success && Array.isArray(response.data.data)) {
                setMenus(response.data.data.filter(menu => menu.isAvailable === 1 || menu.isAvailable === true));
            } else {
                setMenus([]);
                setError("ไม่สามารถโหลดเมนูได้");
            }
        } catch (error) {
            setMenus([]);
            setError("เกิดข้อผิดพลาดในการโหลดเมนู");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMenus();
    }, [fetchMenus]);

    const searchedMenus = useMemo(() => {
        return menus.filter(menu => menu.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [menus, searchQuery]);

    if (loading) {
        return (
            <div className="loading-container">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>กำลังโหลดเมนู...</p>
            </div>
        );
    }

    if (!isValidTable) {
        return (
            <div className="error-container">
                <p>❌ ไม่พบหมายเลขโต๊ะนี้ในระบบ</p>
                <Link to="/" className="back-button">🔙 กลับไปหน้าแรก</Link>
            </div>
        );
    }

    return (
        <div className="coffee-shop">
            <div className="icon-group">
                <Link to={`/Orderpage?table=${selectedTable}`} className="icon-container cart-icon">
                    <FontAwesomeIcon icon={faShoppingCart} />
                </Link>
                <Link to={`/MenuBill?table=${selectedTable}`} className="icon-container receipt-icon">
                    <FontAwesomeIcon icon={faReceipt} />
                </Link>
            </div>

            <header className="header">
                <div className="header-content">
                    <h1 className="title">ร้านกาแฟ</h1>
                    <p>คุณกำลังอยู่ที่โต๊ะ: <strong>{selectedTable}</strong></p>
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
                                to={`/MenuDetails/${menu.id}?table=${selectedTable}`}
                                className="menu-item-link"
                            >
                                <div className="menu-item">
                                    {menu.image ? (
                                        <img
                                            src={`${API_URL}${menu.image}`}
                                            alt={menu.name}
                                            className="menu-item-image"
                                            loading="lazy"
                                            onError={(e) => { e.target.src = "/default-image.png"; }}
                                        />
                                    ) : (
                                        <img
                                            src="/default-image.png"
                                            alt="default"
                                            className="menu-item-image"
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
