var express = require('express');
var router = express.Router();
var { uploadController, streamController, videoListController } = require("../controller/VideoController");


router.post('/upload', uploadController);
router.get("/stream/:videoName", streamController);
router.get("/videos", videoListController);

module.exports = router;
