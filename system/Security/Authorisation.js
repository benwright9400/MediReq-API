const database = require("./../Data/Data");
const logger = require("./../Security/Logging");

//operations
const READ_BULK_DATA = "READ_BULK_DATA";
const READ_REGIONAL_DATA = "READ_REGIONAL_DATA";
const GET_OWN_CASES = "GET_OWN_CASES";
const MAKE_MEDICAL_REQUEST = "MAKE_MEDICAL_REQUEST";
const CHANGE_SYSTEM = "CHANGE_SYSTEM";

module.exports = {
    READ_BULK_DATA: READ_BULK_DATA,
    READ_REGIONAL_DATA: READ_REGIONAL_DATA,
    GET_OWN_CASES: GET_OWN_CASES,
    MAKE_MEDICAL_REQUEST: MAKE_MEDICAL_REQUEST,
    CHANGE_SYSTEM: CHANGE_SYSTEM    
};

//user types
const ELDERLY_PERSON = "ELDERLY_PERSON";
const TPS_STAFF = "TPS_STAFF";
const SYS_ADMIN =  "SYS_ADMIN";

module.exports.ELDERLY_PERSON = ELDERLY_PERSON;
module.exports.TPS_STAFF = TPS_STAFF;
module.exports.SYS_ADMIN = SYS_ADMIN;

async function userCanPerform(operation, id, userType, context) {
    let result;
    if(userType === ELDERLY_PERSON) {
        result = await ElderlyPersonCanPerform(operation);
    } else if(userType === TPS_STAFF) {
        result = await TPSUserCanPerform(operation, id);
    } else {
        result = false;
    }
    if(result === false) logWrongPermission(operation, id, userType, context);

    return result;
}

module.exports.userCanPerform = userCanPerform;

async function ElderlyPersonCanPerform(operation) {
    if(operation === MAKE_MEDICAL_REQUEST) {
        return true;
    }
    return false;
}

async function TPSUserCanPerform(operation, id) {
    const result = await database.findStaffById(id);
    if(result === false) {
        return false;
    }

    if(result.permission === operation) {
        return true;
    }
    return false;
}

async function logWrongPermission(operation, id, userType, context) {
    logger.logConcerningEvent(id + ":" + userType, context.ip, operation, "User does not have this permission");
}