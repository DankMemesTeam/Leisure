const validator = require('validator');

const toTitleCase = (str) => {
    for (const x in str) {
        if (x === 0 && str[x] === str[x].toLowerCase()) {
            return false;
        }

        if (x > 0 && str[x] === str[x].toUpperCase()) {
            return false;
        }
    }

    return true;
};

module.exports = () => {
    // needs better validation
    return {
        validateUserFields(user) {
            validator.isAscii(user.username);
            validator.isAscii(toTitleCase(user.firstName));
            validator.isAscii(toTitleCase(user.lastName));
            validator.isAscii(user.email);
            validator.isAscii(user.password);
        },
    };
};
