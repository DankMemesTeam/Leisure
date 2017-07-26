module.exports = ({ userData, statusData }) => {
    return {
        loadProfilePage(req, res) {
            Promise.all(
                [userData.findUserBy({ username: req.params.username }),
                statusData.findStatusesByUser(req.params.username),
                ])
                .then((result) => {
                    const isOwner = req.user && req.user.username === req.params.username;

                    res.render('user/user-profile',
                        {
                            pageUser: result[0], currentUser: req.user,
                            statuses: result[1], isOwner,
                        });
                });
        },
        loadProfileSettingsPage(req, res) {
            userData.findUserBy({ username: req.params.username })
                .then((foundUser) => {
                    if (foundUser.username !== req.user.username) {
                        res.redirect(`/users/${req.params.username}`);
                        return;
                    }

                    res.render('user/profile-settings', foundUser);
                });
        },
        editUserProfile(req, res) {
            userData.findUserBy({ username: req.params.username })
                .then((foundUser) => {
                    if (foundUser.username !== req.user.username) {
                        res.redirect(`/users/${req.params.username}`);
                        return;
                    }

                    userData.editUser(foundUser.username, req.body)
                        .then(() => {
                            res.redirect(`/users/${req.params.username}/settings`);
                        });
                });
        },

    };
};
