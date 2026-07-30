const axios = require('axios');
const connectDB = require('./config/db');

async function testVerificationAgent() {
  await connectDB();
  
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@resqnet.com',
      password: 'AdminPassword123!'
    });
    
    const token = loginRes.data.data.token;
    console.log('Login successful...');

    // 2. Test Verification Agent API (Earthquake in SF)
    console.log('\nTesting Incident Verification API...');
    const verifyRes = await axios.post('http://localhost:5000/api/verification/verify', {
      lat: 37.77,
      lon: -122.41,
      category: 'Earthquake',
      images: ['http://example.com/fake-evidence.jpg']
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('\n=== Verification Response ===\n', JSON.stringify(verifyRes.data, null, 2));

    // 3. Test Commander calling Verification Agent
    console.log('\nTesting Commander Agent Orchestrating Verification...');
    const commanderRes = await axios.post('http://localhost:5000/api/commander/chat', {
      message: 'I want to report an Earthquake near San Francisco!'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('\n=== Commander Response ===\n', JSON.stringify(commanderRes.data, null, 2));

  } catch (error) {
    console.error('Test Failed:', error.response?.data || error.message);
  } finally {
    process.exit(0);
  }
}

testVerificationAgent();
