const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://192.168.88.180:8000',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
    })
  );
};
