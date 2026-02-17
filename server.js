// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8080;

// Grab the blacklist from the command-line so that we can update the blacklist without deploying
// again. CORS Anywhere is open by design, and this blacklist is not used, except for countering
// immediate abuse (e.g. denial of service). If you want to block all origins except for some,
// use originWhitelist instead.
var originBlacklist = parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
var originWhitelist = parseEnvList(process.env.CORSANYWHERE_WHITELIST);
function parseEnvList(env) {
  if (!env) {
    return [];
  }
  return env.split(',');
}

// Set up rate-limiting to avoid abuse of the public CORS Anywhere server.
var checkRateLimit = require('./lib/rate-limit')(process.env.CORSANYWHERE_RATELIMIT);

var cors_proxy = require('./lib/cors-anywhere');
cors_proxy.createServer({
  // ... your existing config (origin function, whitelist, etc.)

  // Add this: Middleware to inject headers for all proxied requests
  requestMiddleware: function (req, res, next) {
    // Spoof common Astro-allowed headers (adjust as needed)
    req.headers['user-agent'] = 'Mozilla/5.0 (Linux; Android 13; UltraBox Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/136.0.7103.61 Mobile Safari/537.36';
    req.headers['referer'] = 'https://www.astro.com.my/';
    req.headers['origin'] = 'https://www.astro.com.my';  // if needed

    next();
  },

}).listen(port, host, function() {
  console.log('Running CORS Anywhere on ' + host + ':' + port);
});
