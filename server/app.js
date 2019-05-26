const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const StreamChat = require('stream-chat').StreamChat;
var AWS = require('aws-sdk');

require('dotenv').config({path:  "../.env"})

const app = express();
const port = process.env.VUE_APP_PORT || 3000

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Getstream chat SDK
const serverSideClient = new StreamChat(
    process.env.VUE_APP_KEY, 
    process.env.APP_SECRET
);

// Initialize AWS translate SDK
var translate = new AWS.Translate({
    'accessKeyId': process.env.AWSaccessKeyId,
    'secretAccessKey': process.env.AWSsecretAccessKey,
    "region": "us-east-1"
});

app.get("/", async (req, res) => {
    res.send({ hello: "World!" });
});

app.post('/login', async (req, res) => {
    const userId = req.body.userId

    if (!userId) {
        return res.status(400).send({
            status: "error",
            message: "username and name is required"
        })
    } 

    return res.status(200).send({
        status: "success",
        token: serverSideClient.createToken(userId)
    })
});

app.post('/translate', async (req, res) => {
    const {targetLanguage, text} = req.body

    var option = {
        SourceLanguageCode: 'auto',
        TargetLanguageCode: targetLanguage,
        Text: text,
    };

    translate.translateText(option, (err, data) => {
        if (err) {
            return res.status(400).send({
                status: "error",
                message: err.message
            }) 
        } else { 
            return res.status(200).send({
                status: "success",
                TranslatedText: data.TranslatedText
            }) 
        }
    });
});

app.listen(port, () => {
    console.log(`Node app listening on port ${port}!`)
});