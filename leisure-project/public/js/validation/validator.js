/*eslint-disable*/

const minStringLength = 3;
const maxStringLength = 50;
const minTextLength = 5;
const maxTextLength = 50;
const minContentLength = 20;

const sanitizeStringInput = (input) => {
    input = validator.escape(input);
    input = validator.ltrim(input, ' ');
    input = validator.rtrim(input, ' ');

    return input;
};

const isNameCase = (input) => {
    const isFirstLetterUppercase = validator.isUppercase(input[0]);
    const isRestLowercase = validator.isLowercase(input.substr(1));

    return isFirstLetterUppercase && isRestLowercase;
};

const validateExising = (input, objName) => {
    input = validator.escape(input);

    if (validator.isEmpty(input)) {
        return { message: objName + ' is not valid!' };
    }

    return { isValid: true, result: input };
};

const validateComment = (comment) => {
    comment = sanitizeStringInput(comment);

    if (validator.isEmpty(comment)) {
        return { message: 'Comment cannot be empty!' };
    }

    if (!validator.isLength(comment, { min: 2 })) {
        return { message: `Invalid comment length!(min: 2)` };
    }

    return { isValid: true, result: comment };
};

const validateString = (input, objName) => {
    input = sanitizeStringInput(input);

    if (validator.isEmpty(input)) {
        return { message: objName + ' cannot be empty!' };
    }

    if (!validator.isLength(input,
         { min: minStringLength, max: maxStringLength })) {
        return { message: `Invalid ${objName.toLowerCase()}
         length! (${minStringLength};${maxStringLength})` };
    }

    if (validator.contains(input, ' ')) {
        return { message: objName + ' cannot contain spaces!' };
    }

    return { isValid: true, result: input };
};

const validateUsername = (username) => {
    return validateString(username, 'Username');
};
const validateName = (name, objName) => {
    const baseValidation = validateString(name, objName);

    if (!baseValidation.isValid) {
        return { message: baseValidation.message };
    }

    if (!isNameCase(baseValidation.result)) {
        return { message: objName + ' is not a correct name!' };
    }

    return baseValidation;
};
const validateEmail = (email) => {
    email = sanitizeStringInput(email);

    if (validator.isEmpty(email)) {
        return { message: 'Email cannot be empty!' };
    }

    if (!validator.isEmail(email)) {
        return { message: 'Email is not valid!' };
    }

    return { isValid: true, result: email };
};
const validatePassword = (password) => {
    // If you want you can add more password-specific validation
    return validateString(password, 'Password');
};
const validateDate = (date) => {
    date = sanitizeStringInput(date);

    if (!validator.toDate(date)) {
        return { message: 'Date is not valid!' };
    }

    return { isValid: true, result: date };
};
const validateText = (text, objName) => {
    text = sanitizeStringInput(text);

    if (validator.isEmpty(text)) {
        return { message: objName + ' cannot be empty!' };
    }

    if (!validator.isLength(text,
         { min: minTextLength, max: maxTextLength })) {
        return { message: `Invalid ${objName.toLowerCase()}
         length! (${minTextLength};${maxTextLength})` };
    }

    return { isValid: true, result: text };
};

const validateContent = (content, objName) =>{
    content = sanitizeStringInput(content);

    if (validator.isEmpty(content)) {
        return { message: objName + ' cannot be empty!' };
    }

    if (!validator.isLength(content,
         { min: minContentLength })) {
        return { message: `Invalid ${objName.toLowerCase()}
         length! (${minContentLength})` };
    }

    return { isValid: true, result: content };
};
