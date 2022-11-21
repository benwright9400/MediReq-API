const database = require("./../Data/Data");

async function logConcerningEvent(accessingUser, accessingIP, requestType, reason) {
    const message = "User: " + accessingUser + " at IP: " + accessingIP + "failed request: " + requestType + " because " + reason;
    database.createLog(message);
}

module.exports.logConcerningEvent = logConcerningEvent;