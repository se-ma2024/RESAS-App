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
              data: response.data.result.data[0].data.map((item: any) => ({
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
  }, [selectedPrefectures]);

  if (Object.keys(selectedPrefectures).length === 0) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
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
  );
};

export default PopulationGraph;
