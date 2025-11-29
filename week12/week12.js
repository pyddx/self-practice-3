async function getProducts() {
  try {
    const res = await fetch("http://localhost:5000/products"); //Request ไปที่ URL    
    const data = await res.json(); //แปลงร่าง JSON text ที่ได้กลับมาเป็น Object ที่ JS เข้าใจ
     
    console.log("GET All Products:", data);
  } catch (err) {

    console.error("Error:", err);
  }
}

async function addProduct() {
  try {
    const res = await fetch("http://localhost:5000/products", {
      method: "POST", // ประกาศตัวเลยว่าจะ เพิ่ม POST
      headers: { 
          "Content-Type": "application/json" // ถ้าไม่ใส่ Server จะงงว่าส่งอะไรมา
      },
      body: JSON.stringify({ // String 
        name: "Webcam",
        price: 900
      })
    });
    
    const data = await res.json(); 
    console.log("POST Added:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

async function getProductById(id) {
  try {
    const res = await fetch(`http://localhost:5000/products/${id}`);
    
    if (!res.ok) { // Check Point
      throw new Error("Product not found"); // โยน Error ไปให้ catch ข้างล่างทำงาน
    }
    
    const data = await res.json();
    console.log("GET by ID:", data);
  } catch (err) {
    console.error("Error:", err); // รับ error จากบรรทัด throw มาแสดง
  }
}

async function updateProduct(id) {
  try {
    const res = await fetch(`http://localhost:5000/products/${id}`, {
      method: "PUT", // 1. บอกว่าจะ "แทนที่"
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Gaming Keyboard", // ต้องส่งให้ครบทุก field
        price: 1500
      })
    });
    const data = await res.json();
    console.log("PUT Updated:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

async function patchProduct(id) {
  try {
    const res = await fetch(`http://localhost:5000/products/${id}`, {
      method: "PATCH", // 1. บอกว่าจะ "ปะผุ/แก้ไขบางจุด"
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: 499 // ส่งไปแค่ field ที่จะแก้
      })
    });
    const data = await res.json();
    console.log("PATCH Updated:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

async function deleteProduct(id) {
  try {
    const res = await fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE" // สั่งลบเลย ไม่ต้องมี body
    });
    
    // เช็คหน่อยว่าลบสำเร็จไหม (200 OK หรือ 204 No Content)
    if (res.status === 200) {
      console.log("Deleted product with ID:", id);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}