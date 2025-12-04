// This handles requests to the root URL
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.status(200).json({
    message: 'Autodesk Token API',
    version: '1.0.0',
    endpoints: [
      {
        path: '/api/token',
        methods: ['GET', 'POST'],
        description: 'Get Autodesk Forge token'
      }
    ],
    usage: 'GET /api/token to retrieve your token',
    timestamp: new Date().toISOString()
  });
};