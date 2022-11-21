//Bcrypt for hashing
const logger = require("./../Security/Logging");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function hashMatches(text, existingHash, context) {
    const passwordMatches = bcrypt.hash(text, saltRounds, (err, hash) => {
        if(err) {
            logFailedHash(context);
            return false;
        }

        if(hash === existingHash) {
            return true;
        } else {
            logFailedHash(context);
            return false;
        }
    });

    //check timing of .hash function
    return passwordMatches;
}

module.exports.hashMatches = hashMatches;

async function logFailedHash(context) {
    logger.logConcerningEvent(context.ip, context.ip, context.requestType, "Failed hash");
}

