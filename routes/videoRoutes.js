import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import db from "../config/db.js";
import { ensureAuthenticated, isAdmin } from "../middleware/authMiddleware.js";
import { processVideoUpload } from "../controllers/videoController.js";

const router = express.Router();
const upload = multer({ dest: "tmp_uploads/" });

// 🧩 Admin Broadcast Route
router.get("/broadcast", isAdmin, (req, res) => {
  res.render("broadcast.ejs", { cssFile: "/CSS/Common/video_playback.css" });
});

router.post("/broadcast", isAdmin, upload.single("video"), processVideoUpload);

// 🎥 Watch Route (Checks DB + File Existence)
router.get("/watch/:animeTitle", ensureAuthenticated, async (req, res) => {
  try {
    const { animeTitle } = req.params;
    const formattedTitle = animeTitle.replace(/_/g, " "); // Replace underscores with spaces

    // 🧠 1️⃣ Check database for uploaded video
    const query = `
      SELECT * FROM videos
      WHERE LOWER(REPLACE(anime_title, ' ', '_')) = LOWER($1)
      OR LOWER(anime_title) = LOWER($2)
      LIMIT 1;
    `;
    const result = await db.query(query, [animeTitle, formattedTitle]);

    if (result.rows.length === 0) {
      console.log(`⚠️ Video not available in DB for ${formattedTitle}`);
      return res.status(404).render("video_not_available.ejs", {
        cssFile: "/CSS/Common/video_playback.css",
        title: formattedTitle,
      });
    }

    const video = result.rows[0];
    let masterPath = video.file_path.replace(/\\/g, "/");

    // 🧩 2️⃣ Handle both 'Public' and 'public'
    const lowerPath = masterPath.toLowerCase();
    const idx = lowerPath.indexOf("/public/");
    if (idx === -1) {
      console.error(`❌ Could not locate '/public/' in path: ${masterPath}`);
      return res.status(404).render("video_not_available.ejs", {
        cssFile: "/CSS/Common/video_playback.css",
        title: formattedTitle,
      });
    }

    // Extract relative part of path
    const relativePath = masterPath.substring(idx + 7); // skip "/public"
    const videoPath = relativePath.startsWith("/") ? relativePath : "/" + relativePath;

    console.log(`🎬 Streaming video for: ${formattedTitle}`);
    console.log(`🧾 masterPath: ${masterPath}`);
    console.log(`🌐 videoPath: ${videoPath}`);

    res.render("watch.ejs", {
      cssFile: "/CSS/Common/video_playback.css",
      animeTitle: formattedTitle,
      videoPath,
    });
  } catch (err) {
    console.error("❌ Error loading video:", err);
    res.status(500).send("Internal Server Error");
  }
});


export default router;
