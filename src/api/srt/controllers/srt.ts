import fs from "fs";
import Parser, { getIam, segmentate, translateChineseSubtitles, rebuildAndRestart } from "../functions";

export default {
  exampleAction: async (ctx) => {
    const srtFilePath = ctx.request.body.url;
    try {
      const srtData = fs.readFileSync(`public${srtFilePath}`, "utf-8");
      const parser = new Parser();
      const json = parser.fromSrt(srtData);
      const segmentated = await segmentate(json);
      const { iamToken } = await getIam()
      await translateChineseSubtitles(json, iamToken)
      if (fs.existsSync("public/uploads/zh_subtitles.json")) {
        fs.unlinkSync("public/uploads/zh_subtitles.json");
      }
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
