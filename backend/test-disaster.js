const axios = require('axios');
const connectDB = require('./config/db');

async function testDisasterIntelligence() {
  await connectDB();
  
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@resqnet.com',
      password: 'AdminPassword123!'
    });
    
    const token = loginRes.data.data.token;
    console.log('Login successful...');

    // 2. Test Disaster Forecast
    console.log('\nTesting Disaster Forecast (Open-Meteo API)...');
    const forecastRes = await axios.get('http://localhost:5000/api/disaster/forecast?lat=37.77&lon=-122.41', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Forecast Data (Summary):', forecastRes.data.data.source, '| Current Temp:', forecastRes.data.data.current.temperature);

    // 3. Test Disaster Analyse (Full Agent Execution with USGS & OpenMeteo + LLM)
    console.log('\nTesting Disaster Agent Analysis (This will take a few seconds as it pulls live data and queries the LLM)...');
    const analyseRes = await axios.post('http://localhost:5000/api/disaster/analyse', {
      location: 'San Francisco, CA'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('\n=== Disaster Agent Response ===\n', JSON.stringify(analyseRes.data, null, 2));
    
  } catch (error) {
    console.error('Test Failed:', error.response?.data || error.message);
  } finally {
    process.exit(0);
  }
}

testDisasterIntelligence();
