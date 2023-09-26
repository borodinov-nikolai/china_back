import React, { useState } from "react";
import axios from "axios";
import { Button, Loader } from "@strapi/design-system";
const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleServerUpdate = async () => {
    setIsLoading(true);
    const res = await (await axios.post(`/api/update`)).data;
    setIsLoading(false);
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
      <Button
        style={{
          width: "max-content",
          height: "max-content",
        }}
        disabled={isLoading}
        onClick={handleServerUpdate}
      >
        {isLoading ? <Loader /> : <p>Перезагрузить сайт</p>}
      </Button>
    </div>
  );
};

export default HomePage;
