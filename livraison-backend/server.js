// server.js - نسخة سحابيــة 100% لــ Railway
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import db from "./config/db.js";

dotenv.config();

const app = express();

// ============ 🔥 CORS سحابي 100٪ ============
const allowedOrigins = [
  process.env.CLIENT_URL,           // واجهتك على Railway
  "https://determined-mindfulness-production.up.railway.app",
  "http://localhost:3000"           // للديباغ فقط
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("🚫 CORS BLOCKED:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

// ============ 🔥 فحص الاتصال بقاعدة البيانات ============
app.get("/api/health", async (req, res) => {
  try {
    const [result] = await db.query("SELECT 1");
    res.json({
      status: "OK",
      db: "Connected",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: "DB ERROR",
      error: err.message
    });
  }
});

// ============ 🔥 مسارات المستخدمين ============
app.use("/api", userRoutes);

// ============ 🔥 الصفحة الرئيسية ============
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Livraison Express API - Railway Cloud",
    mysql_host: process.env.MYSQLHOST,
    environment: process.env.NODE_ENV,
    client_url: process.env.CLIENT_URL
  });
});

// ============ 🔥 تشغيل السيرفر ============
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`
=========================================
🚀 Server running in CLOUD MODE (Railway)
🌍 URL: https://determined-mindfulness-production.up.railway.app
📡 API: ${process.env.CLIENT_URL}
🗄  Database Host: ${process.env.MYSQLHOST}
🛢  Database Name: ${process.env.MYSQLDATABASE}
🔐 NODE_ENV: ${process.env.NODE_ENV}
=========================================
  `);
});
