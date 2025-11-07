// controllers/animeController.js
import axios from "axios";
import db from "../config/db.js"; // ✅ Ensure this is your DB connection file

export const searchAnime = async (req, res) => {
  const query = req.body.query;

  try {
    // 🔍 Fetch anime data from Jikan API
    const response = await axios.get("https://api.jikan.moe/v4/anime", {
      params: { q: query, limit: 15 },
    });

    let animeData = response.data.data || [];

    // 🧠 Fetch uploaded anime titles from your database
    const dbResults = await db.query("SELECT LOWER(anime_title) AS title FROM videos");
    const uploadedTitles = dbResults.rows.map(row => row.title);

    // ✅ Mark which anime are already uploaded
    animeData = animeData.map(anime => ({
      ...anime,
      isUploaded: uploadedTitles.includes(anime.title.toLowerCase())
    }));

    // 🎨 Render the page
    res.render("anime.ejs", {
      animeData,
      query,
      cssFile: "/CSS/Common/anime.css",
    });

  } catch (error) {
    console.error("❌ Error fetching anime:", error.message);
    res.render("anime.ejs", {
      animeData: [],
      query,
      cssFile: "/CSS/Common/anime.css",
    });
  }
};
