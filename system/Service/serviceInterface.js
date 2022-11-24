const express = require("express");
const authenticator = require("./../Security/Authentication");
const authorisor = require("./../Security/Authorisation");
const cryptography = require("./../Security/Cryptography");
const integrityCheck = require("./../Security/IntegrityCheck");

const app = express();

app.listen(3000, () => {
    console.log("server running on port 3000");
});

// elderly person

app.post("/client/medicalRequest", (req, res) => {
    checkSecurity(req, (reqBody) => {
        //success
        if(containsCorrectKeys(reqBody)) {



        } else {
            res.send("invalid request");
        }
    }, () => {
        //failure
        res.send("invalid request");
    });
});

app.post("/client/medicalRequestDetails", (req, res) => {
    checkSecurity(req, (reqBody) => {
        //success
        if(containsCorrectKeys(reqBody)) {



        } else {
            res.send("invalid request");
        }
    }, () => {
        //failure
        res.send("invalid request");
    });
});

app.post("/client/subjectAccessrequest", (req, res) => {
    checkSecurity(req, (reqBody) => {
        //success
        if(containsCorrectKeys(reqBody)) {



        } else {
            res.send("invalid request");
        }
    }, () => {
        //failure
        res.send("invalid request");
    });
});

app.post("/client/legal", (req, res) => {
    checkSecurity(req, (reqBody) => {
        //success
        if(containsCorrectKeys(reqBody)) {



        } else {
            res.send("invalid request");
        }
    }, () => {
        //failure
        res.send("invalid request");
    });
});


// TPS decision maker

app.get("/TPS/anonymousCollection", (req, res) => {
    checkSecurity(req, (reqBody) => {
        //success
        if(containsCorrectKeys(reqBody)) {



        } else {
            res.send("invalid request");
        }
    }, () => {
        //failure
        res.send("invalid request");
    });
});


// TPS manager

app.get("/TPS/regionalCases", (req, res) => {
    checkSecurity(req, (reqBody) => {
        //success
        if(containsCorrectKeys(reqBody)) {



        } else {
            res.send("invalid request");
        }
    }, () => {
        //failure
        res.send("invalid request");
    });
});

// TPS medical response staff

app.get("/TPS/staffCases", (req, res) => {
    checkSecurity(req, (reqBody) => {
        //success
        if(containsCorrectKeys(reqBody)) {



        } else {
            res.send("invalid request");
        }
    }, () => {
        //failure
        res.send("invalid request");
    });
});

async function checkSecurity(req, onSuccess, onFailure) {

    let reqBody = await decryptReqBody(req, onFailure);

    if(reqBody === false) {
        await onFailure();
        return false;
    }

    let context = await generateContext(req, reqBody);

    let userData = await generateUserData(context, reqBody);

    if(userData == false) {
        await onFailure();
        return false;
    }
    

    if(!(await integrityCheck.hashMatches(decryptedText, reqBody.hash, context))) {
        await onFailure();
        return false;
    }

    let authentication = await authenticator.assertExists(context.userType, userData, context);

    if(authentication === false) {
        await onFailure();
        return false;
    }

    userData.id = authentication;

    if(await authorisor.userCanPerform(context.requestType, userData.id, userData.userType, context)) {
        await onSuccess(reqBody);
        return true;
    }

    await onFailure();
    return false;

}

async function decryptReqBody(req) {
    let decryptedText = await cryptography.decrypt(req);

    let reqBody;
    try {
        reqBody = JSON.parse(decryptedText);
        console.log(reqBody.Keys());
    } catch (error) {
        return false;
    }

    return reqBody;
}

async function generateContext(req, reqBody) {
    let context = {
        ip: req.ip,
        requestType: reqBody.requestType,
        userType: reqBody.userType
    };
    return context;
}

async function generateUserData(context, reqBody) {
    let userData;
    if(context.userType === authorisor.TPS_STAFF) {
        userData = {
            userType: context.userType,
            requestType: "",
            organisationId: "",
            type: "",
            email: "",
            fullName: "",
            fName: "",
            lName: "",
            permission: ""
        };
    } else if(context.userType === authorisor.ELDERLY_PERSON) {
        userData = {
            userType: context.userType,
            fullName: "",
            fName: "",
            lName: "",
            addrFirstLine: "", 
            postCode: "",
            dateOfBirth: ""
        };
    } else {
        userData = false;
    }
    return userData;
}

function containsCorrectKeys(object) {
    let keys = ["fName", "lName", "userType", "requestType", "content"];

    let keysMatch = true;
    for(let i = 0; i < keys.length; i++) {
        if(!(object.hasOwnProperty(keys[i]))) {
            keysMatch = false;
        }
    }

    return keysMatch;
}