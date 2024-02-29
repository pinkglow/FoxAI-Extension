import React from "react";
import "./index.css";

import { observer } from "mobx-react-lite";
import sliderStore from "../../store/slider";

const PanelContext = observer(() => {
  const { selection } = sliderStore;
  return (
    <>
      <div className="foxai-context px-[20px] pb-[8px] text-[14px] text-[#6a6a6a]">
        <div className="flex flex-row items-start">
          <div className="">
            Context:
          </div>
          <div className="selection ml-[5px]  overflow-hidden">
            {selection}
          </div>
        </div>
      </div>
    </>
  )
});

export default PanelContext;