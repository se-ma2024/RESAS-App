import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import "./Chart.css";

interface PopulationData {
  prefCode: number;
  prefName: string;
  data: { year: number; value: number }[];
}

interface Props {
  selectedPrefectures: { [prefCode: number]: string };
}

const PopulationGraph: React.FC<Props> = ({ selectedPrefectures }) => {
  const [populationData, setPopulationData] = useState<PopulationData[]>([]);
  const [selectedDataType, setSelectedDataType] = useState<string>("総人口");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = Object.entries(selectedPrefectures).map(
          async ([prefCode, prefName]) => {
            const response = await axios.get(
              `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCode}`,
              {
                headers: {
                  "X-API-KEY": process.env.REACT_APP_API_KEY as string,
                },
              }
            );
            return {
              prefCode: parseInt(prefCode),
              prefName,
              data: response.data.result.data
                .find((item: any) => item.label === selectedDataType)
                .data.map((item: any) => ({
                  ...item,
                  prefecture: prefName,
                })),
            };
          }
        );

        const fetchedData = await Promise.all(promises);
        setPopulationData(fetchedData);
      } catch (error) {
        console.error("Error fetching population data:", error);
      }
    };

    if (Object.keys(selectedPrefectures).length > 0) {
      fetchData();
    } else {
      setPopulationData([]);
    }
  }, [selectedPrefectures, selectedDataType]);

  const handleDataTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDataType(event.target.value);
  };

  if (Object.keys(selectedPrefectures).length === 0) {
    return null;
  }

  return (
    <div className="chart-container">
      <div className="radio-buttons-container">
        <div className="radio-button">
          <input
            type="radio"
            id="totalPopulation"
            name="dataType"
            value="総人口"
            checked={selectedDataType === "総人口"}
            onChange={handleDataTypeChange}
          />
          <label htmlFor="totalPopulation">総人口</label>
        </div>
        <div className="radio-button">
          <input
            type="radio"
            id="youngPopulation"
            name="dataType"
            value="年少人口"
            checked={selectedDataType === "年少人口"}
            onChange={handleDataTypeChange}
          />
          <label htmlFor="youngPopulation">年少人口</label>
        </div>
        <div className="radio-button">
          <input
            type="radio"
            id="workingAgePopulation"
            name="dataType"
            value="生産年齢人口"
            checked={selectedDataType === "生産年齢人口"}
            onChange={handleDataTypeChange}
          />
          <label htmlFor="workingAgePopulation">生産年齢人口</label>
        </div>
        <div className="radio-button">
          <input
            type="radio"
            id="elderlyPopulation"
            name="dataType"
            value="老年人口"
            checked={selectedDataType === "老年人口"}
            onChange={handleDataTypeChange}
          />
          <label htmlFor="elderlyPopulation">老年人口</label>
        </div>
      </div>
      <ResponsiveContainer>
        <LineChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="year" allowDuplicatedCategory={false} />
          <YAxis />
          <Tooltip />
          <Legend />
          {populationData.map((data, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey="value"
              name={`${data.prefName}`}
              stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              data={data.data}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopulationGraph;
