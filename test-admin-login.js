// A simple script to test if the admin login page is accessible
const http = require('http');

console.log('Testing admin login page accessibility...');

// Function to make an HTTP request
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Test the admin login page
async function testAdminLogin() {
  try {
    console.log('Requesting /admin/login...');
    const response = await makeRequest('/admin/login');
    
    console.log(`Status code: ${response.statusCode}`);
    console.log(`Content type: ${response.headers['content-type']}`);
    
    if (response.statusCode === 200) {
      console.log('Admin login page is accessible!');
      return true;
    } else {
      console.log('Admin login page returned a non-200 status code.');
      return false;
    }
  } catch (error) {
    console.error('Error testing admin login page:', error);
    return false;
  }
}

// Run the test
testAdminLogin()
  .then(success => {
    if (success) {
      console.log('Test passed!');
    } else {
      console.log('Test failed!');
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
  });
