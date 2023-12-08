/*
 * Title: Environments
 * Description: Handle all environment related things
 * Developer: Ah Sultan
 * Date: 07/Dev/2023
 *
 */


// Module Scaffolding;
const environments = {} 

// Staging Environments
environments.staging = {
    port : 3000,
    envName : "staging",
    secretKey: 'hsjdhsdhsjdhjshdjshd',
};

// Production Environments
environments.production = {
    port : 5000,
    envName : "production",
    secretKey: 'tryghfghgfdhhvff67586^^',
}

// Deter mind which
const currentEnvironment = typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging"

// Export Corresponding Environment Object
const environmentToExport = typeof environments[currentEnvironment] === "object" ? environments[currentEnvironment] : environments.staging

// Export 
module.exports = environmentToExport