const {ObjectId} = require('mongodb');

// GENERAL/BASE VALIDATION
const stringInputHandler = (input, name) => {
    if (typeof input !== 'string'){
        throw `Error: ${name} must be a string.`;
    }
    input = input.trim();
    if (input.length === 0){
        throw `Error: ${name} cannot be only whitespace.`;
    }
    return input;
};

const stringLengthCheck = (input, name, length) => {
    if (input.length < length){
        throw `Error: ${name} must be at least ${length} characters long.`;
    }
};

const stringRangeCheck = (input, name, min, max) => {
    if (input.length < min){
        throw `Error: ${name} must be at least ${min} characters long.`;
    } else if (input.length > max){
        throw `Error: ${name} can be at most ${max} characters long.`;
    }
};

// https://stackoverflow.com/questions/11143702/how-to-pass-a-regular-expression-as-a-function-parameter
// Used to help create this function.
const stringValidation = (input, forbidden, errMessage) => {
    const regex = new RegExp(forbidden, 'g');
    if (regex.test(input)){
        throw errMessage;
    }
};

const senseValidation = (input, name) => {
    input = stringInputHandler(input);
    const regex = new RegExp('[a-zA-Z]', 'g');
    if (!regex.test(input)){
        throw `Error: ${name} should include at least one alphabetical character.`;
    }
}

const sessionValidation = (user) => {
    if (typeof user !== 'object' || user === null){
        throw 'Error: User session object is invalid.';
    }
    user.username = stringInputHandler(user.username);
    user._id = stringInputHandler(user._id);
    if (!ObjectId.isValid(user._id)){
        throw 'Error: User session object id is invalid.';
    }
    user.username = usernameHandler(user.username);
    return user;
}

const sessionComparator = (user1, user2) => {
    user1 = sessionValidation(user1);
    user2 = sessionValidation(user2);
    if (user1._id === user2._id && user1.username === user2.username) return true;
    return false;
}



// USERS VALIDATION
const usernameHandler = (username) => {
    username = stringInputHandler(username).toLowerCase();
    stringLengthCheck(username, 'Username', 3);
    stringValidation(username, '[^a-z0-9]',
        'Error: Username may only contain alphanumeric characters.');
        // Regex from https://bobbyhadz.com/blog/javascript-remove-special-characters-from-string
        // Adapted for other checks below.
    return username;
}

const passwordHandler = (password) => {
    if (typeof password !== 'string'){
        throw `Error: Password must be a string.`;
    }
    stringLengthCheck(password, 'Password', 6);
    const lowercase = new RegExp('[a-z]');
    const uppercase = new RegExp('[A-Z]');
    const numeric = new RegExp('[0-9]');
    const special = new RegExp('[^A-Za-z0-9]');
    if (!lowercase.test(password) || !uppercase.test(password) || !numeric.test(password) || !special.test(password)){
        throw 'Error: password must contain at least one uppercase, one numeric, and one special character' 
    }
    const whitespace = new RegExp(' ');
    if (whitespace.test(password)){
        throw 'Error: Password cannot contain any whitespace.' 
    }
    return password;
}

module.exports = {
    // General/Base Validation
    stringInputHandler,
    stringLengthCheck,
    stringRangeCheck,
    stringValidation,
    senseValidation,
    sessionValidation,
    sessionComparator,

    // Users Validation
    usernameHandler,
    passwordHandler,
}