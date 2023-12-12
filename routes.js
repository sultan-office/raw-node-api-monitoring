/*
* Title: Routes
* Description: Application Root Router
* Developer: Ah Sultan
* Date: 02/Dec/2023
*
*/

// dependency 
const {sampleHandler} = require('./handler/sampleHandler');
const { tokenHandler } = require('./handler/tokenHandler');
const {userHandler} = require('./handler/userHandler')
const {checkHandler} = require('./handler/checkHandler')
// Module Scaffolding
const routes = {
    sample : sampleHandler,
    user : userHandler,
    token : tokenHandler,
    check : checkHandler,
};

module.exports = routes;