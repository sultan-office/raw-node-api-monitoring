/*
 * Title: Utilities
 * Description: Our own created library
 * Developer: Ah Sultan
 * Date: 08/Dec/2023
 *
 */

// Dependency
const crypto = require("crypto");
const environments = require("./environments");

// Module Scaffolding
const utilities = {};

// Hash Generator
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const generateHash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(str)
      .digest("hex");

    return generateHash;
  }
};

// Parse Json
utilities.parseJSON = (jsonString) => {
  let output;

  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    output = {};
  }

  return output;
};

// Random String Generator
utilities.creteRandomString = (lengthNum) => {
  const strLength =
    typeof lengthNum === "number" && lengthNum ? lengthNum : false;

  if (strLength) {
    let output = "";
    const possibleCharacters = "abcdefghijklmnopqrstuvwxyz1234567890";

    for (i = 0; i < strLength; i++) {
      const getRandomChr = possibleCharacters.charAt(
        Math.round(Math.random() * possibleCharacters.length)
      );
      

      output += getRandomChr;

    }
    return output;
  } else {
    return false;
  }
};

// Export Utilities
module.exports = utilities;
