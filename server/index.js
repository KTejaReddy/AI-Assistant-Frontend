import express from "express";
import cors from "cors";
import multer from "multer";
import { visionAnalysis, generateReasoning } from "./hf-service.js";

const app = express();
const port = 3001;

// Setup Multer for image uploads (buffers)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

// Vision endpoint: Analyzes a screenshot
app.post("/api/vision", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image provided" });
    const description = await visionAnalysis(req.file.buffer);
    res.json({ description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reasoning endpoint: Combines user voice and screen description
app.post("/api/reason", async (req, res) => {
  const { voice, description } = req.body;
  try {
    const response = await generateReasoning(voice, description);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
