const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static("public"));

// Set file size limit (e.g. 10MB)
const MAX_SIZE = 10 * 1024 * 1024;

// Configure multer for local uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
});

// File upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  const { originalname, size, path } = req.file;
  const fileSizeMB = (size / (1024 * 1024)).toFixed(2);
  console.log(`File uploaded: ${originalname} (${fileSizeMB} MB)`);

  res.json({
    message: "✅ File uploaded successfully!",
    filename: originalname,
    size: `${fileSizeMB} MB`,
    path,
  });
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling for size limit
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "❌ File too large! Max size 10MB." });
  }
  next(err);
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
