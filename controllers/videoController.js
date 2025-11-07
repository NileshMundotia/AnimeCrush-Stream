// controllers/videoController.js
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import db from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const processVideoUpload = async (req, res) => {
  try {
    const { animeTitle } = req.body;
    const uploadedFile = req.file;
    const userEmail = req.user?.email || "unknown_user";

    if (!uploadedFile || !animeTitle) {
      return res.status(400).send("Missing video or anime title.");
    }

    const inputPath = uploadedFile.path;
    const baseOutputDir = path.join(__dirname, "..", "public", "Videos", animeTitle);

    // ✅ Create base and subfolders automatically
    const qualities = ["360p", "720p", "1080p"];
    for (const q of qualities) {
      const dir = path.join(baseOutputDir, q);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created folder: ${dir}`);
      }
    }

    // ✅ FFmpeg encoding commands
    const commands = [
      {
        quality: "360p",
        cmd: `ffmpeg -i "${inputPath}" -vf scale=-1:360 -c:v libx264 -crf 28 -preset fast -c:a aac -hls_time 10 -hls_list_size 0 -hls_segment_filename "${baseOutputDir}/360p/segment%d.ts" "${baseOutputDir}/360p/playlist.m3u8"`
      },
      {
        quality: "720p",
        cmd: `ffmpeg -i "${inputPath}" -vf scale=-1:720 -c:v libx264 -crf 24 -preset fast -c:a aac -hls_time 10 -hls_list_size 0 -hls_segment_filename "${baseOutputDir}/720p/segment%d.ts" "${baseOutputDir}/720p/playlist.m3u8"`
      },
      {
        quality: "1080p",
        cmd: `ffmpeg -i "${inputPath}" -vf scale=-1:1080 -c:v libx264 -crf 20 -preset fast -c:a aac -hls_time 10 -hls_list_size 0 -hls_segment_filename "${baseOutputDir}/1080p/segment%d.ts" "${baseOutputDir}/1080p/playlist.m3u8"`
      }
    ];

    // ✅ Sequential encoding to manage CPU load
    for (const { cmd, quality } of commands) {
      console.log(`⚙️ Encoding ${quality}...`);
      await new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
          if (err) {
            console.error(`❌ Error encoding ${quality}:`, err.message);
            return reject(err);
          }
          console.log(`✅ ${quality} encoding done.`);
          resolve();
        });
      });
    }

    // ✅ Generate master playlist
    const masterPath = path.join(baseOutputDir, "master.m3u8");
    const masterContent = `#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=500000,RESOLUTION=640x360
360p/playlist.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=1500000,RESOLUTION=1280x720
720p/playlist.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=3000000,RESOLUTION=1920x1080
1080p/playlist.m3u8`;

    fs.writeFileSync(masterPath, masterContent);
    console.log(`🧾 Master playlist created at: ${masterPath}`);

    const normalizedPath = masterPath
  .replace(/\\/g, "/")           // Convert Windows \ to /
  .replace("/Public/", "/public/"); // Force lowercase 'public' for consistency
    // ✅ Store metadata in DB
    await db.query(
      "INSERT INTO videos (anime_title, uploader_email, file_path, created_at) VALUES ($1, $2, $3, NOW())",
      [animeTitle, userEmail, normalizedPath]
    );

    // ✅ Delete temp upload file
    fs.unlinkSync(inputPath);
    console.log(`🗑️ Temporary file deleted: ${inputPath}`);

    console.log(`🎥 ${userEmail} successfully uploaded "${uploadedFile.originalname}" for ${animeTitle}`);
    res.status(200).send("✅ Video uploaded and processed successfully!");
  } catch (err) {
    console.error("❌ Video processing failed:", err);
    res.status(500).send("Internal error while processing video.");
  }
};
