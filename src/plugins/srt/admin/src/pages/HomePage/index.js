import React, { useState } from "react";
import pluginId from "../../pluginId";
import axios from "axios";
import { Button, Loader } from "@strapi/design-system";
const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSucces, setIsSucces] = useState(false);
  const [message, setMessage] = useState("");
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage("")
    setIsSucces(false)
    setIsLoading(false)
  };
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setMessage("Пожалуйста, выберите файл для загрузки.");
      return;
    }
    setMessage("");
    setIsLoading(true);
    setIsSucces(false);
    try {
      const formData = new FormData();
      formData.append("files", selectedFile);

      const res = (
        await axios.post(`/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      ).data;

      const json = (await axios.post(`/api/srt`, { url: res[0].url })).data;
      if (res && json) {
        setMessage(`Файл успешно обработан.`);
        setIsLoading(false);
        setIsSucces(true);
      }
    } catch (error) {
      console.error("Произошла ошибка при загрузке файла:", error);
      setIsLoading(false);
      setMessage("Произошла ошибка при загрузке файла. 123");
    }
  };

  return (
    <div
      style={{
        color: "white",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      <input
        type="file"
        onChange={handleFileChange}
        accept=".srt"
        style={{
          cursor: "pointer",
          background: "rgb(73, 69, 255)",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "5px",
        }}
      />
      {isLoading && <h1>Это займёт несколько минут</h1>}
      <Button
        style={{
          width: "max-content",
          height: "max-content",
        }}
        disabled={isLoading}
        onClick={handleFileUpload}
      >
        {isLoading ? <Loader /> : <p>Загрузить SRT файл</p>}
      </Button>
      {message && message}

      {isSucces && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              marginBottom: "15px",
              fontSize: "32px",
            }}
          >
            Скачайте результат
          </h1>
          <a
            style={{
              marginBottom: "20px",
              textDecoration: "underline",
              fontSize: "20px",
              color: "white",
              transition: "color 0.3s",
            }}
            download
            href={`/uploads/zh_subtitles.json`}
            onMouseEnter={(e) => (e.target.style.color = "rgb(73, 69, 255)")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            Китайские субтитры
          </a>
          <a
            style={{
              marginBottom: "20px",
              textDecoration: "underline",
              fontSize: "20px",
              color: "white",
              transition: "color 0.3s",
            }}
            download
            href={`/uploads/ru_subtitles.json`}
            onMouseEnter={(e) => (e.target.style.color = "rgb(73, 69, 255)")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            Русский субтитры
          </a>
          <a
            style={{
              marginBottom: "20px",
              textDecoration: "underline",
              fontSize: "20px",
              color: "white",
              transition: "color 0.3s",
            }}
            download
            href={`/uploads/en_subtitles.json`}
            onMouseEnter={(e) => (e.target.style.color = "rgb(73, 69, 255)")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            Английские субтитры
          </a>
        </div>
      )}
    </div>
  );
};

export default HomePage;
