const logger = require("./../Security/Logging");
const database = require("./../Data/Data");

async function assertExists(type, data, context) {
    if(type === "ElderlyPerson") {
        const result = await assertElderlyPersonExists(...data);
        if(result === false) logFailedAuth(data, context);
        return result;
    } else if (type === "TPSStaff") {
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

    if(result === false) {
        return false;
    }

    if(result.length != 6) { //6 = no. keys in returned object
        return false;
    }

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