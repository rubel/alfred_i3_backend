const axios = require('axios');

// Your exact base64 string from the curl command
const AUTH_BASE64 = 'eWtxQmFWYVF6Rzl5bHFWWWFIVUdBZXFZNWhrZk4zeTRLM1RJNkVQbmprdWxaWG4xOnVOTzJOZ21wTkJEZ1R6YUVBZGNKOXpKRTNhYWhwZDA1dzdpNm5CRVV4SlFpSWpEUjVhMWRZdGRHdFFRcVhBWDg=';

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Autodesk API endpoint
    const autodeskUrl = 'https://developer.api.autodesk.com/authentication/v2/token';

    // Prepare the form data
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('scope', 'data:write data:read bucket:create bucket:delete');

    // Make the request to Autodesk API
    const response = await axios.post(autodeskUrl, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${AUTH_BASE64}`
      },
      timeout: 10000
    });

    // Return the token with CORS headers
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.json({
      success: true,
      token: response.data.access_token,
      expires_in: response.data.expires_in,
      token_type: response.data.token_type,
      scope: response.data.scope,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching token:', error.message);
    
    let statusCode = 500;
    let errorMessage = 'Failed to fetch token from Autodesk API';

    if (error.response) {
      statusCode = error.response.status;
      errorMessage = error.response.data || error.message;
    } else if (error.request) {
      errorMessage = 'No response received from Autodesk API';
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
};