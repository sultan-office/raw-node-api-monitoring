/*
* Title: Not Found Handler
* Description: Handle Not Found Routes
* Developer: Ah Sultan
* Date: 07/Dec/2023
*
*/

// Module Scaffolding
const handler = {}

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message : "!opps, your requested URL not found"
    })
}

module.exports = handler