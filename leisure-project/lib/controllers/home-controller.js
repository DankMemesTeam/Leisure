module.exports = ({ userData, statusData }) => {
  const pageSize = 2;

  return {
    loadHomePage(req, res) {
      if (!req.user) {
        return res.render('home');
      }

      const pageNumber = req.query.page || 1;

      return userData.getUserFollowed(req.user.username)
        .then((usersFollowed) => {
          return statusData.getFeed(usersFollowed.followed || [], pageNumber, pageSize);
        })
        .then(([statuses, count]) => {
          return res.render('user/user-feed', {
            statuses,
            pageNumber,
            pagesCount: Math.ceil(count / pageSize),
          });
        });
    },
  };
};
