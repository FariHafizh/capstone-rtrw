module.exports = (req, res, next) => {
  if (req.session.superadmin && req.session.superadmin.isLoggedIn) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: hanya superadmin yang boleh mengakses.' });
  }
};
