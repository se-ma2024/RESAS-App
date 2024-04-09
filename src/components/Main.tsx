import React, { useState } from "react";
import CheckField from "./CheckField";
import PopulationGraph from "./Chart";

const Main: React.FC = () => {
  const [selectedPrefectures, setSelectedPrefectures] = useState<{
    [prefCode: number]: string;
  }>({});
  const handleCheckboxChange = (
    prefName: string,
    prefCode: number,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedPrefectures({
        ...selectedPrefectures,
        [prefCode]: prefName,
      });
    } else {
      const updatedPrefectures = { ...selectedPrefectures };
      delete updatedPrefectures[prefCode];
      setSelectedPrefectures(updatedPrefectures);
    }
  };

  return (
    <div className="App">
      {/* CheckFieldコンポーネントを呼び出し */}
      <CheckField onCheckboxChange={handleCheckboxChange} />
      {/* 選択された都道府県の人口推移グラフ */}
      <PopulationGraph selectedPrefectures={selectedPrefectures} />
    </div>
  );
};

export default Main;
