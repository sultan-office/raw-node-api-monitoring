/*
 * Title: Real Time Api Monitoring
 * Description: Main page
 * Developer: Ah Sultan
 * Date: 02/Dec/2032
 *
 */

// Dependency
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");

// Module Scaffolding
const app = {};

// Configuration
app.config = {
  port: 3000,
};

// Create Server
app.creteServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`listening to port ${app.config.port}`);
  });
};

// Handle Req Res
app.handleReqRes = handleReqRes;

// Start The Server
app.creteServer();
