module.exports = class Article {
    constructor(author, title, description, content, tags, category) {
        this.dateCreated = new Date();
        this.author = author;
        this.title = title;
        this.description = description;
        this.content = content;
        this.likes = [];
        this.comments = [];
        this.tags = tags;
        this.category = category;
    }
};
