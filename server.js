// Listen on host & port from environment (Render compatible)
var host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 8080;

var cors_proxy = require('./lib/cors-anywhere');

cors_proxy.createServer({

  originBlacklist: [],   // No blacklist
  originWhitelist: [],   // Allow all origins
  requireHeader: [],     // Do NOT require Origin or X-Requested-With
  removeHeaders: [],     // Do NOT remove any headers
  credentialsRequired: false,

}).listen(port, host, function() {
  console.log('CORS Anywhere running on ' + host + ':' + port);
});
