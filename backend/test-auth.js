const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test',
      email: 'unique_user_' + Date.now() + '@test.com',
      password: 'Password123!'
    });
    console.log('SUCCESS:', res.data);
  } catch (err) {
    console.log('ERROR:', err.response?.data);
  }
}
test();
