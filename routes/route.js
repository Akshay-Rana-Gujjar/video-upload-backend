var express = require('express');
var router = express.Router();
var { uploadController, streamController } = require("../controller/VideoController");


router.post('/upload', uploadController);
router.get("/stream/:videoName", streamController);

module.exports = router;
