const hasher = require('password-hash');

module.exports = class User {
    constructor(username, firstName, lastName, email, password) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.hashedPassword = hasher.generate((password));
    }

    // get username() {
    //     return this._username;
    // }

    // get firstName() {
    //     return this._firstName;
    // }

    // get lastName() {
    //     return this._lastName;
    // }

    // get email() {
    //     return this._email;
    // }

    // get password() {
    //     return this._hashedPassword;
    // }
};
