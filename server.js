// 1. เรียกใช้งาน Module ที่ชื่อว่า 'http' ซึ่งเป็นระบบพื้นฐานของ Node.js สำหรับทำเซิร์ฟเวอร์
const http = require('http');

// 2. กำหนดช่องทาง (Port) ที่เซิร์ฟเวอร์จะใช้สื่อสาร โดยให้ใช้ของที่ Cloud กำหนดมา (process.env.PORT) ถ้าไม่มีให้ใช้ 3000
const port = process.env.PORT || 3000;

// 3. สร้างเครื่องแม่ข่าย (Server) ที่คอยรับคำขอ (req) และตอบกลับ (res)
const server = http.createServer((req, res) => {
  // 3.1 ตั้งรหัสสถานะ 200 หมายถึง "ทำงานสำเร็จ (OK)"
  res.statusCode = 200;
  // 3.2 บอกเบราว์เซอร์ของผู้ใช้ว่า สิ่งที่ส่งกลับไปคือไฟล์ข้อความแบบ HTML และรองรับภาษาไทย (utf-8)
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // 3.3 ส่งข้อมูลหน้าเว็บกลับไปหาผู้ใช้ (ธีมฟ้าตัดดำ + เอฟเฟกต์อาร์ตๆ)
  res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>My Web Server</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at 20% 20%, #0a0f1e, #000000 70%);
    font-family: 'Segoe UI', 'Tahoma', sans-serif;
    overflow: hidden;
    position: relative;
  }

  /* จุดแสงลอยพื้นหลังแบบอาร์ตๆ */
  .glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.5;
    animation: float 8s ease-in-out infinite;
  }
  .orb1 { width: 300px; height: 300px; background: #00d9ff; top: -50px; left: -50px; }
  .orb2 { width: 250px; height: 250px; background: #0066ff; bottom: -60px; right: -60px; animation-delay: 2s; }
  .orb3 { width: 200px; height: 200px; background: #00fff2; top: 60%; left: 70%; animation-delay: 4s; }

  @keyframes float {
    0%, 100% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(-30px) translateX(20px); }
  }

  .card {
    position: relative;
    z-index: 10;
    background: rgba(10, 20, 40, 0.55);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(0, 217, 255, 0.35);
    border-radius: 20px;
    padding: 50px 60px;
    text-align: center;
    box-shadow: 0 0 40px rgba(0, 217, 255, 0.25), 0 0 80px rgba(0, 102, 255, 0.15);
    max-width: 90%;
    animation: fadeIn 1.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  h1 {
    font-size: 1.9rem;
    background: linear-gradient(90deg, #00d9ff, #ffffff, #0066ff);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: shine 4s linear infinite;
    margin-bottom: 10px;
    letter-spacing: 0.5px;
  }

  @keyframes shine {
    to { background-position: 200% center; }
  }

  .student-id {
    display: inline-block;
    margin-top: 8px;
    padding: 4px 14px;
    border: 1px solid #00d9ff;
    border-radius: 30px;
    color: #00d9ff;
    font-size: 0.9rem;
    letter-spacing: 1px;
  }

  p.status {
    margin-top: 20px;
    color: #a0d8ff;
    font-size: 1rem;
  }

  .status::before {
    content: "● ";
    color: #00ff9d;
    animation: blink 1.5s infinite;
  }

  @keyframes blink {
    50% { opacity: 0.2; }
  }

  .footer-line {
    margin-top: 30px;
    font-size: 0.75rem;
    color: #4a6b8a;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
</style>
</head>
<body>

  <div class="glow-orb orb1"></div>
  <div class="glow-orb orb2"></div>
  <div class="glow-orb orb3"></div>

  <div class="card">
    <h1>สวัสดีครับ! นี่คือ Web Server ของ นายธีรภัทร์ มูลรัตน์</h1>
    <div class="student-id">รหัสนักศึกษา 693109010223</div>
    <p class="status">เครื่องแม่ข่ายทำงานปกติบนระบบ Railway แล้วครับผม!</p>
    <div class="footer-line">Node.js &middot; HTTP Server &middot; Deployed on Railway</div>
  </div>

</body>
</html>
  `);
});

// 4. สั่งให้เซิร์ฟเวอร์เริ่มต้นเปิดรับฟังการเชื่อมต่อตาม Port ที่กำหนดไว้
server.listen(port, () => {
  console.log(`Server is running! เครื่องแม่ข่ายเปิดทำงานแล้วที่ช่องทาง: ${port}`);
});
