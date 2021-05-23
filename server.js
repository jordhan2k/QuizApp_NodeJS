const express = require('express');
const app = express();
const api = require('./routes/api.js');
const mongodb = require('mongodb');
const URL = "mongodb://localhost:27017/question-db";
const cors = require('cors');

// decode req.body from form-data
app.use(express.urlencoded({ extended: true }));
// decode req.body from post 
app.use(express.json());

app.use(express.static('quiz/index.html'));

// Start server and connect to MongoDB
let db = null;
async function startServer() {
    const client = await mongodb.MongoClient.connect(URL, { useUnifiedTopology: true });
    db = client.db();
    console.log("connected");

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    function setDatabase(req, res, next) {
        req.db = db;
        next();
    }
    app.use(setDatabase);
    app.use(api);

    await app.listen(3000, function() {
        console.log("Listening on port 3000!");
    })
}
startServer();