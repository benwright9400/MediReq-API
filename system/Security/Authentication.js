const logger = require("./../Security/Logging");
const database = require("./../Data/Data");
const authorisor = require("./Authorisation");

async function assertExists(type, data, context) {
    if(type === authorisor.ELDERLY_PERSON) {
        const result = await assertElderlyPersonExists(data.fullName, data.addrFirstLine, data.postCode, data.dateOfBirth, data.id);
        if(result === false) logFailedAuth(data, context);
        return result;
    } else if (type === authorisor.TPS_STAFF) {
        const result = await assertTPSStaffExists(...data);
        if(result === false) logFailedAuth(data, context);
        return result;
    } else {
        logFailedAuth(data, context);
        return false;
    }
}

module.exports.assertExists = assertExists;

async function assertElderlyPersonExists(fullName, addrFirstLine, postCode, dateOfBirth, id) {
    const result = await database.assertElderlyPersonByExists(fullName, addrFirstLine, postCode, dateOfBirth, id);

    // const result = await database.findElderlyPersonById(id);

    console.log(result);

    if(result === false) {
        return false;
    }

    // if(result.length != 6) { //6 = no. keys in returned object
    //     return false;
    // }

    return result._id;
}

async function assertTPSStaffExists(organisationId, type, email, fName, lName, permission) {
    const result = await database.findStaff(organisationId, type, email, fName, lName, permission);

    if(result === false) {
        return false;
    }

    if(result.length != 6) { //6 = no. keys in returned object
        return false;
    }

    return result._id;
}

async function logFailedAuth(data, context) {
    let stringData = JSON.stringify(data);
    logger.logConcerningEvent(stringData, context.ip, context.requestType, "Account does not exist");
}