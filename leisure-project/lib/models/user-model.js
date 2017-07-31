const config = require('../../config/config.js').prod;

module.exports = class User {
    constructor(username, firstName, lastName, email, hashedPassword) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.hashedPassword = hashedPassword;
        this.profilePic = config.defaultProfilePic;
        this.aboutMe = 'No description yet';
        this.dateJoined = new Date();
        this.notifications = [];
        this.followed = [];
        this.followers = [];
    }
};
