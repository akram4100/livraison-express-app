// test-email.js (ملف جديد)
import emailjs from '@emailjs/nodejs';

const SERVICE_ID = 'service_eupzdew';
const TEMPLATE_ID = 'template_o9owsdl';
const PUBLIC_KEY = '3M5sZiQlW-9GlSWAo';
const PRIVATE_KEY = 'aIWUdISv0EO9fQhvyM3aP';

async function testDirectEmailJS() {
  try {
    console.log('🚀 Testing EmailJS directly...');
    
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: 'your-email@gmail.com',
        subject: 'Direct Test',
        name: 'Test User',
        user_name: 'Test User',
        username: 'Test User',
        code: '123456',
        otp_code: '123456',
        code_otp: '123456'
      },
      {
        publicKey: PUBLIC_KEY,
        privateKey: PRIVATE_KEY,
      }
    );
    
    console.log('✅ SUCCESS:', result);
    return result;
  } catch (error) {
    console.log('❌ ERROR:', error);
    return error;
  }
}

testDirectEmailJS();