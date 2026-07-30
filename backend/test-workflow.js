const axios = require('axios');
const connectDB = require('./config/db');

async function testWorkflowEngine() {
  await connectDB();
  
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@resqnet.com',
      password: 'AdminPassword123!'
    });
    
    const token = loginRes.data.data.token;
    console.log('Login successful...');

    // 2. Test Workflow Engine directly
    console.log('\nTesting Workflow Engine with FLOOD intent...');
    const reqRes = await axios.post('http://localhost:5000/api/workflow/run', {
      intent: 'FLOOD',
      context: { lat: 37.77, lon: -122.41, requiredResources: { food: 50 }, category: 'Flood', incidentSeverity: 'Critical' }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('\n=== Workflow Run Response ===\n', JSON.stringify(reqRes.data, null, 2));

    // 3. Test Commander Route
    console.log('\nTesting Commander Agent Orchestrating Workflow...');
    const commanderRes = await axios.post('http://localhost:5000/api/commander/chat', {
      message: 'There is a massive flood at 37.77, -122.41, we need evacuation, rescue, and resources immediately!'
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

testWorkflowEngine();
