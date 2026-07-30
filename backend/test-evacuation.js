const axios = require('axios');
const connectDB = require('./config/db');
const Shelter = require('./models/Shelter');

async function testEvacuationAgent() {
  await connectDB();
  
  try {
    // 0. Seed a test shelter so it actually finds one
    const testShelter = await Shelter.findOneAndUpdate(
      { name: 'SF Emergency Shelter Center' },
      {
        name: 'SF Emergency Shelter Center',
        address: '123 Safe St, San Francisco, CA',
        latitude: 37.78, 
        longitude: -122.42,
        capacity: 500,
        occupied: 100,
        availableBeds: 400,
        foodAvailable: true,
        medicalAvailable: true,
        contactNumber: '415-555-0100',
        status: 'Open'
      },
      { upsert: true, new: true }
    );
    console.log('Test shelter seeded.');

    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@resqnet.com',
      password: 'AdminPassword123!'
    });
    
    const token = loginRes.data.data.token;
    console.log('Login successful...');

    // 2. Test Nearest Shelter API
    console.log('\nTesting Nearest Shelter API...');
    const nearestRes = await axios.get('http://localhost:5000/api/evacuation/nearest?lat=37.77&lon=-122.41', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('\n=== Evacuation Response ===\n', JSON.stringify(nearestRes.data, null, 2));

    // 3. Test Commander calling Evacuation Agent
    console.log('\nTesting Commander Agent Orchestrating Evacuation...');
    const commanderRes = await axios.post('http://localhost:5000/api/commander/chat', {
      message: 'I need an evacuation route to the nearest shelter'
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

testEvacuationAgent();
