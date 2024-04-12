import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CheckField.css";

interface Prefecture {
  prefCode: number;
  prefName: string;
}

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
    <div className="checkcardList">
      {prefectures.map((prefecture) => (
        <div key={prefecture.prefCode} className="checkcardWrapper">
          <input
            type="checkbox"
            id={`checkbox-${prefecture.prefCode}`}
            className="checkboxInput"
            onChange={(e) =>
              handleCheckboxChange(e, prefecture.prefCode, prefecture.prefName)
            }
          />
          <label
            htmlFor={`checkbox-${prefecture.prefCode}`}
            className="checkboxLabel"
          >
            {prefecture.prefName}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckField;
