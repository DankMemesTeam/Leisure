const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {
    generateHash(password) {
        return bcrypt.hash(password, saltRounds);
    },
    verify(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    },
};
