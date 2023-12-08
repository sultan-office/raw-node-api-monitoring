/*
* Title: Sample Handler
* Description: Sample Handler Router
* Developer: Ah Sultan
* Date: 02/Dec/2023
*
*/


// Module Scaffolding 
const handler = {}

handler.sampleHandler = (requestProperties, callback) => {
    
    callback("200", {
        message : "this is sample Handler",
    })
}

module.exports = handler