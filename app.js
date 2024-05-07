const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function (req, res) {
    //Son constantes porque nunca cambiare su valor.
    const firstName = req.body.first;
    const lastName = req.body.last;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/6b3a2bde7f";

    const options = {
        method: "POST",
        auth: "bray1:537dd5d209b4a83d91a9f18b54ebfc7f-us21"
    }

    const request = https.request(url, options, function (response){
        
        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html"); 
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure.html", function (req,res){
    res.redirect("/");
});

app.post("/success.html", function (req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function (){
    console.log("Server is running on Port 3000");
});

//Api Key
//537dd5d209b4a83d91a9f18b54ebfc7f-us21

//List ID
//6b3a2bde7f
