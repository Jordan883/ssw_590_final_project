const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const configRoutes = require('./routes');
// const http = require("http");

//app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  session({
      name: 'AuthCookie',
      secret: 'some secret string!',
      resave: false,
      saveUninitialized: true
  })
);

// app.use('/', (req, res, next) => {
//   next();
// })


// db


//middleware


//port
configRoutes(app);


const server = app.listen(8080, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:8080');
});