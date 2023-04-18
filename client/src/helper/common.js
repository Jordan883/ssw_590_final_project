export const isValidString = (string, parameter) =>{
    if (!string) throw new Error(`You must provide a ${parameter}`);
    if (typeof string !== 'string') throw new Error(`${parameter} must be a string`);
    string = string.trim()
    if (string.length === 0)
      throw new Error(`${parameter} cannot be an empty string or just spaces`);
    return string;
}

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

const stringValidation = (input, forbidden, errMessage) => {
    const regex = new RegExp(forbidden, 'g');
    if (regex.test(input)){
        throw errMessage;
    }
};

export const usernameHandler = (username) => {
    username = isValidString(username, 'username').toLowerCase();
    stringLengthCheck(username, 'Username', 3);
    stringValidation(username, '[^a-z0-9]',
        'Error: Username may only contain alphanumeric characters.');
        // Regex from https://bobbyhadz.com/blog/javascript-remove-special-characters-from-string
        // Adapted for other checks below.
    return username;
}

export const isValidEmail = (email) => {
    email = isValidString(email, "Email");
    if(!email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ))
      throw new Error('Invalid Email');
    return email.toLowerCase();
}

export const isPasswordSame = (repassword, password) => {
  repassword = isValidPassword(repassword);
  if(repassword === password) return repassword
  throw new Error('Passwords dont match')
}

export const isValidPassword = (passowrd) => {
    if(!passowrd.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,12}$/))
        throw new Error('Invalid password');
    return passowrd
}

export const isValidName = (inputName) => {
  inputName = isValidString(inputName,"Name");
  let name=inputName.split(' '); 
  if(name.length!==2) throw new Error('Invalid name'); 
  if(name[0].length<3)
    throw new Error('First name should be atleast 3 character');
  if(name[1].length<3)
    throw new Error('Last name should be atleast 3 character');
  if(name[0].match(/^[^a-zA-Z0-9]+$/) || (name[0].replace(/[^a-zA-Z0-9 ]/g, '').length !== name[0].length && name[0].replace(/[^a-zA-Z0-9 ]/g, '').length !== name[0].length-1))
    throw new Error( 'Invalid first name');
  if(name[1].match(/^[^a-zA-Z0-9]+$/) || (name[1].replace(/[^a-zA-Z0-9 ]/g, '').length !== name[1].length && name[1].replace(/[^a-zA-Z0-9 ]/g, '').length !== name[1].length-1))
    throw new Error( 'Invalid last name');
  if(!name[0].match(/^[a-z.'-]+$/i))
    throw new Error('Invalid first name');
  if(!name[1].match(/^[a-z.'-]+$/i))
    throw new Error('Invalid last name');
  return inputName;
}

export const isValidNumber = (num,param) => {
  num = num.toString();
  num = isValidString(num);
  
  if(!num.match(/^\d+$/)) throw new Error(`Invalid ${param}`);
  return parseInt(num);
}

export const isEqualPassword = (password, confirmPassword) => {
  if(password !== confirmPassword) throw new Error("Passwords don't match")
  else return confirmPassword;
}

export const stringInputHandler = (input, name) => {
    if (typeof input !== 'string'){
        throw `Error: ${name} must be a string.`;
    }
    input = input.trim();
    if (input.length === 0){
        throw `Error: ${name} cannot be only whitespace.`;
    }
    return input;
};

export const senseValidation = (input, name) => {
    input = stringInputHandler(input);
    const regex = new RegExp('[a-zA-Z]', 'g');
    if (!regex.test(input)){
        throw `Error: ${name} should include at least one alphabetical character.`;
    }
}
