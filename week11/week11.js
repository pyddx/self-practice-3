// ===========================================
// Week 11: CRUD System - แบบง่ายๆ เข้าใจง่าย
// ===========================================

// URL ของ API ที่จะใช้
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

let isEditing = false; // กำลังแก้ไขอยู่หรือไม่
let editingId = null; // ID ที่กำลังแก้ไข


// READ - โหลดข้อมูล (GET)
// ภารกิจที่ 1: การดึงข้อมูล (READ)
// สร้างฟังก์ชัน loadQuotes() (Async Function)
// ใช้ fetch ดึงข้อมูลจาก API_URL
// เงื่อนไข: ถ้าโหลดไม่สำเร็จ ให้ alert บอกผู้ใช้
// เงื่อนไข: ถ้าสำเร็จ ให้ตัดข้อมูล (slice) มาแสดงแค่ 5 รายการแรก
// ส่งข้อมูลที่ได้ไปให้ฟังก์ชัน displayQuotes ทำงานต่อ

async function loadQuotes() {
    // async = ฟังก์ชันที่รอได้
    // await = รอให้ fetch ทำงานเสร็จ
    
    try {
        // try = ลองทำ
        const res = await fetch(API_URL); // ดึงข้อมูลจาก API
        if (!res.ok) {
            throw new Error("โหลดไม่สำเร็จ"); // ถ้าไม่สำเร็จ โยน error
        }
        
        const quotes = await res.json(); // แปลงเป็น JavaScript object
        // แสดงเฉพาะ 5 รายการแรก
        displayQuotes(quotes.slice(0, 5));
        
    } catch (err) {
        // catch = จับ error
        console.error(err);
        alert("โหลดข้อมูลไม่ได้");
    }
}

// แสดงข้อมูลใน HTML
// ภารกิจที่ 2: การแสดงผล (DOM Manipulation)
// สร้างฟังก์ชัน displayQuotes(quotes)
// รับข้อมูล array ของ quotes เข้ามา
// ล้างข้อมูลเก่าใน <ul> (id="quoteList") ทิ้งก่อน
// วนลูปสร้าง <li> โดยในแต่ละบรรทัดต้องมี:
// ข้อความคำคม (q.title) ตัวหนา
// ชื่อผู้แต่ง (q.body) ตัวเล็ก
// ปุ่มแก้ไข: เมื่อกด ให้เรียกฟังก์ชัน editQuote(...)
// ปุ่มลบ: เมื่อกด ให้เรียกฟังก์ชัน deleteQuote(...)

function displayQuotes(quotes) {
    const list = document.getElementById("quoteList");
    
    list.innerHTML = ""; // ล้างข้อมูลเก่า
    
    quotes.forEach(q => { // วนลูปแสดงแต่ละรายการ
        const li = document.createElement("li"); // สร้าง <li>
        li.className = "quote-item";
        li.dataset.id = q.id; // เก็บ id ไว้
        
        li.innerHTML = `
            <div>
                <strong>${q.title}</strong><br>
                <small>${q.body}</small>
            </div>
            <div>
                <button onclick="editQuote(${q.id}, '${q.title.replace(/'/g, "\\'")}', '${q.body.replace(/'/g, "\\'")}')">
                    แก้ไข
                </button>
                <button onclick="deleteQuote(${q.id})">
                    ลบ
                </button>
            </div>
        `;
        list.appendChild(li); // เพิ่มเข้า <ul>
    });
}

// CREATE - เพิ่มข้อมูล (POST)
// ภารกิจที่ 3: การเพิ่มข้อมูล (CREATE)
// สร้างฟังก์ชัน addQuote()
// รับค่าจาก input ทั้งสองช่อง
// Validation: ถ้าช่องไหนว่าง ให้แจ้งเตือนและหยุดทำงาน
// Logic: เช็คว่าถ้า isEditing เป็น true ให้ไปเรียกฟังก์ชันอัปเดตแทน (ภารกิจที่ 5)
// ถ้าเป็นการเพิ่มใหม่:
// ใช้ fetch method POST ส่งข้อมูลไปยัง API
// เมื่อสำเร็จ ให้เอาข้อมูลที่ได้จาก API มาสร้าง <li> เพิ่มเข้าไป ด้านบนสุด ของรายการ (insertBefore)
// ล้างค่าใน Input ให้ว่าง

async function addQuote() {
    const quoteInput = document.getElementById("quoteInput");
    const authorInput = document.getElementById("authorInput");
    
    const quoteText = quoteInput.value.trim(); // trim = ตัดช่องว่าง
    const authorText = authorInput.value.trim();
    
    // ตรวจสอบว่ากรอกครบหรือไม่
    if (!quoteText || !authorText) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
    }
    
    // ถ้ากำลังแก้ไข ให้เรียก updateQuote แทน
    if (isEditing) {
        updateQuote(editingId, quoteText, authorText);
        return;
    }
    
    try {
        const res = await fetch(API_URL, {
            method: "POST", // ใช้ POST สำหรับเพิ่ม
            headers: {
                "Content-Type": "application/json" // บอกว่าส่ง JSON
            },
            body: JSON.stringify({ // แปลง object เป็น JSON string
                title: quoteText,
                body: authorText,
                userId: 1
            })
        });
        
        const newQuote = await res.json();
        console.log("เพิ่มสำเร็จ:", newQuote);
        
        // เพิ่มเข้า DOM
        addQuoteToDOM(newQuote);
        
        // ล้างฟอร์ม
        quoteInput.value = "";
        authorInput.value = "";
        
        alert("เพิ่มข้อมูลสำเร็จ");
        
    } catch (err) {
        console.error(err);
        alert("เพิ่มข้อมูลไม่สำเร็จ");
    }
}


// เพิ่มรายการเข้า DOM
// ภารกิจที่ 4: การลบข้อมูล (DELETE)
// สร้างฟังก์ชัน deleteQuote(id)
// Logic: ต้องมี window.confirm เพื่อถามยืนยันก่อนลบ
// ใช้ fetch method DELETE ไปที่ ${API_URL}/${id}
// เมื่อ API ตอบกลับว่าสำเร็จ ให้ลบ element <li> นั้นออกจากหน้าเว็บทันที (โดยไม่ต้องโหลดหน้าใหม่)

function addQuoteToDOM(quote) {
    const list = document.getElementById("quoteList");
    
    const li = document.createElement("li");
    li.className = "quote-item";
    li.dataset.id = quote.id;
    
    li.innerHTML = `
        <div>
            <strong>${quote.title}</strong><br>
            <small>${quote.body}</small>
        </div>
        <div>
            <button onclick="editQuote(${quote.id}, '${quote.title}', '${quote.body}')">
                แก้ไข
            </button>
            <button onclick="deleteQuote(${quote.id})">
                ลบ
            </button>
        </div>
    `;
    
    // เพิ่มที่บนสุด
    list.insertBefore(li, list.firstChild);
}

// UPDATE - แก้ไขข้อมูล (PUT)
function editQuote(id, title, body) {
    // เปลี่ยนเป็นโหมดแก้ไข
    isEditing = true;
    editingId = id;
    
    // ใส่ข้อมูลเข้า input
    document.getElementById("quoteInput").value = title;
    document.getElementById("authorInput").value = body;
    
    // เปลี่ยนปุ่ม
    const btn = document.getElementById("addBtn");
    btn.textContent = "อัปเดต";
    
    // แสดงปุ่มยกเลิก
    document.getElementById("cancelBtn").style.display = "inline";
}


async function updateQuote(id, newTitle, newBody) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT", // ใช้ PUT สำหรับแก้ไข
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                title: newTitle,
                body: newBody,
                userId: 1
            })
        });
        
        const updated = await res.json();
        console.log("อัปเดตสำเร็จ:", updated);
        
        // อัปเดต DOM
        updateQuoteInDOM(id, newTitle, newBody);
        
        // รีเซ็ตฟอร์ม
        resetForm();
        
        alert("อัปเดตสำเร็จ");
        
    } catch (err) {
        console.error(err);
        alert("อัปเดตไม่สำเร็จ");
    }
}


// อัปเดตรายการใน DOM
function updateQuoteInDOM(id, newTitle, newBody) {
    const item = document.querySelector(`[data-id="${id}"]`);
    
    if (item) {
        const strong = item.querySelector("strong");
        const small = item.querySelector("small");
        
        strong.textContent = newTitle;
        small.textContent = newBody;
    }
}

// DELETE - ลบข้อมูล (DELETE)
async function deleteQuote(id) {
    // ยืนยันก่อนลบ
    const confirm = window.confirm("ต้องการลบใช่หรือไม่?");
    
    if (!confirm) return; // ถ้ายกเลิก ก็หยุด
    
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE" // ใช้ DELETE สำหรับลบ
        });
        
        if (res.ok) {
            console.log("ลบสำเร็จ id:", id);
            
            // ลบออกจาก DOM
            deleteQuoteFromDOM(id);
            
            alert("ลบสำเร็จ");
        }
        
    } catch (err) {
        console.error(err);
        alert("ลบไม่สำเร็จ");
    }
}


// ลบรายการจาก DOM
function deleteQuoteFromDOM(id) {
    const item = document.querySelector(`[data-id="${id}"]`);
    
    if (item) {
        item.remove(); // ลบ element ออก
    }
}


// รีเซ็ตฟอร์ม
// ภารกิจที่ 5: การแก้ไขข้อมูล (UPDATE)
// Step A (เตรียมแก้): สร้างฟังก์ชัน editQuote(id, title, body)
// เปลี่ยนตัวแปร isEditing = true และจำ editingId ไว้
// นำข้อมูลเก่าไปใส่ในช่อง Input
// เปลี่ยนปุ่ม "เพิ่ม" เป็น "อัปเดต" และแสดงปุ่ม "ยกเลิก"
// Step B (บันทึก): สร้างฟังก์ชัน updateQuote(id, newTitle, newBody)
// ใช้ fetch method PUT ไปที่ ${API_URL}/${id}
// เมื่อสำเร็จ ให้อัปเดตข้อความใน <li> เดิมด้วยข้อมูลใหม่
// เรียกฟังก์ชัน resetForm() เพื่อคืนค่าปุ่มและตัวแปรต่างๆ
// ภารกิจเสริม (Optional)
// ทำให้กดปุ่ม Enter ในช่องชื่อผู้แต่ง แล้วส่งข้อมูลได้เลย
// เขียนฟังก์ชัน resetForm() เพื่อเคลียร์ค่าต่างๆ เมื่อกดปุ่มยกเลิก หรืออัปเดตเสร็จ

function resetForm() {
    isEditing = false;
    editingId = null;
    
    document.getElementById("quoteInput").value = "";
    document.getElementById("authorInput").value = "";
    
    const btn = document.getElementById("addBtn");
    btn.textContent = "เพิ่ม";
    
    document.getElementById("cancelBtn").style.display = "none";
}


// เริ่มต้นโปรแกรม

document.addEventListener("DOMContentLoaded", () => {
    // DOMContentLoaded = เมื่อ HTML โหลดเสร็จ
    
    console.log("โปรแกรมเริ่มทำงาน");
    
    // ตั้งค่าปุ่ม
    const addBtn = document.getElementById("addBtn");
    addBtn.addEventListener("click", addQuote);
    
    // กด Enter ที่ textarea ก็เพิ่มได้
    const authorInput = document.getElementById("authorInput");
    authorInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // ป้องกันการขึ้นบรรทัดใหม่
            addQuote();
        }
    });
    
    // โหลดข้อมูลตอนเริ่มต้น
    loadQuotes();
});

