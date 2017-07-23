module.exports = ({}) => {
  return {
    loadHomePage(req, res) {
      console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
      console.log(req.user);
      res.render('home', {
        title: 'Generator-Express MVC',
      });
    },
  };
};
