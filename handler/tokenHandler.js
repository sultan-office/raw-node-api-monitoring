/*
 * Title: Token Handler
 * Description: Token Control Handler Router
 * Developer: Ah Sultan
 * Date: 10/Dec/2023
 *
 */

// Dependency
const { hash, parseJSON, creteRandomString } = require("../helpers/utilities");
const data = require("../lib/data");

// Module Scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethod = ["POST", "PUT", "GET", "DELETE"];

  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(500, {
      error: "there was a server side problem",
    });
  }
};

handler._token = {};

// Handle  Token POST
handler._token.POST = (requestProperties, callback) => {
  const bodyProperties = requestProperties.body;

  //   Phone Name Variable
  const phone =
    typeof bodyProperties.phone === "string" &&
    bodyProperties.phone.trim().length === 11
      ? bodyProperties.phone
      : false;

  //   Password Variable
  const password =
    typeof bodyProperties.password === "string" &&
    bodyProperties.password.trim().length > 5
      ? bodyProperties.password
      : false;

  if (phone && password) {
    
    data.read("users", phone, (err1, userData) => {
      const hashedPassword = hash(password);
      const user = { ...parseJSON(userData) };
      if (hashedPassword === user.password) {
        if (!err1) {
          const tokenId = creteRandomString(20);
          const expire = Date.now() + 60 * 60 * 1000;

          const tokenObject = {
            id: tokenId,
            expire,
            phone,
          };
          // Store the Token ID
          data.write("tokens", tokenId, tokenObject, (err2) => {
            if (!err2) {
              callback(200, tokenObject);
            } else {
              callback(500, {
                error: "There was a problem in server side",
              });
            }
          });
        } else {
          callback(404, {
            error: "your requested user not found",
          });
        }
      } else {
        callback(400, {
          error: "password is not valid",
        });
      }
    });
  } else {
    callback(400, {
      error: "you have problem in your requested",
    });
  }
};

// Handle Token GET
handler._token.GET = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length > 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    data.read("tokens", id, (err1, tokenData) => {
      const token = { ...parseJSON(tokenData) };

      if (!err1 && token) {
        callback(202, token);
      } else {
        callback(404, {
          error: "token not found",
        });
      }
    });
  } else {
    callback(404, {
      error: "requested url was not found",
    });
  }
};

// Handle token put
handler._token.PUT = (requestProperties, callback) => {
  // id variable
  const id =
    typeof requestProperties.queryStringObject.id &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  //   extend variable
  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
      ? requestProperties.body.extend
      : false;

  if (id && extend) {
    // Read token Data
    data.read("tokens", id, (err1, tokenData) => {
      const tokenObject = { ...parseJSON(tokenData) };

      if (!err1 && tokenObject && tokenObject.expire > Date.now()) {
        tokenObject.expire = Date.now() + 60 * 60 * 1000;

        // Store token data
        data.update("tokens", id, tokenObject, (err2) => {
          if (!err2) {
            callback(202, tokenObject);
          } else {
            callback(501, {
              error: "Token did Not update success fully",
            });
          }
        });
      } else {
        callback(404, {
          error: "your requested tokens not found",
        });
      }
    });
  } else {
    callback(400, {
      error: "there was a problem in your request",
    });
  }
};

// Handle delete token
handler._token.DELETE = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  data.delete("tokens", id, (err) => {
    if (!err) {
      callback(203, {
        message: "token deleted successfully",
      });
    } else {
      callback(500, {
        error: "there was server side problem",
      });
    }
  });
};

// Handle token very
handler._token.verify = (id, phone, callback) => {

    data.read("tokens", id, (err1, tokenData) => {
        const token = {...parseJSON(tokenData)}


        if(!err1 && token){

            if(token.phone === phone && token.expire > Date.now()){
                callback(token.id)
            }else{
                callback(false)
            }

        }else{
            callback(false)
        }
    })  
}

module.exports = handler;
