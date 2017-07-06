module.exports = () => {
  return {
    loadHomePage(req, res) {
      res.render('home', {
        title: 'Generator-Express MVC',
      });
    },
  };
};
