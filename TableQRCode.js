import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const TableQRCode = () => {
  // URL สำหรับแต่ละโต๊ะ
  const table1URL = "https://your-website.com/table/1";
  const table2URL = "https://your-website.com/table/2";

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>สแกน QR Code เพื่อเข้าสู่โต๊ะ</h2>

      {/* QR Code สำหรับโต๊ะ 1 */}
      <div style={{ marginBottom: "20px" }}>
        <h3>โต๊ะที่ 1</h3>
        <QRCodeCanvas value={table1URL} size={200} />
        <p>{table1URL}</p>
      </div>

      {/* QR Code สำหรับโต๊ะ 2 */}
      <div>
        <h3>โต๊ะที่ 2</h3>
        <QRCodeCanvas value={table2URL} size={200} />
        <p>{table2URL}</p>
      </div>
    </div>
  );
};

export default TableQRCode;
