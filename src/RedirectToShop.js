import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RedirectToShop = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // ✅ ดึงค่าพารามิเตอร์ table จาก URL
        const params = new URLSearchParams(location.search);
        const table = params.get("table");

        console.log("🔹 Current URL:", location.pathname + location.search);
        console.log("🔹 Table parameter from URL:", table);

        if (table) {
            console.log("✅ Redirecting to:", `/coffee-shop/${table}`);
            navigate(`/coffee-shop/${table}`, { replace: true });
        } else {
            console.log("✅ Redirecting to: /coffee-shop");
            navigate("/coffee-shop", { replace: true });
        }
    }, [location.search, navigate]); // ✅ แก้ให้ useEffect ทำงานทุกครั้งที่ search parameter เปลี่ยน

    return <p>กำลังนำทางไปที่ร้าน...</p>;
};

export default RedirectToShop;
