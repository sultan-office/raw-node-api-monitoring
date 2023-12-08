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
const environment = require("./helpers/environments");
const lib = require("./lib/data");

// Module Scaffolding
const app = {};


// Create Server
app.creteServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log(`listening to port ${environment.port}`);
  });
};

// Handle Req Res
app.handleReqRes = handleReqRes;

// Start The Server
app.creteServer();

