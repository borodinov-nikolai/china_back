import fetch from "node-fetch";
import jose from "node-jose"
import { private_key } from "./authorized_key.json";
import fs from 'fs'
import { Client } from "ssh2";
import hanzi from 'hanzi'
interface Line {
  id: string;
  startTime: string;
  startSeconds: number;
  endTime: string;
  endSeconds: number;
  text: string;
}


export const rebuildAndRestart = async () => {
  try {
    const conn = new Client();

    conn
      .on("ready", () => {
        conn.exec("cd .. && bash /restart.sh", (err, stream) => {
          if (err) throw err;
          stream
            .on("close", (code, signal) => {
              if (code === 0) {
                console.log({ message: "Скрипт успешно выполнен" });
              } else {
                console.log({
                  message: "Произошла ошибка при выполнении скрипта",
                });
              }
              conn.end();
            })
            .on("data", (data) => {
              console.log("STDOUT: " + data);
            })
            .stderr.on("data", (data) => {
            console.log("STDERR: " + data);
          });
        });
      })
      .connect({
        host: "91.186.196.33",
        username: "root",
        password: "y@h+pM7EYswAaF",
      });
  } catch (error) {
    console.error("Ошибка:", error);
    console.log({ message: "Произошла ошибка при выполнении скрипта" });
  }
};
class Parser {
  seperator = ",";

  timestampToSeconds(srtTimestamp: string) {
    const [rest, millisecondsString] = srtTimestamp.split(",");
    const milliseconds = parseInt(millisecondsString);
    const [hours, minutes, seconds] = rest.split(":").map((x) => parseInt(x));
    const result = milliseconds * 0.001 + seconds + 60 * minutes + 3600 * hours;

    // fix odd JS roundings, e.g. timestamp '00:01:20,460' result is 80.46000000000001
    return Math.round(result * 1000) / 1000;
  }

  correctFormat(time: string) {
    // Fix the format if the format is wrong
    // 00:00:28.9670 Become 00:00:28,967
    // 00:00:28.967  Become 00:00:28,967
    // 00:00:28.96   Become 00:00:28,960
    // 00:00:28.9    Become 00:00:28,900

    // 00:00:28,96   Become 00:00:28,960
    // 00:00:28,9    Become 00:00:28,900
    // 00:00:28,0    Become 00:00:28,000
    // 00:00:28,01   Become 00:00:28,010
    // 0:00:10,500   Become 00:00:10,500
    let str = time.replace(".", ",");

    var hour = null;
    var minute = null;
    var second = null;
    var millisecond = null;

    // Handle millisecond
    var [front, ms] = str.split(",");
    millisecond = this.fixed_str_digit(3, ms);

    // Handle hour
    var [a_hour, a_minute, a_second] = front.split(":");
    hour = this.fixed_str_digit(2, a_hour, false);
    minute = this.fixed_str_digit(2, a_minute, false);
    second = this.fixed_str_digit(2, a_second, false);

    return `${hour}:${minute}:${second},${millisecond}`;
  }

  /*
    // make sure string is 'how_many_digit' long
    // if str is shorter than how_many_digit, pad with 0
    // if str is longer than how_many_digit, slice from the beginning
    // Example:

    Input: fixed_str_digit(3, '100')
    Output: 100
    Explain: unchanged, because "100" is 3 digit

    Input: fixed_str_digit(3, '50')
    Output: 500
    Explain: pad end with 0

    Input: fixed_str_digit(3, '50', false)
    Output: 050
    Explain: pad start with 0

    Input: fixed_str_digit(3, '7771')
    Output: 777
    Explain: slice from beginning
    */
  private fixed_str_digit(
    how_many_digit: number,
    str: string,
    padEnd: boolean = true
  ) {
    if (str.length == how_many_digit) {
      return str;
    }
    if (str.length > how_many_digit) {
      return str.slice(0, how_many_digit);
    }
    if (str.length < how_many_digit) {
      if (padEnd) {
        return str.padEnd(how_many_digit, "0");
      } else {
        return str.padStart(how_many_digit, "0");
      }
    }
  }

  private tryComma(data: string) {
    data = data.replace(/\r/g, "");
    var regex =
      /(\d+)\n(\d{1,2}:\d{2}:\d{2},\d{1,3}) --> (\d{1,2}:\d{2}:\d{2},\d{1,3})/g;
    let data_array = data.split(regex);
    data_array.shift(); // remove first '' in array
    return data_array;
  }

  private tryDot(data: string) {
    data = data.replace(/\r/g, "");
    var regex =
      /(\d+)\n(\d{1,2}:\d{2}:\d{2}\.\d{1,3}) --> (\d{1,2}:\d{2}:\d{2}\.\d{1,3})/g;
    let data_array = data.split(regex);
    data_array.shift(); // remove first '' in array
    this.seperator = ".";
    return data_array;
  }

  fromSrt(data: string) {
    var originalData = data;
    var data_array = this.tryComma(originalData);
    if (data_array.length == 0) {
      data_array = this.tryDot(originalData);
    }

    var items = [];
    for (var i = 0; i < data_array.length; i += 4) {
      const startTime = this.correctFormat(data_array[i + 1].trim());
      const endTime = this.correctFormat(data_array[i + 2].trim());
      var new_line = {
        id: data_array[i].trim(),
        startTime,
        startSeconds: this.timestampToSeconds(startTime),
        endTime,
        endSeconds: this.timestampToSeconds(endTime),
        text: data_array[i + 3].trim(),
      };
      items.push(new_line);
    }

    return items;
  }

  toSrt(data: Array<Line>) {
    var res = "";

    const end_of_line = "\r\n";
    for (var i = 0; i < data.length; i++) {
      var s = data[i];
      console.log(data[i])
      res += s.id + end_of_line;
      res += s.startTime + " --> " + s.endTime + end_of_line;
      res += s.text.replace("\n", end_of_line) + end_of_line + end_of_line;
    }

    return res;
  }
}

export const segmentate = async (json) => {
  hanzi.start();
  try {
    const segments = json.map((element) => {
      const segments = hanzi.segment(element.text);
      return { ...element, text: segments };
    });
    return segments;
  } catch (error) {
    console.error("Что-то пошло не по плану:", error);
  }
};


const key = private_key;
const serviceAccountId = process.env.SERVICE_ACCOUNT_ID || "ajepr18l6sq9u3fgtkgl";
const keyId = process.env.KEY_ID || "ajeg4v0f325877g1jt51";
const now = Math.floor(new Date().getTime() / 1000);
let jwt;

const payload = {
  aud: "https://iam.api.cloud.yandex.net/iam/v1/tokens",
  iss: serviceAccountId,
  iat: now,
  exp: now + 3600,
};

async function generateJWT() {
  const keyObject = await jose.JWK.asKey(key, "pem", {
    kid: keyId,
    alg: "PS256",
  });
  const result = await jose.JWS.createSign({ format: "compact" }, keyObject)
    .update(JSON.stringify(payload))
    .final();
  jwt = result;
}

export async function getIam() {
  try {
    await generateJWT()
    const response = await fetch(
      "https://iam.api.cloud.yandex.net/iam/v1/tokens",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jwt: jwt }),
      }
    );
    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

const folder_id = process.env.FOLDER_ID || "b1giv98jjj4eg0b6e4pa";
const target_language_en = "en"; // Целевой язык en
const target_language_ru = "ru"; // Целевой язык ru

export async function translateTexts(texts, targetLanguageCode, iam_token) {
    let headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${iam_token}`,
      };
  try {
    const response = await fetch(
        "https://translate.api.cloud.yandex.net/translate/v2/translate",
        {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ targetLanguageCode, texts, folderId: folder_id }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      return data.translations;
  } catch (error) {
    console.error(error.response);
    return [];
  }
}

export async function translateChineseSubtitles(chineseSubtitles, iam_token) {
  const chineseTexts = chineseSubtitles.map(subtitle => subtitle.text);

  const MAX_TEXT_STRINGS = 500;
  const totalTexts = chineseTexts.length;
  let currentIndex = 0;

  const translatedTextsEn = [];
  const translatedTextsRu = [];

  while (currentIndex < totalTexts) {
    const chunk = chineseTexts.slice(currentIndex, currentIndex + MAX_TEXT_STRINGS);
    const chunkTranslationsEn = await translateTexts(chunk, target_language_en, iam_token);
    const chunkTranslationsRu = await translateTexts(chunk, target_language_ru, iam_token);
    translatedTextsEn.push(...chunkTranslationsEn);
    translatedTextsRu.push(...chunkTranslationsRu);
    currentIndex += MAX_TEXT_STRINGS;
  }

  const translatedSubtitlesEn = chineseSubtitles.map((subtitle, index) => ({
    ...subtitle,
    text: [translatedTextsEn[index].text],
    detectedLanguage: translatedTextsEn[index].detectedLanguage,
  }));

  const translatedSubtitlesRu = chineseSubtitles.map((subtitle, index) => ({
    ...subtitle,
    text: [translatedTextsRu[index].text],
    detectedLanguage: translatedTextsRu[index].detectedLanguage,
  }));

  const filePathEn = `public/uploads/${target_language_en}_subtitles.json`;
  const filePathRu = `public/uploads/${target_language_ru}_subtitles.json`;

  fs.writeFileSync(filePathEn, JSON.stringify(translatedSubtitlesEn, null, 2));
  fs.writeFileSync(filePathRu, JSON.stringify(translatedSubtitlesRu, null, 2));
}

export default Parser;
export { Line };
