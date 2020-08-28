var fs = require("fs");

module.exports = {
    uploadController: async function (req, res, next) {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        var videoFileObject = req.files.video; //getting uploaded video object 
        var videoFilePath = process.cwd() + "/public/videos";
        var videoFileName = `${new Date().getTime()}-${videoFileObject.name}`;
        var { videoTitle = videoFileName } = req.body; //getting the video title and set default video title from video name

        try {

            await videoFileObject.mv(videoFilePath + "/" + videoFileName); // saving video at the server

            return res.json({ status: 200, message: "File Uploaded successfully!", error: null, videoUrl: `/stream/${videoFileName}` });

        } catch (error) {
            consooe.log(error);
            return res.status(500).json({ status: 500, mesasage: null, error, videoUrl: null });
        }
    },
    streamController: function (req, res) {
        const path = process.cwd() + '/public/videos/' + req.params.videoName;
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
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(path).pipe(res);
        }

    }
};