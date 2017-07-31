module.exports = ({ userData, statusData, articleData }) => {
    const pageSize = 2;

    return {
        loadProfilePage(req, res) {
            const pageNumber = req.query.page || 1;

            Promise.all([
                userData.findUserBy({ username: req.params.username }),
                statusData
                    .findStatusesByUser(req.params.username, pageNumber, pageSize),
            ])
                .then(([foundUser, [statuses, count]]) => {
                    if (!foundUser) {
                        return res.redirect('/');
                    }

                    const isOwner = req.user &&
                        req.user.username === req.params.username;

                    res.render('user/user-profile', {
                        pageUser: foundUser,
                        currentUser: req.user,
                        statuses: statuses,
                        isOwner,
                        pageNumber,
                        pagesCount: Math.ceil(count / pageSize),
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

                    if (req.body.profilePic) {
                        req.body.profilePic = req.body.profilePic
                            .replace(/(.*imgur.com\/)(.*)(\..*)/, '$1$2b$3');
                    }

                    userData.editUser(foundUser.username, req.body)
                        .then((editResult) => {
                            // Update fields
                            const user = {
                                username: editResult.value.username,
                                firstName: editResult.value.firstName,
                                lastName: editResult.value.lastName,
                                profilePic: editResult.value.profilePic,
                            };

                            for (const key in req.body) {
                                // check for allowed fields only
                                if (req.body[key]) {
                                    user[key] = req.body[key];
                                }
                            }

                            return Promise.all([
                                articleData
                                    .updateArticleFields(user.username, user),
                                statusData
                                    .updateStatusFields(user.username, user),
                            ]);
                        })
                        .catch((err) => {
                            return res.redirect(`/users/${req.params.username}/settings`);
                        })
                        .then(() => {
                            if (req.body.profilePic) {
                                return res.json({
                                    redirectUrl: `/users/${req.params.username}`,
                                });
                            }

                            return res.json({ errorMessage: 'Oops something went wrong!' });
                        });
                });
        },
        followUser(req, res) {
            if (!req.user) {
                return res.redirect('auth/login');
            }

            return userData.followUser(req.user.username, req.params.username)
                .then(() => {
                    return res.json({});
                })
                .catch(() => {
                    return res.json({ errorMessage: 'Oops something went wrong!' });
                });
        },
        unfollowUser(req, res) {
            if (!req.user) {
                return res.redirect('auth/login');
            }

            return userData.unfollowUser(req.user.username, req.params.username)
                .then(() => {
                    return res.json({});
                })
                .catch(() => {
                    return res.json({ errorMessage: 'Oops something went wrong!' });
                });;
        },
    };
};
