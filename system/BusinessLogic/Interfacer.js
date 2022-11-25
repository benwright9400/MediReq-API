const database = require("./../Data/Data");

//elderly person
async function createElderlyPerson(fullName, address, postCode, dateOfBirth, TandCs) {
    let result = await database.createElderlyPerson(fullName, address, postCode, dateOfBirth, TandCs);
    return result;
}
module.exports.createElderlyPerson = createElderlyPerson;

async function addMedicalRequest(userId) {
    let result = await database.addMedicalRequest(userId); //evals to false or _id for object

    if(result === false) {
        let i = 0;
        while(i < 2 && result === false) {
            result = await database.addMedicalRequest(userId);
            i++;
        }
    }

    return result;
}

module.exports.addMedicalRequest = addMedicalRequest;

async function addMedicalRequestDetails(requestId, furtherInfo) {
    let result = await database.addFurtherInfo(requestId, furtherInfo);

    if(result === false) {
        let i = 0;
        while(i < 2 && result === false) {
            result = await database.addFurtherInfo(requestId, furtherInfo);
        }
    }

    return result;
}

module.exports.addMedicalRequestDetails = addMedicalRequestDetails;

async function addSubjectAccessRequest(userId) {
    let result = await database.addSubjectAccessRequest(userId);

    if(result === false) {
        let i = 0;
        while(i < 2 && result === false) {
            result = await database.addSubjectAccessRequest(userId);
        }
    }

    return result;
}

module.exports.addSubjectAccessRequest = addSubjectAccessRequest;

async function acceptTCs(userId) {
    let result = await database.acceptTandCs(userId);

    if(result === false) {
        let i = 0;
        while(i < 2 && result === false) {
            result = await database.acceptTandCs(userId);
        }
    }

    return result;
}

module.exports.acceptTCs = acceptTCs;

async function stopTCs(userId) {
    let result = await database.stopTandCs(userId);

    if(result === false) {
        let i = 0;
        while(i < 2 && result === false) {
            result = await database.stopTandCs(userId);
        }
    }

    return result;
}

module.exports.stopTCs = stopTCs;

//TPS decision maker
async function getAnonymisedRegionalData() {
    //need to make anonymiser function
}

module.exports.getAnonymisedRegionalData = getAnonymisedRegionalData;

//TPS manager
async function getRegionalData(region) {
    let result = await database.getAllCurrentMedicalRequestsByRegion(region);

    if(result === false) {
        let i = 0;
        while(i < 2 && result === false) {
            result = await database.getAllCurrentMedicalRequestsByRegion(region);
        }
    }

    return result;
}

module.exports.getRegionalData = getRegionalData;

async function assignCaseToStaff(caseId, staffId) {
    let result = await database.setMediReqHandler(caseId, staffId);

    if(result === false) {
        let i = 0;
        while(i < 2 && result === false) {
            result = await database.setMediReqHandler(caseId, staffId);
        }
    }

    return result;
}

module.exports.assignCaseToStaff = assignCaseToStaff;

async function getStaff(organisationId) {
    let result = await database.getOrganisationStaffIds(organisationId);

    if(result === false) {
        let i = 0;
        while(i < 2 && result === false) {
            result = await database.getOrganisationStaffIds(organisationId);
        }
    }

    return result;
}

module.exports.getStaff = getStaff;

//TPS Staff
async function getStaffCases(staffId) {
    let result = await database.getAllCurrentCasesByHandler(staffId);

    if(result === false) {
        let i = 0;
        while(i < 2 && result === false) {
            result = await database.getAllCurrentCasesByHandler(staffId);
        }
    }

    return result;
}

module.exports.getStaffCases = getStaffCases;

//System adminsitrator
async function createOrganisation(name, region, permissions) {
    let result = await database.createOrganisation(name, region, permissions);
    if(result === false) {
        let i = 0;
        while(i < 2 && result === false) {
            result = await database.createOrganisation(name, region, permissions);
        }
    }

    return result;
}

module.exports.createOrganisation = createOrganisation;