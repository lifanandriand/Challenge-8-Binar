const { imagekit } = require("../helpers/imagekit");
const jwt = require("jsonwebtoken")
const { Biodata, User } = require("../models");

module.exports = {
  imageKit: async (req, res) => {
    try {
      const file = req.file.buffer.toString("base64");
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = uniqueSuffix + req.file.originalname;

      const upload = await imagekit.upload({
        fileName: fileName,
        file: file,
      });

      if(upload) {
        const url = upload.url;
        const token = req.headers.authorization
        const user = jwt.decode(token.split(' ')[1])
        let bio = await Biodata.findOne({
          where: { user_id: user.id },
        });

        let updated = await bio.update({
          photo: url,
        });

        return res.status(200).json({
          status: 200,
          message: "File uploaded successfully",
          data: {
              ...upload,
          },
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },

  video: async (req, res) => {
    try {
      const file = req.file.buffer.toString("base64");
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = uniqueSuffix + req.file.originalname;

      const upload = await imagekit.upload({
        fileName: fileName,
        file: file,
      });

      if(upload) {
        return res.status(200).json({
          status: 200,
          message: "Video uploaded successfully",
          data: {
              ...upload,
          },
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: err.message,
      });
    }
  },
};

