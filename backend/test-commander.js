const axios = require('axios');
const connectDB = require('./config/db');

async function testCommander() {
  await connectDB();
  
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@resqnet.com',
      password: 'AdminPassword123!'
    });
    
    const token = loginRes.data.data.token;
    console.log('Login successful, asking Commander...');

    // 2. Test Commander Chat
    const chatRes = await axios.post('http://localhost:5000/api/commander/chat', {
      message: 'There is a massive flood in sector 7, I need to evacuate immediately!'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('\n=== Commander Response JSON ===\n', JSON.stringify(chatRes.data, null, 2));
    
  } catch (error) {
    console.error('Test Failed:', error.response?.data || error.message);
  } finally {
    process.exit(0);
  }
}

testCommander();
