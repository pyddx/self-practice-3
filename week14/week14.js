//มีไฟล์ที่หนูทำมี keycloak.html keycloak-auth.js

//keycloak.html (หน้าจอ Login Gateway)
const keycloak = new Keycloak({
  url: "https://bscit.sit.kmutt.ac.th/intproj25/ft/keycloak/",  // Keycloak Server
  realm: "itb-ecors",           // Realm (กลุ่มของ users/apps)
  clientId: "itb-ecors-or3"     // Client ID (แอปของคุณ)
});

await keycloak.init({
  onLoad: "login-required"  // ← บังคับให้ login
});

//บันทึก Token ลง sessionStorage
sessionStorage.setItem("kcToken", keycloak.token);
sessionStorage.setItem("kcRefreshToken", keycloak.refreshToken);
//Redirect ไปหน้า reserve.html

// reserve.html (หน้าที่ต้อง Login)
import { initKeycloak, getUser } from "./keycloak-auth.js";

// ตรวจสอบว่า login แล้วหรือยัง
const authenticated = await initKeycloak(true);

if (!authenticated) {
  // ยังไม่ login → redirect กลับไป keycloak
  return;
}

// Login แล้ว → ดึงข้อมูล User
const user = getUser();
console.log(user.name);  // "Private User Name"

const token = sessionStorage.getItem("kcToken");

const response = await fetch(`${API_BASE_URL}/study-plans`, {
  headers: {
    'Authorization': `Bearer ${token}`  // ← ส่ง Token ไปด้วย
  }
});

// Backend (Node.js/Express)
const jwt = require('jsonwebtoken');

app.get('/api/study-plans', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  // ตรวจสอบ Token กับ Keycloak Public Key
  const decoded = jwt.verify(token, keycloakPublicKey);
  
  console.log(decoded.preferred_username);  // "piyada"
  
  // Token ถูกต้อง → ส่งข้อมูลกลับ
  res.json(studyPlans);
});

export function logout() {
  sessionStorage.clear();  // ลบ Token
  keycloak.logout({
    redirectUri: BASE_URL  // Redirect กลับ index.html
  });
}

//Token Refresh (ต่ออายุ Token อัตโนมัติ)
// ใน keycloak.html
setInterval(async () => {
  try {
    // ถ้า Token จะหมดใน 30 วินาที → Refresh
    const refreshed = await keycloak.updateToken(30);
    if (refreshed) {
      sessionStorage.setItem("kcToken", keycloak.token);
    }
  } catch (e) {
    console.error("Refresh failed", e);
  }
}, 15000);  // เช็คทุก 15 วินาที

// - Token มีอายุสั้น (เช่น 5-15 นาที)
// - ถ้าหมดแล้วต้อง Login ใหม่
// - Refresh Token ช่วยต่ออายุโดยไม่ต้อง Login ซ้ำ
