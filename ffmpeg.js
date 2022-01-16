// https://medium.com/@HoseungJang/node-js-express-hls%EB%A1%9C-%EB%8F%99%EC%98%81%EC%83%81-%EC%8A%A4%ED%8A%B8%EB%A6%AC%EB%B0%8D%ED%95%98%EA%B8%B0-46006408a0e6

//#region  파일 이름 읽기 .m4v .mp4
const testFolder = "/Users/minsekim/Downloads";
const { resolve } = require("path");
const walk = require("walk");
var files = [];
const walker = walk.walk(testFolder, { followLinks: false });
walker.on("file", (root, stat, next) => {
  if (stat.name.split(".")[1] === "mp4" || stat.name.split(".")[1] === "m4v") files.push(root + "/" + stat.name);
  next();
});
walker.on("end", async () => {
  const isBlob = true;
  console.log("ALL FILES:", files, "^ ALL FILES");
  // '/Users/minsekim/Downloads/YP7bye3wpnOaiSJPD4zrlr9d9enD0tKsGvhd0IrE.mp4',
  // ]
  const ffmpeg = require("fluent-ffmpeg");
  const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
  ffmpeg.setFfmpegPath(ffmpegInstaller.path);

  function anAction(file) {
    //이미 압축했으면 건너뜀
    if (fileDuplicateCheck(file.split(".")[0] + "/index.m3u8")) {
      console.log("이미 압축한 파일!", file.split(".")[0] + "/index.m3u8");
      return;
    }
    return new Promise((resolve) => {
      console.log("File Process Start: "+file);
      const fileOriginPath = file.split(".")[0];

      //Error catch
      if (fileOriginPath.includes("_zip")) throw "압축을 이미 진행한 파일입니다." + fileOriginPath;

      //#region  Blob or Zip
      const fileFolder = fileOriginPath.split(".")[0];
      const outputPath = `${isBlob ? `${fileFolder}/index.m3u8` : `${fileOriginPath}_zip.mp4`}`;
      mkdir(fileFolder);
      console.log("File Process Start m3u8 Path: " + outputPath);

      if (isBlob)
        ffmpeg(file, {
          timeout: 432000,
        })
          .size("1920x1080")
          .addOptions([
            "-profile:v baseline",
            "-level 3.0",
            "-start_number 0",
            "-hls_time 10", //10초 단위로 분할합니다!
            "-hls_init_time 1",
            "-hls_list_size 0",
            "-f hls", //포맷입니다.
          ])
          .output(outputPath)
          .on("end", () => {
            console.log("File Process End   m3u8 Path: " + outputPath);
            resolve();
          })
          .run();
      else
        ffmpeg(file, {
          timeout: 432000,
        })
          .size("1920x1080")
          .output(outputPath)
          .on("end", () => {
            console.log("File Process End   m3u8 Path: " + outputPath);
            resolve();
          })
          .run();
      //#endregion
    });
  }
  async function start() {
    for (let i = 0; i < files.length - 1; i++) {
      //files.length
      await anAction(files[i]);
    }
    console.log("Done");
    return "basic";
  }
  start();
});

function mkdir(dirPath) {
  const fs = require("fs");
  const isExists = fs.existsSync(dirPath);
  if (!isExists) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
function fileDuplicateCheck(filePath) {
  const fs = require("fs");
  return fs.existsSync(filePath);
  // return boolean
}

//#endregion

// ffmpeg(file, {
//   timeout: 432000,
// })
//   .size("1920x1080")
//   .output("videos/video_output.mp4");
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

// node ffmpeg.js하면 out0~9까지 생성됩니다.
