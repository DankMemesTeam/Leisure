module.exports = ({ userData }) => {
    return {
        loadProfilePage(req, res) {
            userData.findUserBy({ username: req.params.username })
                .then((foundUser) => {
                    res.render('user-profile', foundUser);
                });
        },
        insertPost(req, res) {
            const post = {
                author: req.user.username,
                content: req.body.postInput,
            };

            return userData.createPost(post)
                .then(res.redirect('/user/' + req.user.username));
        },
        loadProfileSettingsPage(req, res) {
            userData.findUserBy({ username: req.params.username })
                .then((foundUser) => {
                    if (foundUser.username !== req.user.username) {
                        res.redirect(`/user/${req.params.username}`);
                        return;
                    }

                    res.render('profile-settings', foundUser);
                });
        },
        editUserProfile(req, res) {
            userData.findUserBy({ username: req.params.username })
                .then((foundUser) => {
                    if (foundUser.username !== req.user.username) {
                        res.redirect(`/user/${req.params.username}`);
                        return;
                    }

                    const data = req.body;
                    console.log(req.body);

                    userData.editUser(foundUser.username, data)
                        .then(() => {
                            res.redirect(`/user/${req.params.username}/settings`);
                        });
                });
        },
    };
};
