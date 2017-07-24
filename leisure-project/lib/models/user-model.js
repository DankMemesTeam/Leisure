const config = require('../../config/config.js').prod;

module.exports = class User {
    constructor(username, firstName, lastName, email, hashedPassword) {
        this.username = username;
        this.dateJoined = new Date();
        this.profilePic = config.defaultProfilePic;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.hashedPassword = hashedPassword;
    }
};
