const mongoose = require("mongoose");
const env = require("../values");

mongoose.connect("mongodb+srv://server:D0Vlk9mIbwI11IQt@medireq0.m7es4pc.mongodb.net/?retryWrites=true&w=majority");

//create model for TPSResponseStaff
const TPSResponseStaff = mongoose.model("Staff", {
    type: String,
    organisationId: String,
    email: String,
    firstName: String,
    lastName: String
});

//create ID for user
const ElderlyPerson = mongoose.model("PatientUser", {
    fullName: String,
    addressFirstLine: String,
    addressPostCode: String,
    dateOfBirth: String,
    TermsAndConditions: Boolean 
});

//create model for request
const MedicalRequest = mongoose.model("MedicalRequest", {
    userId: String,
    furtherInfo: {
        medicalIssue: String
    },
    completed: Boolean,
    dateTime: String,
    addressFirstLine: String,
    addressPostCode: String,
    handler: String
});

//create model for subject access request

const SARRequest = mongoose.model("SAR", {
    userId: String 
});

//create model for organisation account
const Organisation = mongoose.model("Organisation", {
     name: String,
     region: String, //postcode region
     permissions: String,
     staff: [{staffId: String}]
});

//get all previous requests by region
async function getAllPreviousMedicalRequestsByRegion(region) {
    const medicalRequests = MedicalRequest.find({
        addressPostCode: {
            $regex: region,
            $options: "i"
        }
    });

    return medicalRequests;
}

//get all current requests by region
async function getAllCurrentMedicalRequestsByRegion(region) {
    const medicalRequests = MedicalRequest.find({
        addressPostCode: {
            $regex: region,
            $options: "i"
        },
        completed: false
    });

    return medicalRequests;
}

module.exports.getAllCurrentMedicalRequestsByRegion = getAllCurrentMedicalRequestsByRegion;

//get relevant cases
async function getAllCurrentCasesByHandler(handlerId) {
    const medicalRequests = MedicalRequest.find({
        handler: handlerId,
        completed: false
    });

    return medicalRequests;
}

module.exports.getAllCurrentCasesByHandler = getAllCurrentCasesByHandler;

//Add medical request
async function addMedicalRequest(userId) {
    try {
        const user = await ElderlyPerson.findById(userId); //check to see if user exists performed earlier


        const medicalRequest = new MedicalRequest({
            userId: userId, 
            completed: false, 
            dateTime: ((new Date()).toUTCString()),
            addressFirstLine: user.addressFirstLine,
            addressPostCode: user.addressPostCode
        });

        const result = await medicalRequest.save();
        console.log(result);
        
        if(result._id) {
            return result._id;
        }

    } catch (error) {
        return false;
    }
    
    return false;
}

module.exports.addMedicalRequest = addMedicalRequest;

//Add further medical info
async function addFurtherInfo(requestId, medicalIssue) {
    try {
        const medicalRequest = await MedicalRequest.findOneAndUpdate({_id: requestId}, 
            {furtherInfo: {medicalIssue: medicalIssue}}, {new: true});
        
        if(medicalRequest) {
            return true;
        }

    } catch (error) {
        return false;
    }

    return false;
}

module.exports.addFurtherInfo = addFurtherInfo;

async function setMediReqHandler(requestId, handlerId) {
    try {
        const medicalRequest = MedicalRequest.findOneAndUpdate({_id: requestId},
            {handler: handlerId}, {new: true});
        
        if(medicalRequest) {
            return true;
        }

    } catch (error) {
        return false;
    }

    return false;
}

module.exports.setMediReqHandler = setMediReqHandler;

//Add subject access request

async function addSubjectAccessRequest(userId) {
    try {
        const sar = new SARRequest({userId: userId});
        const result = sar.save();

        if(result === {userId: userId}) {
            return true;
        }

    } catch (error) {
        return false;
    }

    return false;
}

module.exports.addSubjectAccessRequest = addSubjectAccessRequest;

//create organisation account
async function createOrganisation(name, region, permissions) {
    try {
        const organisation = new Organisation({
            name: name,
            region: region,
            permissions: permissions
        });

        const result = organisation.save();

        if(result === {name: name,region: region,permissions: permissions}) {
            return true;
        }
    } catch (error) {
        return false;
    }
    
    return false;
}

module.exports.createOrganisation = createOrganisation;



//modify TPS access priviledges
async function updateOrganisationPermissions(organisationId, permissions) {
    try {
        const organisationRequest = await Organisation.findOneAndUpdate({_id: organisationId},
            {permissions: permissions}, {new: true});
        
        if(organisationRequest) {
            return true;
        }
    } catch (error) {
        return false;
    }
    
    return false;
}

//update organisation staff
async function getOrganisationStaffIds(organisationId) {
    try {

        const organisation = await Organisation.find({_id: organisationId});

        if(organisation) {
            return organisation.staff;
        }

    } catch (error) {
        return false;
    }

    return false;
}

module.exports.getOrganisationStaffIds = getOrganisationStaffIds;

//set organisation staff
async function setOrganisationStaff(organisationId, staffArray) {
    try {
        const organisationRequest = await Organisation.findOneAndUpdate({_id: organisationId},
            {staff: staffArray}, {new: true});
        
        if(organisationRequest) {
            return true;
        }
    } catch (error) {
        return false;
    }
    
    return false;
}


//create staff
async function createStaff(organisationId, type, email, fName, lName, permission) {
    try {
        const staff = new TPSResponseStaff({
            type: type,
            organisationId: organisationId,
            email: email,
            firstName: fName,
            lastName: lName,
            permission: permission
        });

        const result = await staff.save();

        if(result === {
            type: type,
            organisationId: organisationId,
            email: email,
            firstName: fName,
            lastName: lName,
            permission: permission
        }) {
            return result._id;
        }
    } catch (error) {
        return false;
    }

    return false;

}

//update staff
async function updateStaff(staffId, updateVariable, updateValue) {
   
    let update;
    if(updateVariable === "type") {
        update = {type: updateValue};
    } else if(updateVariable === "email") {
        update = {email: updateValue};
    } else if (updateVariable === "lName") {
        update = {lName: updateValue};
    } else if (updateVariable === "permission") {
        update = {permission: updateValue};
    } else { // updateVariable === "fName"
        update = {fName: updateValue};
    }


    try {

        const staffRequest = await TPSResponseStaff.findOneAndUpdate({_id: staffId},
            update, {new: true});
        
        if(staffRequest) {
            return true;
        }

    } catch (error) {

        return false;

    }
    
    return false;
}

//get staff member
async function findStaff(organisationId, type, email, fName, lName, permission) {
    try {
        const staffMember = await TPSResponseStaff.find({
            type: type,
            organisationId: organisationId,
            email: email,
            firstName: fName,
            lastName: lName,
            permission: permission
        });
        if(staffMember) {
            return staffMember;
        }
    } catch (error) {
        return false;
    }
    return false;
}

module.exports.findStaff = findStaff;

async function findStaffById(id) {
    try {
        const staffMember = await TPSResponseStaff.findById(id);
        if(staffMember) {
            return staffMember;
        }
    } catch (error) {
        return false;
    }
    return false;
}
module.exports.findStaffById = findStaffById;


//elderley person

// const ElderlyPersona = mongoose.model("PatientUser", {
//     fullName: String,
//     addressFirstLine: String,
//     addressPostCode: String,
//     dateOfBirth: String 
// });

async function createElderlyPerson(fullName, addressFirstLine, addressPostCode, dateOfBirth, TandCs) {
    let newElderlyPerson = new ElderlyPerson({
        fullName: fullName,
        addressFirstLine: addressFirstLine,
        addressPostCode: addressPostCode,
        dateOfBirth: dateOfBirth,
        TermsAndConditions: TandCs
    });


    const result = await newElderlyPerson.save();

    console.log(result);

    if(result._id) {
        return result._id;
    }

    return false;
}

module.exports.createElderlyPerson = createElderlyPerson;

async function findElderlyPersonById(id) {
    try {
        console.log(id);
        let elderlyPerson = await ElderlyPerson.findById(id);

        console.log(elderlyPerson);

        if(elderlyPerson) {
            return elderlyPerson;
        }
    } catch (error) {
        return false;
    }
    return false;   
}

module.exports.findElderlyPersonById = findElderlyPersonById;


async function assertElderlyPersonByExists(fullName, addrFirstLine, postCode, dateOfBirth, id) {
    try {
        let DOCUMENT_ID = id;
        let elderlyPerson = await ElderlyPerson.findOne({
            _id: DOCUMENT_ID,
            fullName: fullName,
            addressFirstLine: addrFirstLine,
            addressPostCode: postCode,
            dateOfBirth: dateOfBirth 
        });

        console.log(elderlyPerson);

        if(elderlyPerson) {
            return elderlyPerson;
        }

    } catch (error) {
        return false;
    }
    return false;   
}

module.exports.assertElderlyPersonByExists = assertElderlyPersonByExists;

async function acceptTandCs(userId) {
    try {
        let elderlyPerson = await ElderlyPerson.findByIdAndUpdate(userId, {
            TermsAndConditions: true
        })

        if(elderlyPerson) {
            return elderlyPerson;
        }
    } catch (error) {
        return false;
    }
    return false;  
}

module.exports.acceptTandCs = acceptTandCs;

async function stopTandCs(userId) {
    try {
        let elderlyPerson = await ElderlyPerson.findByIdAndUpdate(userId, {
            TermsAndConditions: false
        })

        if(elderlyPerson) {
            return elderlyPerson;
        }
    } catch (error) {
        return false;
    }
    return false; 
}

module.exports.stopTandCs = stopTandCs;

//logging
const Log = mongoose.model("Log", {time: String, message: String});

async function createLog(message) {
    const newLog = new Log({
        time: (new Date()).toUTCString(),
        message: message
    });

    const result = newLog.save();

    if(result) {
        return true;
    }

    return false;
}

module.exports.createLog = createLog;