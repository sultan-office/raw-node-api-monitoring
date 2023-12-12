/*
 * Title: Check Handler
 * Description: Check Handler Router
 * Developer: Ah Sultan
 * Date: 10/Dec/2023
 *
 */
// Dependency
const { parseJSON, creteRandomString } = require("../helpers/utilities");
const data = require("../lib/data");
const tokenHandler = require("./tokenHandler");
const { maxChecks } = require("../helpers/environments");

// Module Scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethod = ["POST", "PUT", "DELETE", "GET"];

  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._check = {};

// Handle Checks POST
handler._check.POST = (requestProperties, callback) => {
  const bodyProperties = requestProperties.body;

  // Protocol Variable
  const protocol =
    typeof bodyProperties.protocol === "string" &&
    ["http", "https"].indexOf(bodyProperties.protocol) > -1
      ? bodyProperties.protocol
      : false;

  // URL Variable
  const url =
    (typeof bodyProperties.url === "string") & (bodyProperties.url.length > 0)
      ? bodyProperties.url
      : false;

  // Method Variable
  const method =
    typeof bodyProperties.method === "string" &&
    ["POST", "PUT", "DELETE", "GET"].indexOf(bodyProperties.method) > -1
      ? bodyProperties.method
      : false;

  // Success Code Variable
  const successCode =
    typeof bodyProperties.successCode === "object" &&
    bodyProperties.successCode instanceof Array
      ? bodyProperties.successCode
      : false;

  //   Timeout Second Variable
  const timeoutSecond =
    typeof bodyProperties.timeoutSeconds === "number" &&
    bodyProperties.timeoutSeconds % 1 === 0 &&
    bodyProperties.timeoutSeconds > 0 &&
    bodyProperties.timeoutSeconds <= 5
      ? bodyProperties.timeoutSeconds
      : false;

  if (protocol && url && method && successCode && timeoutSecond) {
    const token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;

    // lookup the user phone by reading the token
    data.read("tokens", token, (err1, tData) => {
      const tokenData = { ...parseJSON(tData) };

      if (!err1 && tokenData) {
        // find user
        data.read("users", tokenData.phone, (err2, userData) => {
          const user = { ...parseJSON(userData) };

          if (!err2 && user) {
            // verify token
            tokenHandler._token.verify(token, user.phone, (tokenId) => {
              if (tokenId) {
                // User Check variable
                const userChecks =
                  typeof user.checks === "object" &&
                  user.checks instanceof Array
                    ? user.checks
                    : [];

                if (userChecks.length < maxChecks) {
                  const checkId = creteRandomString(20);
                  const checkObject = {
                    id: checkId,
                    phone: user.phone,
                    protocol,
                    url,
                    method,
                    successCode,
                    timeoutSecond,
                  };

                  data.write("checks", checkId, checkObject, (err3) => {
                    if (!err3) {
                      user.checks = userChecks;
                      user.checks.push(checkId);

                      data.update("users", user.phone, user, (err4) => {
                        if (!err4) {
                          callback(202, checkObject);
                        } else {
                          callback(500, {
                            error: "There was a problem in the server side!",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error: "User has already reached max check limit!",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    error: "User has already reached max check limit!",
                  });
                }
              } else {
                callback(403, {
                  error: "Authentication problem!",
                });
              }
            });
          } else {
            callback("404", {
              error: "user not found",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication problem!",
        });
      }
    });
  } else {
    callback(400, {
      error: "you have a problem in your request",
    });
  }
};

// Handle Checks
handler._check.GET = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    data.read("checks", id, (err1, checkData) => {
      const checkObject = { ...parseJSON(checkData) };

      if (!err1 && checkObject) {
        const token =
          typeof requestProperties.headerObject.token === "string"
            ? requestProperties.headerObject.token
            : false;

        tokenHandler._token.verify(token, checkObject.phone, (tokenId) => {
          if (tokenId) {
            callback(202, checkObject);
          } else {
            callback(403, {
              error: "Authentication failure!",
            });
          }
        });
      } else {
        callback(500, {
          error: "requested check not found",
        });
      }
    });
  } else {
    callback(400, {
      error: "you have problem in your request",
    });
  }
};

// Handle Checks
handler._check.PUT = (requestProperties, callback) => {
  const bodyProperties = requestProperties.body;
  // Protocol Variable
  const protocol =
    typeof bodyProperties.protocol === "string" &&
    ["http", "https"].indexOf(bodyProperties.protocol) > -1
      ? bodyProperties.protocol
      : false;

  // URL Variable
  const url =
    (typeof bodyProperties.url === "string") & (bodyProperties.url.length > 0)
      ? bodyProperties.url
      : false;

  // Method Variable
  const method =
    typeof bodyProperties.method === "string" &&
    ["POST", "PUT", "DELETE", "GET"].indexOf(bodyProperties.method) > -1
      ? bodyProperties.method
      : false;

  // Success Code Variable
  const successCode =
    typeof bodyProperties.successCode === "object" &&
    bodyProperties.successCode instanceof Array
      ? bodyProperties.successCode
      : false;

  //   Timeout Second Variable
  const timeoutSecond =
    typeof bodyProperties.timeoutSeconds === "number" &&
    bodyProperties.timeoutSeconds % 1 === 0 &&
    bodyProperties.timeoutSeconds > 0 &&
    bodyProperties.timeoutSeconds <= 5
      ? bodyProperties.timeoutSeconds
      : false;

  // id variable
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  // read checks
  if (id) {
    if (protocol || url || method || successCode || timeoutSecond) {
      data.read("checks", id, (err1, checkData) => {
        const checkObject = { ...parseJSON(checkData) };

        if (!err1 && checkObject) {
          // Token Variable
          const token =
            typeof requestProperties.headerObject.token === "string" &&
            requestProperties.headerObject.token.trim().length > 0
              ? requestProperties.headerObject.token
              : false;

          tokenHandler._token.verify(token, checkObject.phone, (tokenId) => {
            if (tokenId) {
              if (protocol) {
                checkObject.protocol = protocol;
              }

              if (url) {
                checkObject.url = url;
              }

              if (method) {
                checkObject.method = method;
              }
              if (successCode) {
                checkObject.successCode = successCode;
              }

              if (protocol) {
                checkObject.timeoutSecond = timeoutSecond;
              }

              data.update("checks", id, checkObject, (err2) => {
                if (!err2) {
                  callback(202, {
                    error: "Checks updated successfully ",
                  });
                } else {
                  callback(500, {
                    error: "There was a server side error!",
                  });
                }
              });
            } else {
              callback(403, {
                error: "Authentication error!",
              });
            }
          });
        } else {
          callback(500, {
            error: "There was problem in your server side request",
          });
        }
      });
    } else {
      callback(400, { error: "you must provide at least on filed to update" });
    }
  } else {
    callback(400, { error: "you have a problem in your request" });
  }
};

// Handle Checks
handler._check.DELETE = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length
      ? requestProperties.queryStringObject.id
      : false;

  // Lookup Data
  data.read("checks", id, (err1, checkData) => {
    const checkObject = { ...parseJSON(checkData) };
    if (!err1 && checkObject) {
      const token =
        typeof requestProperties.headerObject.token === "string" &&
        requestProperties.headerObject.token.trim().length > 0
          ? requestProperties.headerObject.token
          : false;

      tokenHandler._token.verify(token, checkObject.phone, (tokenId) => {
        if (tokenId) {
          const userPhone = checkObject.phone;

          // delete Checks
          data.delete("checks", id, (err2) => {
            if (!err2) {
              // Lookup user
              data.read("users", userPhone, (err3, userData) => {
                const userObject = { ...parseJSON(userData) };
                const userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (!err3 && userObject) {
                  const findCheckIndex = userObject.checks.indexOf(id);
                  userChecks.splice(findCheckIndex, 1);
                  userObject.checks = userChecks;

                  // Update users
                  data.update("users", userPhone, userObject, (err4) => {
                    if (!err4) {
                      callback(200, {
                        message: "Checks deleted successfully",
                      });
                    } else {
                      callback(503, {
                        error: "there was server side problem",
                      });
                    }
                  });
                } else {
                  callback(404, {
                    error: "you have problem in your request. user not found",
                  });
                }
              });
            } else {
              callback(403, {
                error: "checks didn't Delete successfully. Please try again",
              });
            }
          });
        } else {
          callback(500, {
            error: "Authentication Problem",
          });
        }
      });
    } else {
      callback(400, {
        error: "you have a problem in you request",
      });
    }
  });
};

module.exports = handler;
