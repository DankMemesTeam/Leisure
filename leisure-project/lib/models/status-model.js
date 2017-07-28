module.exports = class Status {
    constructor(author, content, imageUrl) {
        this.author = author;
        this.dateCreated = new Date();
        this.content = content;
        this.imageUrl = imageUrl;
        this.likes = [];
        this.comments = [];
    }
};
