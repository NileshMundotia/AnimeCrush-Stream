// routes/animeRoutes.js
import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import { searchAnime } from "../controllers/animeController.js";

const router = express.Router();

// Protected route: only accessible when logged in
router.get("/anime", ensureAuthenticated, (req, res) => {
  res.render("anime.ejs", {
    cssFile: "/CSS/Common/anime.css",
    query: "",
    animeData: [],
  });
});

// Protected route for searching anime
router.post("/search", ensureAuthenticated, searchAnime);

export default router;
