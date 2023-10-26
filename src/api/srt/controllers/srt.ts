import fs from "fs";
import Parser, { getIam, segmentate, translateChineseSubtitles, rebuildAndRestart } from "../functions";

export default {
  exampleAction: async (ctx)  => {
    const srtFilePath =  "public" + ctx.request.body.url;
    const uploadDir = 'public/uploads';
    try {
      fs.readdirSync(uploadDir).forEach(file => {
        const filePath = uploadDir + "/" + file;
        if (filePath !== srtFilePath && filePath !== 'public/uploads/.gitkeep') {
          fs.unlinkSync(filePath); // Удаляем файл, если это не тот, что в srtFilePath
        }
      });
      const srtData = fs.readFileSync(srtFilePath, "utf-8");
      const parser = new Parser();
      const json = parser.fromSrt(srtData);
      const segmentated = await segmentate(json);
      const { iamToken } = await getIam()
      await translateChineseSubtitles(json, iamToken)

      fs.writeFile(
        "public/uploads/zh_subtitles.json",
        JSON.stringify(segmentated, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("Файл успешно создан.");
        }
      );
      ctx.body = "всё отлично"
    } catch (error) {
      console.error("Произошла ошибка при обработке файла:", error);
      ctx.body = "Произошла ошибка при обработке файла.";
    }
  },
  getAction: async (ctx) => {
    ctx.body = "Файл успешно получен и обработан.";
  },
  updateServer: async (ctx) => {
    try {
      await rebuildAndRestart()
      ctx.body = "Сервер успешно перезапущен";
    } catch (error) {
      ctx.body = "Не получилось";
    }

  },
};
