// 1. Current Time — เวลาปัจจุบันแบบรวมๆ
const now = new Date();
console.log("ตอนนี้คือ:", now.toLocaleString());

// ลองแยกดูทีละส่วน
console.log("ปี:", now.getFullYear());
console.log("เดือน (0-11):", now.getMonth()); // ต้อง +1 ถ้าอยากให้เป็นเลขจริง
console.log("วันที่:", now.getDate());
console.log("ชั่วโมง:", now.getHours());
console.log("นาที:", now.getMinutes());
console.log("วินาที:", now.getSeconds());


// 2. Date Diff — หาความต่างของวันที่ (ซ้อมคิดแบบงานจริง)
const start = new Date("2025-01-01");
const end = new Date("2025-01-20");

const diffTime = end - start;            // ได้ milliseconds
const diffDays = diffTime / (1000 * 60 * 60 * 24);

console.log(`📅 ระยะห่าง: ${diffDays} วัน`);


// ลอง reverse ดู
const reverse = start - end;
console.log("ติดลบไหม:", reverse); // ดูว่ามีค่าติดลบหรือเปล่า


// 3. Day Name — ชื่อวันแบบไทย
const daysTH = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"];
console.log(`วันนี้วัน${daysTH[now.getDay()]}`);


// 4. Add Days — บวกวันเองแบบ manual
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 5);
console.log("อีก 5 วันคือ:", nextWeek.toString());

// ลองบวกเยอะๆ แบบข้ามเดือน
const nextMonth = new Date();
nextMonth.setDate(nextMonth.getDate() + 40); // ข้ามเดือนแน่ๆ
console.log("อีก 40 วัน:", nextMonth.toDateString());


// 5. Thai Date Format — แสดงแบบไทย
console.log(
  "แบบไทย:",
  now.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
);


// 6. Countdown Logic — ทดสอบเหมือนทำ Countdown Event
const target = new Date("2025-12-31 23:59:59"); // วันสิ้นปี
const gap = target - now; // คำนวณส่วนต่าง

const days = Math.floor(gap / (1000 * 60 * 60 * 24));
const hours = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((gap % (1000 * 60)) / 1000);

console.log(
  `⏳ เหลือถึงสิ้นปี: ${days} วัน ${hours} ชม. ${minutes} นาที ${seconds} วินาที`
);
