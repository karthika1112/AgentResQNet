const axios = require('axios');
const connectDB = require('./config/db');
const User = require('./models/User');
const Shelter = require('./models/Shelter');
const ResourceInventory = require('./models/ResourceInventory');
const Volunteer = require('./models/Volunteer');

async function testResourceAgent() {
  await connectDB();
  
  try {
    // 0. Seed test data
    const shelter = await Shelter.findOneAndUpdate(
        { name: 'Central Warehouse' },
        { name: 'Central Warehouse', address: 'HQ', latitude: 37.78, longitude: -122.42, capacity: 1000, status: 'Open' },
        { upsert: true, new: true }
    );

    const inventory = await ResourceInventory.findOneAndUpdate(
        { warehouse: shelter._id },
        { warehouse: shelter._id, food: 1000, water: 1000, medicine: 500, blankets: 200 },
        { upsert: true, new: true }
    );

    let testUser = await User.findOne({ email: 'volunteer_hero@resqnet.com' });
    if (!testUser) {
        testUser = await User.create({
            name: 'Jane Volunteer',
            email: 'volunteer_hero@resqnet.com',
            password: 'Password123!',
            role: 'Volunteer',
            phone: '555-555-0000'
        });
    }

    await Volunteer.findOneAndUpdate(
        { user: testUser._id },
        { user: testUser._id, availability: true, currentLocation: { latitude: 37.76, longitude: -122.40 } },
        { upsert: true, new: true }
    );

    console.log('Test warehouse, inventory, and volunteer seeded.');

    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@resqnet.com',
      password: 'AdminPassword123!'
    });
    
    const token = loginRes.data.data.token;
    console.log('Login successful...');

    // 2. Test Resource Command Agent API
    console.log('\nTesting Resource Request API (Requesting 50 food, 100 water)...');
    const reqRes = await axios.post('http://localhost:5000/api/resources/request', {
      lat: 37.77,
      lon: -122.41,
      requiredResources: { food: 50, water: 100 },
      incidentSeverity: 'High',
      victimCount: 20
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('\n=== Resource Request Response ===\n', JSON.stringify(reqRes.data, null, 2));

    // 3. Test Commander calling Resource Agent
    console.log('\nTesting Commander Agent Orchestrating Resources...');
    const commanderRes = await axios.post('http://localhost:5000/api/commander/chat', {
      message: 'We need food and water for 50 people at 37.77, -122.41 urgently!'
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

testResourceAgent();
