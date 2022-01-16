//#region 로컬 파일 이름 읽기
const testFolder = "/Users/minsekim/Downloads";
const fs = require("fs");
fs.readdir(testFolder, (err, files) => {
  files.forEach((file) => {
    console.log(file);
  });
});
//#endregion

// const AWS = require("aws-sdk");
// const s3 = new AWS.S3({
//   accessKeyId: "AKIARJUDLWHEO44V55GR",
//   secretAccessKey: "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",
// });
// const params = {
//   Bucket: "circlin-plus",
//   Key:"clip/1"
// }
// s3.getObject(params, (err, data) => {
//   if (err) throw err;
//   // fs.writeFileSync()
//   console.log(data)
// })

// Load the SDK and UUID
const AWS = require("aws-sdk");
const uuid = require("uuid");

// Create unique bucket name
const bucket = new AWS.S3({ apiVersion: "2006-03-01" });
const membersBucketName = "circlin-plus"; // + uuid.v4();
const hlsBucketName = "circlin-members-hls"; // + uuid.v4();
// Create name for uploaded object key
const keyName = "clip/1/YP7bye3wpnOaiSJPD4zrlr9d9enD0tKsGvhd0IrE.m4v";

// Create a promise on S3 service object
const membersPromise = bucket.createBucket({ Bucket: membersBucketName }).promise();
const hlsPromise = bucket.createBucket({ Bucket: hlsBucketName }).promise();

// Handle promise fulfilled/rejected states
membersPromise
  .then(function (data) {
    // PUT Object
    // var objectParams = { Bucket: bucketName, Key: keyName, Body: "Hello World!" };
    // var uploadPromise = bucket.putObject(objectParams).promise();
    // uploadPromise.then(
    //   function(data) {
    //     console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
    //   });

    // GET Object
    const getParams = { Bucket: bucketName, Key: keyName };
    bucket.getObject(getParams, function (err, data) {
      console.log(err, data);
    });
  })
  .catch(function (err) {
    console.error(err, err.stack);
  });

//#region ffmpeg 압축 및 Blob화
// https://medium.com/@HoseungJang/node-js-express-hls%EB%A1%9C-%EB%8F%99%EC%98%81%EC%83%81-%EC%8A%A4%ED%8A%B8%EB%A6%AC%EB%B0%8D%ED%95%98%EA%B8%B0-46006408a0e6
// const ffmpeg = require('fluent-ffmpeg');
// const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

// ffmpeg.setFfmpegPath(ffmpegInstaller.path);
// ffmpeg("videos/lala1080p_raw.mp4", {
//   timeout: 432000,
// })
//   .size("1920x1080")
//   .output("videos/video_output.mp4")
//   .addOptions([
//     "-profile:v baseline",
//     "-level 3.0",
//     "-start_number 0",
//     "-hls_time 10", //10초 단위로 분할합니다!
//     "-hls_init_time 1",
//     "-hls_list_size 0",
//     "-f hls", //포맷입니다.
//   ])
//   .output("videos/output.m3u8")
//   .on("end", () => {
//     console.log("end");
//   })
//   .run();

//#endregion

// node ffmpeg.js하면 out0~9까지 생성됩니다.
