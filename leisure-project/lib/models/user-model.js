const hasher = require('password-hash');

module.exports = class User {
    constructor(username, firstName, lastName, email, password) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.hashedPassword = hasher.generate((password));
        this.posts = [];
        this.events = [];
    }
};
