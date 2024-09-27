const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api", // <-- or whatever path segment precedes your server side routes
    createProxyMiddleware({
      target: "http://localhost:5000", // <-- or whatever your proxy endpoint is
      changeOrigin: true,
    }),
  );
};
