const PROXY_CONFIG = [
  {
    context: ['/api/**'],
    target: 'http://localhost:3000',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/api': '', // Remove /api prefix before forwarding to backend
    },
    onProxyReq: function (proxyReq, req, res) {
      const timestamp = new Date().toISOString();
      console.log(`\n🔀 [${timestamp}] PROXY REQUEST:`);
      console.log(`   Method: ${req.method}`);
      console.log(`   Original URL: ${req.originalUrl || req.url}`);
      console.log(
        `   Rewritten URL: ${(req.originalUrl || req.url).replace(/^\/api/, '')}`
      );
      console.log(
        `   Target: http://localhost:3000${(req.originalUrl || req.url).replace(/^\/api/, '')}`
      );
    },
    onProxyRes: function (proxyRes, req, res) {
      const timestamp = new Date().toISOString();
      console.log(`\n✅ [${timestamp}] PROXY RESPONSE:`);
      console.log(`   Status: ${proxyRes.statusCode}`);
      console.log(`   For: ${req.method} ${req.originalUrl || req.url}`);
    },
    onError: function (err, req, res) {
      const timestamp = new Date().toISOString();
      console.error(`\n❌ [${timestamp}] PROXY ERROR:`);
      console.error(`   Message: ${err.message}`);
      console.error(`   For: ${req.method} ${req.originalUrl || req.url}`);
    },
  },
];

module.exports = PROXY_CONFIG;
