const http = require('http');
// 1. เรียกใช้งาน Pool จากไลบรารี pg สำหรับจัดการการเชื่อมต่อฐานข้อมูล
const { Pool } = require('pg');
// 2. ตั้งค่าการเชื่อมต่อ โดยดึง URL มาจาก Environment Variable ของ Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const port = process.env.PORT || 3000;

// รายการอิโมจิสัตว์ทะเลน่ารักๆ สำหรับ Avatar (สุ่มตาม id)
const seaAvatars = ['🐟', '🐠', '🐡', '🦑', '🦐', '🐢', '🐬', '🦀', '🐙', '🐳'];

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  try {
    // 3. ขอเชื่อมต่อและสั่ง SQL ไปดึงข้อมูลจากตาราง students
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM students');
    client.release(); // คืนการเชื่อมต่อเมื่อใช้งานเสร็จ

    // 4. สร้างแถวตารางจากข้อมูลที่ได้ พร้อม Avatar สัตว์ทะเล
    let rowsHtml = '';
    result.rows.forEach((row, index) => {
      const avatar = seaAvatars[index % seaAvatars.length];
      rowsHtml += `
              <tr>
                <td class="avatar-cell"><span class="avatar">${avatar}</span></td>
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
        <title>ฐานข้อมูลนักศึกษา</title>
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
            --row-hover: #e0f2fe;
            --shadow: rgba(0, 20, 40, 0.35);
            --footer-text: rgba(255, 255, 255, 0.65);
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
            --row-hover: #123449;
            --shadow: rgba(0, 0, 0, 0.6);
            --footer-text: rgba(180, 220, 255, 0.5);
          }

          * { box-sizing: border-box; }

          html, body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            overflow-x: hidden;
          }

          body {
            font-family: 'Segoe UI', 'Sarabun', sans-serif;
            background: linear-gradient(180deg, var(--bg-light) 0%, var(--bg-mid) 45%, var(--bg-deep) 100%);
            transition: background 0.6s ease;
            position: relative;
            padding: 40px 20px 100px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          /* ===== คลื่นขยับ ===== */
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

          /* ===== ฟองอากาศลอยขึ้นพื้นหลัง ===== */
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

          /* ===== ปลาว่ายผ่านหน้าจอเฉยๆ (ambient) ===== */
          .ambient-fish {
            position: fixed;
            z-index: 1;
            pointer-events: none;
            opacity: 0.85;
            animation: swimAcross linear infinite;
          }
          @keyframes swimAcross {
            0% { transform: translateX(-10vw) translateY(0); }
            50% { transform: translateX(55vw) translateY(-20px); }
            100% { transform: translateX(110vw) translateY(0); }
          }

          .container {
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 1000px;
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
          th.avatar-col { width: 70px; text-align: center; }
          td {
            padding: 12px 16px;
            border-bottom: 1px solid rgba(120,120,120,0.15);
            color: var(--text-main);
            font-size: 14px;
            transition: color 0.6s ease, background-color 0.2s ease;
          }
          tbody tr { transition: transform 0.2s ease, background-color 0.2s ease; }
          tbody tr:nth-child(even) { background-color: var(--row-alt); }
          tbody tr:hover {
            background-color: var(--row-hover);
            transform: translateY(-2px);
            box-shadow: 0 6px 14px rgba(0,0,0,0.08);
          }
          tbody tr:last-child td { border-bottom: none; }

          .avatar-cell { text-align: center; }
          .avatar {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            font-size: 18px;
            background: radial-gradient(circle at 30% 30%, #ffffff, #d7f1fb);
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          }

          .badge {
            display: inline-block;
            background: rgba(11, 110, 153, 0.12);
            color: var(--header-grad-1);
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }

          /* ===== ปุ่มสลับธีม ===== */
          .theme-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10;
            background: var(--card-bg);
            border: none;
            border-radius: 30px;
            padding: 10px 20px;
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
          .theme-toggle:hover { transform: scale(1.06); }
          .theme-toggle .icons { font-size: 16px; }

          /* ===== ปลาที่ตามเมาส์ ===== */
          .fish {
            position: fixed;
            top: 0; left: 0;
            width: 34px;
            height: 34px;
            pointer-events: none;
            z-index: 998;
            transform: translate(-50%, -50%);
            filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
          }

          /* ===== สาหร่ายและปะการังด้านล่าง ===== */
          .seabed {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 200px;
            z-index: 1;
            pointer-events: none;
            overflow: hidden;
          }
          .seaweed {
            position: absolute;
            bottom: 0;
            transform-origin: bottom center;
            animation: sway 4s ease-in-out infinite;
          }
          @keyframes sway {
            0%, 100% { transform: rotate(-6deg); }
            50% { transform: rotate(6deg); }
          }
          .coral { position: absolute; bottom: 0; }

          /* ===== Footer ===== */
          .footer {
            position: relative;
            z-index: 3;
            width: 100%;
            text-align: center;
            margin-top: 24px;
            font-size: 13px;
            letter-spacing: 0.4px;
            color: var(--footer-text);
            transition: color 0.6s ease;
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

        <!-- พื้นทะเล: สาหร่าย + ปะการัง -->
        <div class="seabed" id="seabed"></div>

        <!-- ปลาว่ายผ่านหน้าจอแบบสุ่ม (ambient) -->
        <div id="ambientFishContainer"></div>

        <button class="theme-toggle" id="themeToggle">
          <span class="icons" id="themeIcons">☀️🐚</span> Light Mode
        </button>

        <div class="container">
          <h1>🐬 ฐานข้อมูลนักศึกษา</h1>
          <p class="subtitle">ทดสอบการเชื่อมต่อฐานข้อมูล · ทั้งหมด ${result.rows.length} รายการ</p>
          <table>
            <thead>
              <tr>
                <th class="avatar-col"></th>
                <th>รหัสนักศึกษา</th>
                <th>ชื่อ-นามสกุล</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <p class="footer">🌊 Undersea Student Management System v1.0</p>

        <!-- ปลาที่ตามเมาส์ -->
        <div id="fishContainer"></div>

        <script>
          // ===== สร้างพื้นทะเล: สาหร่าย + ปะการัง =====
          const seabed = document.getElementById('seabed');
          const seaweedColors = ['#0f9b6e', '#12b886', '#0b7a54'];
          const coralColors = ['#ff6b6b', '#ff8fa3', '#ffa94d'];

          function makeSeaweed(x, height, color, delay) {
            const div = document.createElement('div');
            div.className = 'seaweed';
            div.style.left = x + 'px';
            div.style.animationDelay = delay + 's';
            div.innerHTML = \`
              <svg width="30" height="\${height}" viewBox="0 0 30 \${height}">
                <path d="M15 \${height} C 0 \${height*0.7}, 30 \${height*0.5}, 15 \${height*0.3} C 0 \${height*0.15}, 30 \${height*0.1}, 15 0"
                  stroke="\${color}" stroke-width="6" fill="none" stroke-linecap="round"/>
              </svg>
            \`;
            seabed.appendChild(div);
          }

          function makeCoral(x, scale, color) {
            const div = document.createElement('div');
            div.className = 'coral';
            div.style.left = x + 'px';
            div.style.transform = 'scale(' + scale + ')';
            div.style.transformOrigin = 'bottom center';
            div.innerHTML = \`
              <svg width="60" height="70" viewBox="0 0 60 70">
                <path d="M30 70 L30 40 M30 50 L15 20 M30 50 L45 20 M30 40 L18 15 M30 40 L42 15" 
                  stroke="\${color}" stroke-width="7" fill="none" stroke-linecap="round"/>
                <circle cx="15" cy="20" r="4" fill="\${color}"/>
                <circle cx="45" cy="20" r="4" fill="\${color}"/>
                <circle cx="18" cy="15" r="3.5" fill="\${color}"/>
                <circle cx="42" cy="15" r="3.5" fill="\${color}"/>
              </svg>
            \`;
            seabed.appendChild(div);
          }

          const seabedWidth = window.innerWidth;
          for (let x = 0; x < seabedWidth; x += 90) {
            makeSeaweed(x + Math.random()*20, 70 + Math.random()*60, seaweedColors[Math.floor(Math.random()*seaweedColors.length)], Math.random()*2);
          }
          for (let x = 40; x < seabedWidth; x += 220) {
            makeCoral(x + Math.random()*40, 0.6 + Math.random()*0.6, coralColors[Math.floor(Math.random()*coralColors.length)]);
          }

          // ===== ฟองอากาศลอยขึ้นพื้นหลัง =====
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

          // ===== ปลาว่ายผ่านหน้าจอเฉยๆ (ambient, ซ้ายไปขวา ช้าๆ) =====
          const ambientContainer = document.getElementById('ambientFishContainer');
          const ambientColors = ['#48dbfb', '#feca57', '#ff9ff3', '#1dd1a1', '#ff9f43'];

          function ambientFishSvg(color) {
            return \`<svg viewBox="0 0 64 40" width="26" height="16" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="30" cy="20" rx="22" ry="13" fill="\${color}"/>
              <path d="M8 20 L -6 8 L -6 32 Z" fill="\${color}"/>
              <circle cx="42" cy="16" r="3" fill="#063a5e"/>
            </svg>\`;
          }

          function spawnAmbientFish() {
            const fish = document.createElement('div');
            fish.className = 'ambient-fish';
            const color = ambientColors[Math.floor(Math.random() * ambientColors.length)];
            fish.innerHTML = ambientFishSvg(color);
            fish.style.top = (10 + Math.random() * 70) + 'vh';
            const duration = 14 + Math.random() * 10;
            fish.style.animationDuration = duration + 's';
            ambientContainer.appendChild(fish);
            setTimeout(() => fish.remove(), duration * 1000);
          }
          setInterval(spawnAmbientFish, 3500);
          for (let i = 0; i < 3; i++) setTimeout(spawnAmbientFish, i * 1200);

          // ===== ปลาที่ว่ายตามเมาส์ (มี delay ทำให้ดูเป็นฝูงตามหลัง) =====
          const fishContainer = document.getElementById('fishContainer');
          const fishColors = ['#ff9f43', '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3'];
          const fishCount = 4;
          const fishEls = [];
          const fishPos = [];

          function fishSvg(color) {
            return \`<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="30" cy="20" rx="22" ry="13" fill="\${color}"/>
              <path d="M8 20 L -6 8 L -6 32 Z" fill="\${color}"/>
              <circle cx="42" cy="16" r="3" fill="#063a5e"/>
              <path d="M18 20 Q26 12 34 20 Q26 28 18 20 Z" fill="rgba(255,255,255,0.3)"/>
            </svg>\`;
          }

          for (let i = 0; i < fishCount; i++) {
            const el = document.createElement('div');
            el.className = 'fish';
            el.innerHTML = fishSvg(fishColors[i % fishColors.length]);
            el.style.width = (34 - i * 3) + 'px';
            el.style.height = (34 - i * 3) + 'px';
            fishContainer.appendChild(el);
            fishEls.push(el);
            fishPos.push({ x: window.innerWidth / 2, y: window.innerHeight / 2, angle: 0 });
          }

          let mouseX = window.innerWidth / 2;
          let mouseY = window.innerHeight / 2;
          window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
          });

          function animateFish() {
            let targetX = mouseX;
            let targetY = mouseY;
            fishPos.forEach((pos, i) => {
              const ease = 0.08 - i * 0.008;
              const dx = targetX - pos.x;
              const dy = targetY - pos.y;
              pos.x += dx * ease;
              pos.y += dy * ease;
              const angle = Math.atan2(dy, dx) * 180 / Math.PI;
              if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
                pos.angle = angle;
              }
              const flip = (pos.angle > 90 || pos.angle < -90) ? -1 : 1;
              fishEls[i].style.left = pos.x + 'px';
              fishEls[i].style.top = pos.y + 'px';
              fishEls[i].style.transform =
                'translate(-50%, -50%) rotate(' + pos.angle + 'deg) scaleY(' + flip + ')';
              targetX = pos.x;
              targetY = pos.y;
            });
            requestAnimationFrame(animateFish);
          }
          animateFish();

          // ===== สลับโหมด Dark / Light =====
          const toggleBtn = document.getElementById('themeToggle');
          const themeIcons = document.getElementById('themeIcons');
          const bodyEl = document.body;
          function applyTheme(theme) {
            bodyEl.setAttribute('data-theme', theme);
            if (theme === 'dark') {
              themeIcons.textContent = '🌙🪼';
              toggleBtn.lastChild.textContent = ' Dark Mode';
            } else {
              themeIcons.textContent = '☀️🐚';
              toggleBtn.lastChild.textContent = ' Light Mode';
            }
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
