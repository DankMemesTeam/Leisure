const loadHomePage = (req, res) => {
  res.render('home', {
    title: 'Generator-Express MVC',
  });
};

module.exports = {
  loadHomePage,
};
