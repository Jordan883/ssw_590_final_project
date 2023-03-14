const express = require('express');
const app = express();
const cors = require('cors');
const configRoutes = require('./routes');
// const http = require("http");

//app
app.use(express.json({limit: '50mb'}));
app.use(cors());


// db


//middleware


//port
configRoutes(app);


const server = app.listen(8080, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:8080');
});