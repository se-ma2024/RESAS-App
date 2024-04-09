import React, { useEffect, useState } from "react";
import axios from "axios";

interface Prefecture {
  prefCode: number;
  prefName: string;
}

const Styles: { [key: string]: React.CSSProperties } = {
  checkcardList: {
    display: "flex",
    flexWrap: "wrap",
    padding: "10px",
    justifyContent: "flex-start",
    justifySelf: "auto",
  },
  text: { display: "contents", marginLeft: "1em", cursor: "pointer" },
  checkcard: {
    borderRadius: "12px",
    border: "solid 1px",
    textAlign: "center",
    padding: "10px 12px 8px 8px",
    margin: "0.5rem",
  },
};

const CheckField: React.FC = () => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);

  useEffect(() => {
    axios
      .get<{ result: Prefecture[] }>(
        "https://opendata.resas-portal.go.jp/api/v1/prefectures",
        {
          headers: { "X-API-KEY": process.env.REACT_APP_API_KEY as string },
        }
      )
      .then((response) => {
        setPrefectures(response.data.result);
      })
      .catch((error) => {
        console.error("Error fetching prefectures:", error);
      });
  }, []);

  return (
    <div style={Styles.checkcardList}>
      {prefectures.map((prefecture) => (
        <div style={Styles.checkcard} key={prefecture.prefName}>
          <input
            type="checkbox"
            name="prefecture"
            value={prefecture.prefCode}
            id={`checkbox-${prefecture.prefCode}`}
          />
          <label
            htmlFor={`checkbox-${prefecture.prefCode}`}
            style={Styles.text}
          >
            {prefecture.prefName}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckField;
