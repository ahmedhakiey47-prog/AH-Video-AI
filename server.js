import express from "express";
import dotenv from "dotenv";
import { config, higgsfield } from "@higgsfield/client/v2";

dotenv.config();

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

if (!process.env.HF_CREDENTIALS) {
  console.warn("HF_CREDENTIALS is not configured yet.");
} else {
  config({ credentials: process.env.HF_CREDENTIALS });
}

app.post("/api/generate", async (req, res) => {
  try {
    if (!process.env.HF_CREDENTIALS) {
      return res.status(500).json({ error: "ضع HF_CREDENTIALS في ملف .env أولاً." });
    }

    const {
      prompt,
      duration = 5,
      aspect_ratio = "9:16",
      resolution = "720p",
      generate_audio = true
    } = req.body;

    if (!prompt || prompt.trim().length < 3) {
      return res.status(400).json({ error: "اكتب وصفًا للفيديو." });
    }

    const allowedDurations = [5, 10, 15];
    const d = allowedDurations.includes(Number(duration)) ? Number(duration) : 5;
    const allowedRatios = ["9:16", "16:9", "1:1", "4:3", "3:4", "21:9"];
    const ratio = allowedRatios.includes(aspect_ratio) ? aspect_ratio : "9:16";
    const allowedRes = ["480p", "720p", "1080p", "4k"];
    const reso = allowedRes.includes(resolution) ? resolution : "720p";

    const result = await higgsfield.subscribe(
      "bytedance/seedance-2.0/text-to-video",
      {
        input: {
          prompt: prompt.trim(),
          duration: d,
          resolution: reso,
          aspect_ratio: ratio,
          generate_audio: Boolean(generate_audio)
        },
        withPolling: true
      }
    );

    res.json({
      ok: true,
      video: result?.video ?? null,
      result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "حصل خطأ أثناء توليد الفيديو.",
      details: error?.message || String(error)
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`AH Video AI running on http://localhost:${process.env.PORT || 3000}`);
});
