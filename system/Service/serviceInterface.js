const express = require("express");

const app = express();

app.listen(3000, () => {
    console.log("server running on port 3000");
});

// elderly person

app.post("/client/medicalRequest", (req, res) => {

});

app.post("/client/medicalRequestDetails", (req, res) => {

});

app.post("/client/subjectAccessrequest", (req, res) => {

});

app.post("/client/legal", (req, res) => {

});


// TPS decision maker

app.get("/TPS/anonymousCollection", (req, res) => {

});


// TPS manager

app.get("/TPS/regionalCases", (req, res) => {

});

// TPS medical response staff

app.get("/TPS/staffCases", (req, res) => {

});

