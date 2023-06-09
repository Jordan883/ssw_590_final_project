const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const helpers = require("../helpers");
const bcrypt = require("bcrypt");
const saltRounds = 16;
const { ObjectId } = require("mongodb");

const signup = async (username, password) => {
  username = helpers.usernameHandler(username);

  const userCollection = await users();
  const existing = await userCollection.findOne({ username: username });
  if (existing !== null) {
    throw "Error: User with this username already exists.";
  }

  password = await bcrypt.hash(helpers.passwordHandler(password), saltRounds);

  const newUser = {
    username: username,
    password: password,
  };
  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Error: Could not add user";

  const createdUser = await userCollection.findOne({
    _id: insertInfo.insertedId,
  });
  return {
    _id: createdUser._id.toString(),
    username: createdUser.username,
  };
};

const checkUser = async (username, password) => {
  username = helpers.usernameHandler(username);
  password = helpers.passwordHandler(password);

  const userCollection = await users();
  const existing = await userCollection.findOne({ username: username });
  if (existing === null) {
    throw "Error: Either the username or password is invalid";
  }

  let comparison = false;
  try {
    comparison = await bcrypt.compare(password, existing.password);
  } catch (e) {
    throw "Error: Internal authentication error";
  }
  if (comparison) {
    return {
      _id: existing._id.toString(),
      username: existing.username,
    };
  } else {
    throw "Error: Either the username or password is invalid";
  }
};

//delete user
const deleteUser = async (id) => {
  if (!id)
    throw {
      status: 404,
      error: "The user must be logged in to delete their account",
    };

  let userCollection = await users();
  let deletedUserInfo = await userCollection.deleteOne({ _id: ObjectId(id) });

  if (deletedUserInfo.deleteCount === 0)
    throw { status: 400, error: "Could not delete user" };

  return "successful";
};

module.exports = {
  signup,
  checkUser,
  deleteUser,
};
