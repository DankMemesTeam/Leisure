// const validator = require('validator');

// const toTitleCase = (str) => {
//     for (const x in str) {
//         if (x === 0 && str[x] === str[x].toLowerCase()) {
//             return false;
//         }

//         if (x > 0 && str[x] === str[x].toUpperCase()) {
//             return false;
//         }
//     }

//     return true;
// };

module.exports = () => {
    // needs better validation
    return {
        isUserValid(user) {
            // add validations using validator library

            return true;
        },
        // isPostValid(post) etc...
    };
};
