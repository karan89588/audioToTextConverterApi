const Media = require("../Models/media");
const OpenAI = require("openai");
const fs = require("fs");

exports.getAll = async (req, res) => {
  try {
    const media = await Media.find();

    res.json(media);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
// Backendurl/public/audios/file_name.mp4
exports.create = async (req, res) => {
  const { name } = req.body;
  let audiosPaths = [];
  try {
    if (Array.isArray(req.files.audios) && req.files.audios.length > 0) {
      for (let audio of req.files.audios) {
        audiosPaths.push("/" + audio.path);
      }
    }
    const openai = new OpenAI({
      apiKey: process.env.openai_key,
    });
    console.log("yes");
    let transcript = "";

    console.log("wait....");
    transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream("temp.mp3"),
      model: "whisper-1",
    });
    console.log("fetched");
    return res.send({
      msg: "Transcript fetched Successfully",
      success: true,
      transcript,
    });
  } catch (error) {
    console.log("error", error);
    return res.send({
      msg: "Error in fetching transcript",
      success: false,
      error,
    });
  }
  //   try {
  //     const createdMedia = await Media.create({
  //       name,
  //       audios: audiosPaths,
  //     });

  //     res.json({ message: "Media created successfully", createdMedia });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(400).json(error);
  //   }
};
