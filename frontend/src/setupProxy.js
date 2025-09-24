const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',  
    createProxyMiddleware({
      target: 'https://extract-id-bot.onrender.com',
      changeOrigin: true,
    })
  );
};