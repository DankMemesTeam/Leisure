module.exports = class User {
    constructor(username, firstName, lastName, email, hashedPassword) {
        this.username = username;
        this.dateJoined = new Date();
        this.profilePictureUrl = null;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.hashedPassword = hashedPassword;
    }
};
