module.exports = (validator) => {
    const minTitleLen = 5;
    const minDescriptionLen = 5;
    const minContentLen = 15;

    // isValidString(str, min, max)
    // isValidArray(arr, min, max)
    // isValidEmail(email)


    return {
        isValid(articleModel) {
            if (!articleModel) {
                return false;
            }

            const hasValidAuthor = articleModel.author &&
                validator.isValidString(articleModel.author.username);

            const hasValidTitle = validator.isValidString(articleModel.title, minTitleLen);

            const hasValidDescription = validator.isValidString(articleModel.description, minDescriptionLen);

            const hasValidContent = validator.isValidString(articleModel.content, minContentLen);

            const hasValidCategory = validator.isValidString(articleModel.category);


            const result = hasValidAuthor &&
                hasValidTitle &&
                hasValidDescription &&
                hasValidContent &&
                hasValidCategory;

            return result;
        },
        isValidEdit(id, title, description, content) {
            const isValidTitle = validator.isValidString(title, minTitleLen);

            const isValidDescription = validator.isValidString(description, minDescriptionLen);

            const isValidContent = validator.isValidString(content, minContentLen);


            return isValidTitle &&
                isValidDescription &&
                isValidContent;
        },
        isValidComment(articleId, comment) {
            return validator.isValidString(comment.text, 2);
        },
    };
};
