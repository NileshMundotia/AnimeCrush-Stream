// routes/authRoutes.js
import express from "express";
import passport from "passport";
import { registerUser } from "../controllers/authController.js";

const router = express.Router();

router.get("/login", (req, res) => res.render("login.ejs", { cssFile: "/CSS/Common/login.css" }));
router.get("/register", (req, res) => res.render("register.ejs", { cssFile: "/CSS/Common/register.css" }));
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

router.post("/register", registerUser);
router.post(
  "/login",
  passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login" })
);

// Google Auth
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/auth/google/secrets",
  passport.authenticate("google", { successRedirect: "/", failureRedirect: "/login" })
);

export default router;
