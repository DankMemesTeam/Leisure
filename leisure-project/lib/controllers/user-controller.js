module.exports = ({ userData }) => {
    return {
        loadProfilePage(req, res) {
            res.render('user-profile', userData);
        },
    };
};
