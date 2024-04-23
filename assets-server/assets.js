const multer = require("multer");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT;
// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
});

// Middleware
app.use(express.json());
app.use(bodyParser.json());

app.get("/api/check", (req, res) => {
  console.log("checked");
  res.status(200).json({
    msg: "its worked!",
  });
});
// Route to handle image uploads
app.post("/api/uploadImage", upload.single("imageData"), async (req, res) => {
  try {
    const file = req.file;
    const { fileType } = req.body;
    if (!file) {
      return res.json({ success: false, message: "File is empty" });
    }
    file.mimetype = fileType;
    if (!fileType) {
      return res.json({ success: false, message: "File is empty" });
    }
    const url = `${process.env.ASSETS_URL}/uploads/${file.filename}`;
    res.json({ success: true, url, mediaType: file.mimetype });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Assets server is running on port ${PORT}`);
});
