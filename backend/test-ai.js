const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

async function testAI() {
  await connectDB();
  const admin = await User.findOne({ email: 'admin@resqnet.com' });
  
  if (!admin) {
    console.error('Admin not found!');
    process.exit(1);
  }

  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@resqnet.com',
      password: 'AdminPassword123!'
    });
    
    const token = loginRes.data.data.token;
    console.log('Login successful, testing AI Health...');

    // 2. Test Health API
    const healthRes = await axios.get('http://localhost:5000/api/ai/health', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('\n=== AI Health Response ===\n', healthRes.data);

    // 3. Test Prompt API
    console.log('\nTesting AI Prompt Generation...');
    const testRes = await axios.post('http://localhost:5000/api/ai/test', {
      message: 'Hello, this is a system diagnostic test.'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('\n=== AI Test Response ===\n', testRes.data);
    
  } catch (error) {
    console.error('Test Failed:', error.response?.data || error.message);
  } finally {
    process.exit(0);
  }
}

testAI();
