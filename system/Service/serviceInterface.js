const express = require("express");
const authenticator = require("./../Security/Authentication");
const authorisor = require("./../Security/Authorisation");
const cryptography = require("./../Security/Cryptography");
const integrityCheck = require("./../Security/IntegrityCheck");
const interfacer = require("./../BusinessLogic/Interfacer");
const bodyParser = require("body-parser");

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// app.use(bodyParser.json());

app.listen(process.env.PORT || 3000, () => {
    console.log("server running on port 3000");
});

// elderly person

app.post("/client/createElderlyPerson", (req, res) => { //added
    interfacer.createElderlyPerson(req.body.fullName, req.body.address, req.body.postCode, req.body.dateOfBirth, true)
        .then(result => {
            if(result === false) {
                res.send("invalid request");
            } else {
                res.send(result);
            }
        });
});

app.post("/client/medicalRequest", (req, res) => {
    checkSecurity(req, (reqBody) => {
        //success
        if(containsCorrectKeys(reqBody)) {

            let userId = reqBody.id;
            interfacer.addMedicalRequest(userId).then((id) => {
                console.log(id);
                res.send(id);
            });

        } else {
            console.log("invalid keys");
            res.send("invalid request");
        }
    }, () => {
        //failure
        console.log("security failure");
        res.send("invalid request");
    });
});

app.post("/client/medicalRequestDetails", (req, res) => {
    checkSecurity(req, (reqBody) => {
        //success
        if(containsCorrectKeys(reqBody)) {
            let requestId = reqBody.reqId;
            requestId = requestId.substr(1, requestId.length - 2);

            const furtherInfo = reqBody.furtherInfo;

            console.log(requestId + ": " + furtherInfo);

            interfacer.addMedicalRequestDetails(requestId, furtherInfo).then((result) => {
                console.log(result);
                res.send(result);
            });

        } else {
            res.send("invalid request");
        }
    }, () => {
        //failure
        res.send("invalid request");
    });
});

app.post("/client/subjectAccessRequest", (req, res) => {
    checkSecurity(req, (reqBody) => {
        //success
        if(containsCorrectKeys(reqBody)) {

            let id = reqBody.id;

            interfacer.addSubjectAccessRequest(id).then((result) => {
                if(result !== false) {
                    res.send("task completed");
                } else {
                    res.send("invalid request");
                }
            });

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

            // let legalTask = reqBody.legalTask;
            let id = reqBody.id;

            interfacer.stopTCs(id).then((result) => {
                if(result !== false) {
                    res.send("task completed");
                } else {
                    res.send("invalid request");
                }
            });

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

    // let reqBody = await decryptReqBody(req, onFailure);
    let reqBody = req.body;
    console.log(reqBody);
    console.log("body assigned");
    console.log(reqBody.requestType);

    if(reqBody === false) {
        await onFailure();
        return false;
    }
    console.log("body exists");

    let context = await generateContext(req, reqBody);

    let userData = await generateUserData(context, reqBody);

    if(userData == false) {
        await onFailure();
        return false;
    }
    console.log("user data generated");
    

    // if(!(await integrityCheck.hashMatches(decryptedText, reqBody.hash, context))) {
    //     await onFailure();
    //     return false;
    // }

    let authentication = await authenticator.assertExists(context.userType, userData, context);

    if(authentication === false) {
        await onFailure();
        return false;
    }
    console.log("authenticated");

    userData.id = authentication;

    if(await authorisor.userCanPerform(context.requestType, userData.id, userData.userType, context)) {
        console.log("authorised");
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
            fullName: reqBody.fName + " " + reqBody.lName,
            addrFirstLine: reqBody.address, 
            postCode: reqBody.postCode,
            dateOfBirth: reqBody.dateOfBirth,
            id: reqBody.id
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