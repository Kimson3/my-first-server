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

  // 3.3 ส่งข้อมูลหน้าเว็บกลับไปหาผู้ใช้ (โทนขาว-ฟ้า-ดำ สไตล์อาร์ต)
  res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ธีรภัทร์ มูลรัตน์ | Profile</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  @font-face {
    font-family: 'system';
  }

  body {
    min-height: 100vh;
    background:
      radial-gradient(circle at 15% 10%, rgba(120, 190, 255, 0.15), transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(255,255,255,0.08), transparent 35%),
      linear-gradient(160deg, #06090f 0%, #0d1420 45%, #050709 100%);
    font-family: 'Segoe UI', 'Tahoma', 'Sarabun', sans-serif;
    color: #eaf4ff;
    padding: 60px 20px;
    position: relative;
    overflow-x: hidden;
  }

  /* เส้นลายกราฟิกประดับพื้นหลัง แบบลายเส้นศิลปะ */
  .deco-line {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .deco-line.one {
    width: 500px; height: 500px;
    border: 1px solid rgba(120,190,255,0.15);
    top: -150px; left: -180px;
  }
  .deco-line.two {
    width: 700px; height: 700px;
    border: 1px solid rgba(255,255,255,0.06);
    bottom: -300px; right: -250px;
  }
  .deco-dot {
    position: fixed;
    width: 6px; height: 6px;
    background: #7fc8ff;
    border-radius: 50%;
    box-shadow: 0 0 12px 3px rgba(127,200,255,0.6);
    z-index: 0;
  }
  .d1 { top: 12%; left: 8%; }
  .d2 { top: 70%; left: 92%; }
  .d3 { top: 85%; left: 15%; }
  .d4 { top: 20%; left: 88%; }

  .wrap {
    position: relative;
    z-index: 2;
    max-width: 760px;
    margin: 0 auto;
  }

  /* ส่วนหัว */
  .hero {
    text-align: center;
    padding-bottom: 40px;
    border-bottom: 1px solid rgba(120,190,255,0.25);
    margin-bottom: 40px;
    animation: fadeDown 1s ease;
  }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .avatar-ring {
    width: 120px; height: 120px;
    margin: 0 auto 22px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, rgba(127,200,255,0.15), rgba(255,255,255,0.05));
    border: 1.5px solid rgba(127,200,255,0.5);
    box-shadow: 0 0 30px rgba(127,200,255,0.25), inset 0 0 20px rgba(127,200,255,0.1);
    font-size: 2.4rem;
    font-weight: 700;
    color: #cfeaff;
  }

  .hero h1 {
    font-size: 2rem;
    letter-spacing: 1px;
    background: linear-gradient(90deg, #ffffff, #9fd8ff, #ffffff);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: shine 6s linear infinite;
  }

  @keyframes shine { to { background-position: 200% center; } }

  .hero .nickname {
    margin-top: 8px;
    color: #7fc8ff;
    font-size: 1rem;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .hero .tagline {
    margin-top: 16px;
    color: #9db6ce;
    font-size: 0.85rem;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    padding: 6px 16px;
    border: 1px solid rgba(127,200,255,0.4);
    border-radius: 30px;
    font-size: 0.8rem;
    color: #bfe4ff;
    background: rgba(127,200,255,0.06);
  }
  .status-badge .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #6dffb0;
    box-shadow: 0 0 8px #6dffb0;
    animation: blink 1.6s infinite;
  }
  @keyframes blink { 50% { opacity: 0.25; } }

  /* การ์ดข้อมูล */
  .section-title {
    font-size: 0.78rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #7fc8ff;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .section-title::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(127,200,255,0.4), transparent);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin-bottom: 44px;
  }

  .info-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(127,200,255,0.18);
    border-radius: 14px;
    padding: 16px 18px;
    backdrop-filter: blur(10px);
    transition: transform 0.25s ease, border-color 0.25s ease;
  }
  .info-card:hover {
    transform: translateY(-3px);
    border-color: rgba(127,200,255,0.5);
  }
  .info-card .label {
    font-size: 0.7rem;
    color: #7fa8c9;
    letter-spacing: 1px;
    margin-bottom: 6px;
    text-transform: uppercase;
  }
  .info-card .value {
    font-size: 0.98rem;
    color: #f2f8ff;
    font-weight: 500;
  }

  .full { grid-column: 1 / -1; }

  /* งานอดิเรก แบบ tag */
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .tag {
    padding: 8px 16px;
    border-radius: 30px;
    background: linear-gradient(135deg, rgba(127,200,255,0.12), rgba(255,255,255,0.03));
    border: 1px solid rgba(127,200,255,0.3);
    font-size: 0.85rem;
    color: #dff0ff;
  }

  /* Timeline การศึกษา */
  .timeline {
    position: relative;
    padding-left: 26px;
  }
  .timeline::before {
    content: "";
    position: absolute;
    left: 6px; top: 4px; bottom: 4px;
    width: 1px;
    background: linear-gradient(180deg, #7fc8ff, transparent);
  }
  .t-item {
    position: relative;
    margin-bottom: 22px;
  }
  .t-item:last-child { margin-bottom: 0; }
  .t-item::before {
    content: "";
    position: absolute;
    left: -26px; top: 4px;
    width: 11px; height: 11px;
    border-radius: 50%;
    background: #0d1420;
    border: 2px solid #7fc8ff;
    box-shadow: 0 0 10px rgba(127,200,255,0.5);
  }
  .t-item .t-level {
    font-size: 0.72rem;
    color: #7fc8ff;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .t-item .t-place {
    font-size: 1rem;
    color: #f2f8ff;
  }

  footer {
    text-align: center;
    margin-top: 50px;
    padding-top: 24px;
    border-top: 1px solid rgba(127,200,255,0.15);
    font-size: 0.72rem;
    color: #5a7896;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  @media (max-width: 560px) {
    .grid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>

  <div class="deco-line one"></div>
  <div class="deco-line two"></div>
  <div class="deco-dot d1"></div>
  <div class="deco-dot d2"></div>
  <div class="deco-dot d3"></div>
  <div class="deco-dot d4"></div>

  <div class="wrap">

    <div class="hero">
      <div class="avatar-ring">ธ</div>
      <h1>ธีรภัทร์ มูลรัตน์</h1>
      <div class="nickname">คิม</div>
      <p class="tagline">Node.js &middot; HTTP Server &middot; Deployed on Railway</p>
      <div class="status-badge"><span class="dot"></span> เครื่องแม่ข่ายทำงานปกติแล้วครับผม</div>
    </div>

    <div class="section-title">ข้อมูลส่วนตัว</div>
    <div class="grid">
      <div class="info-card">
        <div class="label">ชื่อเล่น</div>
        <div class="value">คิม</div>
      </div>
      <div class="info-card">
        <div class="label">วัน-เดือน-ปีเกิด</div>
        <div class="value">26 ตุลาคม</div>
      </div>
      <div class="info-card">
        <div class="label">อายุ</div>
        <div class="value">19 ปี</div>
      </div>
      <div class="info-card">
        <div class="label">สัญชาติ / เชื้อชาติ</div>
        <div class="value">ไทย / ไทย</div>
      </div>
      <div class="info-card full">
        <div class="label">รหัสนักศึกษา</div>
        <div class="value">693109010223</div>
      </div>
    </div>

    <div class="section-title">งานอดิเรก</div>
    <div class="grid">
      <div class="info-card full">
        <div class="tags">
          <span class="tag">🎬 ดูหนัง</span>
          <span class="tag">🐔 เลี้ยงไก่</span>
          <span class="tag">🎮 เล่นเกม</span>
          <span class="tag">🎧 ฟังเพลง</span>
        </div>
      </div>
    </div>

    <div class="section-title">ประวัติการศึกษา</div>
    <div class="grid">
      <div class="info-card full">
        <div class="timeline">
          <div class="t-item">
            <div class="t-level">ประถมศึกษา</div>
            <div class="t-place">อำนาจเจริญ</div>
          </div>
          <div class="t-item">
            <div class="t-level">มัธยมศึกษาตอนต้น</div>
            <div class="t-place">โรงเรียนบ้านบ่อวิน</div>
          </div>
          <div class="t-item">
            <div class="t-level">ประกาศนียบัตรวิชาชีพ (ปวช.)</div>
            <div class="t-place">วิทยาลัยเทคโนโลยีชลบุรี</div>
          </div>
        </div>
      </div>
    </div>

    <footer>Personal Profile &middot; ${new Date().getFullYear() + 543}</footer>

  </div>

</body>
</html>
  `);
});

// 4. สั่งให้เซิร์ฟเวอร์เริ่มต้นเปิดรับฟังการเชื่อมต่อตาม Port ที่กำหนดไว้
server.listen(port, () => {
  console.log(`Server is running! เครื่องแม่ข่ายเปิดทำงานแล้วที่ช่องทาง: ${port}`);
});
