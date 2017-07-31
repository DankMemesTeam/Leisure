module.exports = (validator) => {
    return {
        isValidString(str, minLen, maxLen) {
            if (!str) {
                return false;
            }

            if (typeof str !== 'string') {
                return false;
            }

            const result = !!validator.isLength(
                str,
                {
                    min: minLen || 0,
                    max: maxLen || undefined,
                }
            );

            return result;
        },
        isValidEmail(email) {
            if (!email) {
                return false;
            }

            if (typeof email !== 'string') {
                return false;
            }

            return validator.isEmail(email);
        },
        isValidMongoId(id) {
            return validator.isMongoId(id);
        },
    };
};
