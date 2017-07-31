import validator from 'validator';
const minStringLength = 5;
const maxStringLength = 20;

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

const validateString = (input, objName) => {
    console.log(input);
    input = sanitizeStringInput(input);
    
    if (validator.isEmpty(input)) {
        return { message: objName + ' cannot be empty!' };
    }

    if (validator.isLength(input, { min: minStringLength, max: maxStringLength })) {
        return { message: `Invalid ${objName.toLowerCase()} length!` };
    }

    if (validator.contains(input, ' ')) {
        return { message: objName + ' cannot contain spaces!' };
    }

    return { isValid: true, result: input };
};

const validatorModule = {
    validateUsername(username) {
        return validateString(username, 'Username');
    },
    validateName(name, objName) {
        const baseValidation = validateString(name, objName);

        if (!baseValidation.isValid) {
            return { message: baseValidation.message };
        }

        if (!isNameCase(baseValidation.result)) {
            return { message: objName + ' is not a correct name!' };
        }

        return baseValidation;
    },
    validateEmail(email) {
        email = sanitizeStringInput(email);

        if (validator.isEmpty(email)) {
            return { message: 'Email cannot be empty!' };
        }

        if (validator.isEmail(email)) {
            return { message: 'Email is not valid!' };
        }

        return { isValid: true, result: email };
    },
    validatePassword(password) {
        // If you want you can add more password-specific validation
        return validateString(password, 'Password');
    },
};

export { validatorModule };
