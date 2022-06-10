const express = require("express");
const router = express.Router();

const middleware = require("../middleware");

const media = require("../controllers/media");

router.post("/upload", [middleware.upload], media.imageKit);
router.post("/video", [middleware.upload,middleware.role], media.video);

module.exports = router;
