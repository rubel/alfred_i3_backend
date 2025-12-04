const axios = require('axios');
const http = require('http');

// Your exact base64 string
const AUTH_BASE64 = 'eWtxQmFWYVF6Rzl5bHFWWWFIVUdBZXFZNWhrZk4zeTRLM1RJNkVQbmprdWxaWG4xOnVOTzJOZ21wTkJEZ1R6YUVBZGNKOXpKRTNhYWhwZDA1dzdpNm5CRVV4SlFpSWpEUjVhMWRZdGRHdFFRcVhBWDg=';

// Simple HTTP server for local testing
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/token' && (req.method === 'GET' || req.method === 'POST')) {
    try {
      const autodeskUrl = 'https://developer.api.autodesk.com/authentication/v2/token';
      const formData = new URLSearchParams();
      formData.append('grant_type', 'client_credentials');
      formData.append('scope', 'data:write data:read bucket:create bucket:delete');

      const response = await axios.post(autodeskUrl, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${AUTH_BASE64}`
        }
      });

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        token: response.data.access_token,
        expires_in: response.data.expires_in,
        timestamp: new Date().toISOString()
      }));

    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({
        success: false,
        error: error.message
      }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Local server running on http://localhost:${PORT}/api/token`);
});