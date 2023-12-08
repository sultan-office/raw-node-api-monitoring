/*
* Title: Routes
* Description: Application Root Router
* Developer: Ah Sultan
* Date: 02/Dec/2023
*
*/

// dependency 
const {sampleHandler} = require('./handler/sampleHandler')
const {userHandler} = require('./handler/userHandler')
// Module Scaffolding
const routes = {
    sample : sampleHandler,
    user : userHandler
};

module.exports = routes;