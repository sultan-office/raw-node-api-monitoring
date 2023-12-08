/*
 * Title: User Handler
 * Description: User Handler Route
 * Developer: Ah Sultan
 * Date: 02/Dec/2032
 *
 */

// Dependency
const data = require("../lib/data");
const { hash, parseJSON } = require("../helpers/utilities");

// Module Scaffolding
const handler = {};

// user Handler Function
handler.userHandler = (requestProperties, callback) => {
  const acceptedMethod = ["GET", "POST", "PUT", "DELETE"];

  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

// Handler for POST method
handler._users.POST = (requestProperties, callback) => {
  const bodyProperties = requestProperties.body;

  //   First Name Variable
  const firstName =
    typeof bodyProperties.firstName === "string" &&
    bodyProperties.firstName.trim().length > 0
      ? bodyProperties.firstName
      : false;

  //   Last Name Variable
  const lastName =
    typeof bodyProperties.lastName === "string" &&
    bodyProperties.lastName.trim().length > 0
      ? bodyProperties.lastName
      : false;

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

  //   Tos Agreement Variable
  const tosAgreement =
    typeof bodyProperties.tosAgreement === "boolean" &&
    bodyProperties.tosAgreement
      ? bodyProperties.tosAgreement
      : false;

  if (firstName && lastName && phone && password) {
    // make sure the user doesn't exit
    data.read("users", phone, (err1) => {
      const userObject = {
        firstName,
        lastName,
        phone,
        password: hash(password),
        tosAgreement,
      };

      if (err1) {
        data.write("users", phone, userObject, (err2) => {
          if (!err2) {
            callback(200, {
              message: "User created successfully",
            });
          } else {
            callback(500, {
              error: "user not created successfully",
            });
          }
        });
      } else {
        callback(500, {
          error: "there was a problem in server side. user may be exist",
        });
      }
    });
  } else {
    callback(500, {
      error: `you have problem in your request`,
    });
  }
};

// Handler for GET method
handler._users.GET = (requestProperties, callback) => {
  // Verified phone number
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    data.read("users", phone, (err1, userData) => {
      const user = { ...parseJSON(userData) };
      if (!err1 && user) {
        delete user.password;
        callback(200, user);
      } else {
        callback(404, {
          error: "requested users not found in data base",
        });
      }
    });
  } else {
    callback(404, {
      error: "requested users not found",
    });
  }
};

// Export Handler
module.exports = handler;
