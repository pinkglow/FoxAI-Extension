import React from "react";
import "./index.css";

import { observer } from "mobx-react-lite";
import sliderStore from "../../store/slider";

const PanelStatus = observer(() => {
  const { statusText } = sliderStore;
  return (
    <>
      <div className="foxai-header-status px-[20px] pb-[8px] ">
        <div className="flex flex-row items-start">
          <div className="status-text  font-bold text-[#1d1d1d] text-[14px]">
            {statusText}
          </div>
        </div>
      </div>
    </>
  )
});

export default PanelStatus;