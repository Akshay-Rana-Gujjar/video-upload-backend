var fs = require("fs");
var firebaseCloudStoarage = require("../config/firebaseConnfig").firestore();
const { VIDEO_COLLECTION_NAME, VIDEO_FILE_PATH } = require("../constants/constants");

module.exports = {
    uploadController: async function (req, res) {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ status: 400, mesasage: null, error: "No files were uploaded.", videoUrl: null });
        }

        var videoFilePath = VIDEO_FILE_PATH;

        if (!fs.existsSync(videoFilePath)) {

            var rawPath = videoFilePath.replace(process.cwd(), "");
            var splitPath = rawPath.split("/");
            var currentPath = process.cwd();

            splitPath.forEach((folder => {
                currentPath = currentPath + "/" +folder;
                if (!fs.existsSync(currentPath))
                    fs.mkdirSync(currentPath);
            }));

        }

        var videoFileObject = req.files.video; //getting uploaded video object 
        var videoFileName = `${new Date().getTime()}-${videoFileObject.name}`;
        var { videoTitle = videoFileName } = req.body; //getting the video title and set default video title from video name

        try {

            await videoFileObject.mv(videoFilePath + "/" + videoFileName); // saving video at the server

            var videoUrl = `/stream/${videoFileName}`;

            await firebaseCloudStoarage
                .collection(VIDEO_COLLECTION_NAME)
                .add({ videoTitle, videoSrc: videoUrl });


            return res.json({ status: 200, message: "File Uploaded successfully!", error: null, videoUrl });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500, mesasage: null, error, videoUrl: null });
        }
    },
    streamController: function (req, res) {
        const path = process.cwd() + "/public/videos/" + req.params.videoName;
        const stat = fs.statSync(path);
        const fileSize = stat.size;
        const range = req.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(path, { start, end });
            const head = {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunksize,
                "Content-Type": "video/mp4",
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                "Content-Length": fileSize,
                "Content-Type": "video/mp4",
            };
            res.writeHead(200, head);
            fs.createReadStream(path).pipe(res);
        }

    },
    videoListController: async (req, res) => {

        try {
            var videosDoc = await firebaseCloudStoarage.collection(VIDEO_COLLECTION_NAME).get();
            videosDoc = videosDoc.docs.map(doc => {
                return { id: doc.id, ...doc.data() };
            });
            res.json({ status: 200, error: null, videoList: videosDoc });

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, error, videoList: null });
        }

    }
};