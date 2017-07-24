module.exports = ({ userData, statusData }) => {
    return {
        loadProfilePage(req, res) {
            Promise.all(
                [userData.findUserBy({ username: req.params.username }),
                statusData.findStatusesByUser(req.params.username),
                ])
                .then((result) => {
                    const isOwner = req.params.username === req.user.username;
                    
                    console.log(req.user);

                    res.render('user-profile',
                        { pageUser: result[0], currentUser: req.user,
                             statuses: result[1], isOwner });
                });
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

                    userData.editUser(foundUser.username, req.body)
                        .then(() => {
                            res.redirect(`/user/${req.params.username}/settings`);
                        });
                });
        },

    };
};
