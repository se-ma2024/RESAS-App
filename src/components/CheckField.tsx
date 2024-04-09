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

const CheckField: React.FC<{
  onCheckboxChange: (
    prefName: string,
    prefCode: number,
    checked: boolean
  ) => void;
}> = ({ onCheckboxChange }) => {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);

  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        const response = await axios.get<{ result: Prefecture[] }>(
          "https://opendata.resas-portal.go.jp/api/v1/prefectures",
          {
            headers: { "X-API-KEY": process.env.REACT_APP_API_KEY as string },
          }
        );
        setPrefectures(response.data.result);
      } catch (error) {
        console.error("Error fetching prefectures:", error);
      }
    };

    fetchPrefectures();
  }, []);

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    prefCode: number,
    prefName: string
  ) => {
    onCheckboxChange(prefName, prefCode, event.target.checked);
  };

  return (
    <div style={Styles.checkcardList}>
      {prefectures.map((prefecture) => (
        <div key={prefecture.prefCode} style={Styles.checkcard}>
          <input
            type="checkbox"
            name={prefecture.prefName}
            onChange={(e) =>
              handleCheckboxChange(e, prefecture.prefCode, prefecture.prefName)
            }
          />
          <label style={Styles.text}>{prefecture.prefName}</label>
        </div>
      ))}
    </div>
  );
};

export default CheckField;
