module.exports = (req, res, next) => {
  if (req.session.rtRwUser) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized. Silakan login terlebih dahulu.' });
  }
};
