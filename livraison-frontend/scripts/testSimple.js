// scripts/migrationEnhanced.js
const mysql = require('mysql2/promise');

// Firebase imports - نستخدم require لأننا في بيئة Node.js
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// إعدادات Firebase الخاصة بك
const firebaseConfig = {
  apiKey: "AIzaSyB2gSvCF-b2uAZM9j-EQAYs6UKjbRmuxrM",
  authDomain: "livraison-express-f48c3.firebaseapp.com",
  projectId: "livraison-express-f48c3",
  storageBucket: "livraison-express-f48c3.firebasestorage.app",
  messagingSenderId: "1077573560587",
  appId: "1:1077573560587:web:c1a1ffb4cd36f60d605a0e"
};

async function migrateWithFirebase() {
  let mysqlConnection;
  
  try {
    console.log('🚀 بدء النقل إلى Firebase...\n');

    // 1. الاتصال بـ MySQL
    mysqlConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'livraison_db'
    });
    console.log('✅ تم الاتصال بـ MySQL');

    // 2. جلب البيانات
    const [users] = await mysqlConnection.execute('SELECT * FROM utilisateurs');
    console.log(`📊 تم العثور على ${users.length} مستخدم:\n`);

    // 3. عرض البيانات
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nom} (${user.email}) -> ${user.role}`);
    });

    console.log('\n🔄 جاري الاتصال بـ Firebase...');

    // 4. الاتصال بـ Firebase
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    console.log('✅ تم الاتصال بـ Firebase!');

    // 5. نقل البيانات
    console.log('\n📤 جاري نقل البيانات...\n');
    
    for (const user of users) {
      const userData = {
        nom: user.nom,
        email: user.email,
        role: user.role,
        verifie: user.verifie === 1,
        dateCreation: user.date_creation || new Date(),
        telephone: user.telephone || '',
        migratedFromMySQL: true // للإشارة أن البيانات منقولة
      };

      await setDoc(doc(db, 'users', user.email), userData);
      console.log(`✅ تم نقل: ${user.nom} (${user.email})`);
    }

    console.log('\n🎉 تم نقل جميع البيانات بنجاح!');
    console.log('📍 يمكنك التحقق في Firebase Console → Firestore Database');

  } catch (error) {
    console.error('\n❌ حدث خطأ:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('💡 تأكد من اتصال الإنترنت');
    } else if (error.code === 'PERMISSION_DENIED') {
      console.log('💡 تأكد من أن Firestore في وضع Test Mode');
    }
    
  } finally {
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
  }
}

// تشغيل الدالة
migrateWithFirebase();
