const http = require('http');
// 1. เรียกใช้งาน Pool จากไลบรารี pg สำหรับจัดการการเชื่อมต่อฐานข้อมูล
const { Pool } = require('pg');
// 2. ตั้งค่าการเชื่อมต่อ โดยดึง URL มาจาก Environment Variable ของ Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const port = process.env.PORT || 3000;
const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  try {
    // 3. ขอเชื่อมต่อและสั่ง SQL ไปดึงข้อมูลจากตาราง students
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM students');
    client.release(); // คืนการเชื่อมต่อเมื่อใช้งานเสร็จ

    // 4. สร้างแถวตารางจากข้อมูลที่ได้
    let rowsHtml = '';
    result.rows.forEach(row => {
      rowsHtml += `
              <tr>
                <td><span class="badge">${row.students_id}</span></td>
                <td>${row.students_name}</td>
              </tr>
      `;
    });

    const html = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ฐานข้อมูลนักศึกษา - ใต้ทะเล</title>
        <style>
          :root {
            --bg-deep: #032b4f;
            --bg-mid: #045a8d;
            --bg-light: #0891c4;
            --card-bg: rgba(255, 255, 255, 0.92);
            --text-main: #063a5e;
            --text-sub: #4a7a94;
            --header-grad-1: #0b6e99;
            --header-grad-2: #033a5e;
            --row-alt: #eef8fc;
            --row-hover: #d7f1fb;
            --shadow: rgba(0, 20, 40, 0.35);
          }
          [data-theme="dark"] {
            --bg-deep: #010a14;
            --bg-mid: #021c33;
            --bg-light: #03334f;
            --card-bg: rgba(10, 25, 40, 0.92);
            --text-main: #d7f1fb;
            --text-sub: #7fa8bd;
            --header-grad-1: #04425f;
            --header-grad-2: #011824;
            --row-alt: #08202f;
            --row-hover: #0d3145;
            --shadow: rgba(0, 0, 0, 0.6);
          }

          * { box-sizing: border-box; }

          html, body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            overflow-x: hidden;
            cursor: none;
          }

          body {
            font-family: 'Segoe UI', 'Sarabun', sans-serif;
            background: linear-gradient(180deg, var(--bg-light) 0%, var(--bg-mid) 45%, var(--bg-deep) 100%);
            transition: background 0.6s ease;
            position: relative;
            padding: 40px 20px;
          }

          .waves {
            position: fixed;
            bottom: 0; left: 0; width: 100%;
            height: 220px;
            z-index: 0;
            pointer-events: none;
            opacity: 0.55;
          }
          .waves svg { width: 200%; height: 100%; animation: waveMove 12s linear infinite; }
          .waves.wave2 svg { animation-duration: 18s; opacity: 0.5; }
          .waves.wave3 svg { animation-duration: 25s; opacity: 0.35; }
          @keyframes waveMove {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .bubble {
            position: fixed;
            bottom: -50px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), rgba(255,255,255,0.05));
            pointer-events: none;
            z-index: 0;
            animation: floatUp linear infinite;
          }
          @keyframes floatUp {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 0.8; }
            100% { transform: translateY(-110vh) translateX(20px); opacity: 0; }
          }

          .mouse-bubble {
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
            background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(140,220,255,0.15));
            box-shadow: 0 0 10px rgba(150, 230, 255, 0.6);
            z-index: 5;
            animation: mouseBubblePop 1s ease-out forwards;
          }
          @keyframes mouseBubblePop {
            0% { transform: scale(0.4) translateY(0); opacity: 0.9; }
            100% { transform: scale(1.1) translateY(-60px); opacity: 0; }
          }

          .container {
            position: relative;
            z-index: 2;
            max-width: 800px;
            margin: 0 auto;
            background: var(--card-bg);
            backdrop-filter: blur(6px);
            border-radius: 16px;
            padding: 32px 40px;
            box-shadow: 0 20px 50px var(--shadow);
            transition: background 0.6s ease, box-shadow 0.6s ease;
          }

          h1 {
            text-align: center;
            color: var(--text-main);
            font-size: 26px;
            margin-bottom: 8px;
            transition: color 0.6s ease;
          }
          .subtitle {
            text-align: center;
            color: var(--text-sub);
            font-size: 14px;
            margin-bottom: 28px;
            transition: color 0.6s ease;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          }
          thead { background: linear-gradient(135deg, var(--header-grad-1), var(--header-grad-2)); }
          th {
            color: #fff;
            padding: 14px 16px;
            text-align: left;
            font-size: 14px;
            letter-spacing: 0.5px;
          }
          td {
            padding: 12px 16px;
            border-bottom: 1px solid rgba(120,120,120,0.15);
            color: var(--text-main);
            font-size: 14px;
            transition: color 0.6s ease;
          }
          tbody tr:nth-child(even) { background-color: var(--row-alt); }
          tbody tr:hover { background-color: var(--row-hover); transition: background-color 0.2s ease; }
          tbody tr:last-child td { border-bottom: none; }

          .badge {
            display: inline-block;
            background: rgba(11, 110, 153, 0.12);
            color: var(--header-grad-1);
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }

          .theme-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10;
            background: var(--card-bg);
            border: none;
            border-radius: 30px;
            padding: 10px 18px;
            font-size: 14px;
            font-weight: 600;
            color: var(--text-main);
            box-shadow: 0 6px 18px var(--shadow);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.2s ease, background 0.6s ease, color 0.6s ease;
          }
          .theme-toggle:hover { transform: scale(1.05); }

          .trident-cursor {
            position: fixed;
            top: 0; left: 0;
            width: 40px;
            height: 40px;
            pointer-events: none;
            z-index: 999;
            transform: translate(-6px, -34px);
            filter: drop-shadow(0 0 4px rgba(150,230,255,0.8));
          }
        </style>
      </head>
      <body data-theme="light">
        <div class="waves wave1">
          <svg viewBox="0 0 1440 220" preserveAspectRatio="none"><path d="M0,100 C240,180 480,20 720,100 C960,180 1200,20 1440,100 L1440,220 L0,220 Z" fill="#ffffff" opacity="0.15"/></svg>
        </div>
        <div class="waves wave2">
          <svg viewBox="0 0 1440 220" preserveAspectRatio="none"><path d="M0,120 C240,40 480,200 720,120 C960,40 1200,200 1440,120 L1440,220 L0,220 Z" fill="#ffffff" opacity="0.2"/></svg>
        </div>
        <div class="waves wave3">
          <svg viewBox="0 0 1440 220" preserveAspectRatio="none"><path d="M0,140 C240,80 480,180 720,140 C960,80 1200,180 1440,140 L1440,220 L0,220 Z" fill="#ffffff" opacity="0.25"/></svg>
        </div>

        <button class="theme-toggle" id="themeToggle">🌙 Dark Mode</button>

        <div class="container">
          <h1>🔱 ฐานข้อมูลนักศึกษาใต้สมุทร</h1>
          <p class="subtitle">ทดสอบการเชื่อมต่อฐานข้อมูล · ทั้งหมด ${result.rows.length} รายการ</p>
          <table>
            <thead>
              <tr>
                <th>รหัสนักศึกษา</th>
                <th>ชื่อ-นามสกุล</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <svg class="trident-cursor" id="tridentCursor" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fff6d5"/>
              <stop offset="50%" stop-color="#ffd75e"/>
              <stop offset="100%" stop-color="#b8860b"/>
            </linearGradient>
          </defs>
          <g stroke="url(#goldGrad)" stroke-width="2.5" fill="url(#goldGrad)" stroke-linecap="round" stroke-linejoin="round">
            <line x1="32" y1="14" x2="32" y2="60" />
            <path d="M18 4 L18 22 Q18 28 24 28" fill="none"/>
            <path d="M46 4 L46 22 Q46 28 40 28" fill="none"/>
            <path d="M32 2 L32 24" fill="none"/>
            <polygon points="32,0 28,10 36,10" />
            <polygon points="18,2 14,12 22,12" />
            <polygon points="46,2 42,12 50,12" />
            <path d="M24 44 Q32 50 40 44" fill="none" />
          </g>
        </svg>

        <script>
          const cursor = document.getElementById('tridentCursor');
          window.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
          });

          let lastBubbleTime = 0;
          window.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastBubbleTime < 60) return;
            lastBubbleTime = now;
            const bubble = document.createElement('div');
            bubble.className = 'mouse-bubble';
            const size = 6 + Math.random() * 14;
            bubble.style.width = size + 'px';
            bubble.style.height = size + 'px';
            bubble.style.left = (e.clientX - size / 2) + 'px';
            bubble.style.top = (e.clientY - size / 2) + 'px';
            document.body.appendChild(bubble);
            setTimeout(() => bubble.remove(), 1000);
          });

          function spawnBackgroundBubble() {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            const size = 8 + Math.random() * 26;
            bubble.style.width = size + 'px';
            bubble.style.height = size + 'px';
            bubble.style.left = Math.random() * 100 + 'vw';
            const duration = 8 + Math.random() * 10;
            bubble.style.animationDuration = duration + 's';
            document.body.appendChild(bubble);
            setTimeout(() => bubble.remove(), duration * 1000);
          }
          setInterval(spawnBackgroundBubble, 400);
          for (let i = 0; i < 10; i++) setTimeout(spawnBackgroundBubble, i * 200);

          const toggleBtn = document.getElementById('themeToggle');
          const bodyEl = document.body;
          function applyTheme(theme) {
            bodyEl.setAttribute('data-theme', theme);
            toggleBtn.innerHTML = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
            localStorage.setItem('oceanTheme', theme);
          }
          const savedTheme = localStorage.getItem('oceanTheme') || 'light';
          applyTheme(savedTheme);
          toggleBtn.addEventListener('click', () => {
            const current = bodyEl.getAttribute('data-theme');
            applyTheme(current === 'dark' ? 'light' : 'dark');
          });
        </script>
      </body>
      </html>
    `;
    res.end(html);
  } catch (err) {
    // กรณีเชื่อมต่อไม่ได้หรือเขียนชื่อตารางผิด
    console.error(err);
    res.end(`<h1>เกิดข้อผิดพลาด!</h1><p>${err.message}</p>`);
  }
});
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
