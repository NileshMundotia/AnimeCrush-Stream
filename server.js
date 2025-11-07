import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import passport from "./config/passportConfig.js";
import authRoutes from "./routes/authRoutes.js";
import animeRoutes from "./routes/animeRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  if (req.url.endsWith(".m3u8")) {
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
  } else if (req.url.endsWith(".ts")) {
    res.setHeader("Content-Type", "video/mp2t");
  }
  next();
});


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "Public")));

app.set("views", path.join(__dirname, "Public", "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.get("/", (req, res) => res.render("home.ejs"));
app.get("/video_playback", (req, res) =>
  res.render("video_playback.ejs", { cssFile: "/CSS/Common/video_playback.css" })
);

app.use("/", authRoutes);
app.use("/", animeRoutes);
app.use("/", videoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
