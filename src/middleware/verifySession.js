const verifySession = async (req, res, next) => {
  if (req.session && req.session.user?._id) {
    return next();
  } else {
    // Save the requested URL in the session to redirect after login
    req.session.returnTo = req.originalUrl;
    console.log(`===============`);
    console.log(req.session.returnTo, req.originalUrl);
    res.redirect('/login');
  }
};

module.exports = verifySession;