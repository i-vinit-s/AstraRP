const authorize = (...roles) => {
  return (req, res, next) => {
    const hasRole = req.user.roles.some((role) => roles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    if (!roles.includes(req.user.roles[0])) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};

module.exports = authorize;
