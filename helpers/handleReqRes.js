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

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, "");
  const method = req.method.toUpperCase();
  const queryStringObject = parsedUrl.query;
  const headerObject = req.headers;

  const requestProperties = {
    parsedUrl,
    pathname,
    trimmedPath,
    method,
    queryStringObject,
    headerObject,
  };

  const decoder = new StringDecoder("utf-8");
  var hh = "";
};

module.exports = handler;
