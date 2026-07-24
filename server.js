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
    // 4. นำข้อมูลที่ได้ (result.rows) มาประกอบเป็นตาราง HTML
    let html = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <title>ฐานข้อมูลนักศึกษา</title>
        <style>
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 40px 20px;
            font-family: 'Segoe UI', 'Sarabun', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            padding: 32px 40px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
          }
          h1 {
            text-align: center;
            color: #4a3f78;
            font-size: 26px;
            margin-bottom: 8px;
          }
          .subtitle {
            text-align: center;
            color: #888;
            font-size: 14px;
            margin-bottom: 28px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          thead {
            background: linear-gradient(135deg, #667eea, #764ba2);
          }
          th {
            color: #fff;
            padding: 14px 16px;
            text-align: left;
            font-size: 14px;
            letter-spacing: 0.5px;
          }
          td {
            padding: 12px 16px;
            border-bottom: 1px solid #eee;
            color: #333;
            font-size: 14px;
          }
          tbody tr:nth-child(even) {
            background-color: #f7f6fb;
          }
          tbody tr:hover {
            background-color: #ece9f9;
            transition: background-color 0.2s ease;
          }
          tbody tr:last-child td {
            border-bottom: none;
          }
          .badge {
            display: inline-block;
            background: #eef0ff;
            color: #5a4fcf;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎓 ฐานข้อมูลนักศึกษา</h1>
          <p class="subtitle">ทดสอบการเชื่อมต่อฐานข้อมูล · ทั้งหมด ${result.rows.length} รายการ</p>
          <table>
            <thead>
              <tr>
                <th>รหัสนักศึกษา</th>
                <th>ชื่อ-นามสกุล</th>
              </tr>
            </thead>
            <tbody>
    `;

    // วนลูปนำข้อมูลแต่ละแถวมาแสดง
    result.rows.forEach(row => {
      html += `
              <tr>
                <td><span class="badge">${row.students_id}</span></td>
                <td>${row.students_name}</td>
              </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </div>
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
