const axios = require('axios');
const connectDB = require('./config/db');
const User = require('./models/User');
const Responder = require('./models/Responder');

async function testRescueAgent() {
  await connectDB();
  
  try {
    // 0. Seed a test user and responder so it actually finds one
    let testUser = await User.findOne({ email: 'rescue_hero@resqnet.com' });
    if (!testUser) {
        testUser = await User.create({
            name: 'John Rescue',
            email: 'rescue_hero@resqnet.com',
            password: 'Password123!',
            role: 'Responder',
            phone: '555-911-0000'
        });
    }

    const testResponder = await Responder.findOneAndUpdate(
      { user: testUser._id },
      {
        user: testUser._id,
        department: 'Medical Rescue',
        status: 'Available',
        currentLocation: { latitude: 37.76, longitude: -122.40 } // Nearby coordinates
      },
      { upsert: true, new: true }
    );
    console.log('Test available responder seeded.');

    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@resqnet.com',
      password: 'AdminPassword123!'
    });
    
    const token = loginRes.data.data.token;
    console.log('Login successful...');

    // 2. Test Commander calling Rescue Agent directly (Since we don't have endpoints up yet without a restart)
    console.log('\nTesting Commander Agent Orchestrating Rescue...');
    const commanderRes = await axios.post('http://localhost:5000/api/commander/chat', {
      message: 'I need a rescue team at 37.77, -122.41 for a Medical Emergency immediately!'
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

testRescueAgent();
