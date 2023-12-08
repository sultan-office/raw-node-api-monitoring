/*
 * Title: Handle Req Res
 * Description: Handle Request and Responsive
 * Developer: Ah Sultan
 * Date: 02/Dev/2023
 *
 */

// Dependency
const { StringDecoder } = require("string_decoder");
const url = require("url");
const routes = require("../routes");
const { notFoundHandler } = require("../handler/notFoundHandler");
const { parseJSON } = require("./utilities");

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, "");
  const method = req.method.toUpperCase();
  const queryStringObject = parsedUrl.query;
  const headerObject = req.headers;

  // Request Properties Object
  const requestProperties = {
    parsedUrl,
    pathname,
    trimmedPath,
    method,
    queryStringObject,
    headerObject,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";


  const chooseHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);

  });



  req.on("end", (buffer) => {
    realData += decoder.end(buffer);
  
    requestProperties.body =parseJSON(realData)

    chooseHandler(requestProperties, (statusCode, payload) => {
      const getStatusCode = typeof statusCode === "number" ? statusCode : 500;
      const getPayload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(getPayload);

      // return the final response
      res.setHeader("content-type", "application/json");
      res.writeHead(getStatusCode);
      res.end(payloadString);
    });
  });
};

module.exports = handler;
