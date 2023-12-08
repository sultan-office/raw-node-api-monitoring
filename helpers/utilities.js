/*
 * Title: Utilities 
 * Description: Our own created library
 * Developer: Ah Sultan
 * Date: 08/Dec/2023
 *
 */

// Dependency 
const crypto = require('crypto')
const environments = require('./environments')

// Module Scaffolding
const utilities = {}

// Hash Generator
utilities.hash = (str) => {

    if(typeof str === "string" &&  str.length > 0){
        const generateHash = crypto.createHmac("sha256", environments.secretKey).update(str).digest("hex")

        return generateHash;
    }
}

// Parse Json 
utilities.parseJSON = (jsonString) => {

    let output;


    try {
        output = JSON.parse(jsonString)
    } catch (error) {
        output = {}
        console.log(error)
    }

    return output
}


// Export Utilities
module.exports = utilities