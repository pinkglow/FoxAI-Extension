import React from "react";
import "./index.css";

import { observer } from 'mobx-react-lite';
import LogoSVG from "../svgs/logo";
import { PaperPlaneSVG, DeleteSVG, SettingSVG } from "../svgs/icon";
import {useTranslation} from "react-i18next";

import sliderStore from "../../store/slider";


const PanelHeader = observer(({ onEnter, onClose, children }) => {
  const { userPrompt, setUserPrompt, isLoading } = sliderStore;
  const textAreaRef = React.useRef(null);
  const {t} = useTranslation();

  const handleUserPromptChange = () => {
    if (!textAreaRef.current || textAreaRef.current.value.length > 2000) return;
    const value = textAreaRef.current.value;
    setUserPrompt(value);
  };

  React.useEffect(() => {
    resizeTextArea();
  }, [userPrompt]);

  const resizeTextArea = () => {
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";

    if (textAreaRef.current.scrollHeight >= 120) {
      textAreaRef.current.style.overflowY = "overlay";
    } else {
      textAreaRef.current.style.overflowY = "hidden";
    }
  };

  const handleClosePanel = () => {
    if (!onClose) return;
    onClose();
  }

  const openSettingPage = () => {
    let settingUrl = chrome.runtime.getURL('admin.html');
    window.open(settingUrl);
  }

  return (
    <>
      <div
        onKeyDown={(e) => {
          if (e.shiftKey && e.key === "Enter") return;
          if (e.key !== "Enter") return;
          onEnter();
          e.preventDefault();
        }}
        className="panel-header rounded-[10px] foxai-shadow w-[600px] bg-[white]"
      >
        <div className="py-[4px]">
          {children}
          <div className="panel-control px-[20px] pt-[4px] flex flex-row items-end justify-between">
            <div className="input-wrapper flex flex-row items-end w-full">
              <div className={`logo-container flex items-center rounded-full mr-[8px] ${isLoading && 'rotate-effect'} `}>
                <LogoSVG size={20} fill={"none"} />
              </div>
              <textarea
                rows={1}
                value={userPrompt}
                ref={textAreaRef}
                className="prompt-input foxai-scroll overflow-hidden"
                placeholder={t("panel.placeholder")}
                onChange={handleUserPromptChange}
              />
            </div>

            <div className="control-bar pl-[8px] flex flex-row items-center">
              <div
                onClick={onEnter}
                className="send flex items-center p-[2px] rounded-full hover:bg-[#f3f3f3]">
                <PaperPlaneSVG size={18} fill={userPrompt ? "#1d9bf0" : "#6d6d6d"} />
              </div>

              <div
                onClick={() => openSettingPage()}
                className="flex items-center ml-[1px] p-[3px] rounded-full hover:bg-[#f3f3f3]"
              >
                <SettingSVG size={18} fill={"#6d6d6d"} />
              </div>

              <div
                onClick={() => handleClosePanel()}
                className="flex items-center ml-[1px] p-[6px] rounded-full hover:bg-[#f3f3f3]">
                <DeleteSVG size={10} fill={"#6d6d6d"} />
              </div>

            </div>

          </div>
        </div>
      </div>

    </>
  )
});

export default PanelHeader;