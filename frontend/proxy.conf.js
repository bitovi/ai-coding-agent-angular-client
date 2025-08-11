const PROXY_CONFIG = [
  {
    context: ['/api/**'],
    target: 'http://localhost:3100',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: function (proxyReq, req, res) {
      const timestamp = new Date().toISOString();
      console.log(`\n🔀 [${timestamp}] PROXY REQUEST:`);
      console.log(`   Method: ${req.method}`);
      console.log(`   URL: ${req.originalUrl || req.url}`);
      console.log(
        `   Target: http://localhost:3100${req.originalUrl || req.url}`
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
