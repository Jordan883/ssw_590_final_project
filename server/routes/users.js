const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const {ObjectId} = require('mongodb');
const helpers = require('../helpers');

router
  .route('/signup')
  .post(async (req, res) => {
    if (req.session.user){
      return res.status(403).json({error: 'Error: A user is already logged in.'});
    }
    let {username, password} = req.body;
    try{
      username = helpers.usernameHandler(username);
      password = helpers.passwordHandler(password);
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try{
      const newUser = await userData.signup(username, password);
      return res.json(newUser);
    } catch (e) {
      if (e === 'Error: User with this username already exists.'){
        return res.status(400).json({error: e});
      } else {
        return res.status(500).json({error: e});
      }
    }
  });

router
  .route('/login')
  .post(async (req, res) => {
    if (req.session.user){
      return res.status(403).json({error: 'Error: A user is already logged in.'});
    }
    let {username, password} = req.body;
    try{
      username = helpers.usernameHandler(username);
      password = helpers.passwordHandler(password);
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try{
      const user = await userData.checkUser(username, password);
      req.session.user = {
        _id: user._id,
        username: user.username
      }
      return res.json(user);
    } catch (e) {
      if (e === 'Error: Either the username or password is invalid'){
        return res.status(403).json({error: e});
      } else {
        return res.status(500).json({error: e});
      }
    }
  });

router
  .route('/logout')
  .get(async (req, res) => {
    if (!req.session.user){
      return res.status(403).json({error: 'No user is currently signed in.'});
    }
    req.session.destroy();
    return res.json({message: 'You have been logged out successfully.'});
  });

module.exports = router;