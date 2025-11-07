// middlewares/authMiddleware.js

export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    // User is logged in → proceed
    return next();
  }
  console.warn("🚫 Unauthorized access attempt — redirecting to login");
  res.redirect("/login");
};
export function isAdmin(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).send('Access denied: Admins only.');
}