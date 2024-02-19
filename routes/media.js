const express = require("express");
const mediaController = require("../controllers/mediaController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }

    if (!fs.existsSync("public/audios")) {
      fs.mkdirSync("public/audios");
    }

    cb(null, "");
  },
  filename: function (req, file, cb) {
    cb(null, "temp.mp3");
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);

    if (ext !== ".wav" && ext !== ".mp3") {
      return cb(new Error("Only Audios are allowed!"));
    }

    cb(null, true);
  },
});

const router = express.Router();

//get all media
router.get("/all", mediaController.getAll);

//post create new media
router.post(
  "/create",
  upload.fields([
    {
      name: "audios",
      maxCount: 5,
    },
  ]),
  mediaController.create
);

module.exports = router;
