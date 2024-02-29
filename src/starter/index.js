import React from "react";
import "./index.css";
import "../i18n/i18n";

import sliderStore from "../store/slider";
import { observer } from "mobx-react-lite";
import LogoSVG from "../components/svgs/logo";
import { TranslateSVG, SettingSVG } from "../components/svgs/icon";


const Starter = observer(({handleTranslate}) => {
  const { setPointer, setSelection, setShowPanel, showPanel } = sliderStore;
  const starterRef = React.useRef(null);
  const {showStarter, setShowStarter} = sliderStore
  const [StarterPosition, setStarterPosition] = React.useState({ x: 0, y: 0 });

  const [mouseHover, setMouseHover] = React.useState(false);

  const calcPanelXY = (mouseX, mouseY, screenWidth, screenHeight) => {
    console.log("calcPanelXY ->", mouseX, mouseY, screenWidth, screenHeight)
    const popupWidth = 620;
    const popupHeight = 465;

    const offsetWidth = 0;

    let x = mouseX;
    let y = mouseY;
    if (x + popupWidth > screenWidth) {
      x = x - (popupWidth - (screenWidth - x));
    }
    if (y + popupHeight > screenHeight) {
      y = y - (popupHeight - (screenHeight - y));
    }

    x += offsetWidth;
    console.log("calcPanelXY ->", x, y);
    if (x === NaN || y === NaN) return;
    setPointer(x, y);
  }


  React.useEffect(() => {

    window.addEventListener("mouseup", function (event) {
      const starter = starterRef.current;
      const { left, right, top, bottom } = starter.getBoundingClientRect();
      const { clientX, clientY } = event;

      // 根据边界 判断点击范围是否在 starter 内
      if (clientX >= left && clientX <= right && clientY >= top && clientY <= bottom) return;
      setShowStarter(false);
    });

    // Starter 负责监听所有来自 content_script 的消息
    window.addEventListener("message", (event) => {
      const { origin, data } = event;
      const { key, val } = data;

      switch (key) {
        case "selection":
          if (showPanel && sliderStore.selection) return;
          let { x, y } = val;
          setSelection(val.text);
          calcPanelXY(x, y, val.screenWidth, val.screenHeight);
          setShowStarter(true);
          setStarterPosition({ x, y });
          break;
        default:
          break;
      }
    });

  }, []);

  const openSettingPage = () => {
    let settingUrl = chrome.runtime.getURL('admin.html');
    window.open(settingUrl);
  };


  return (
    <>
      <div
        ref={starterRef}
        style={{ left: `${StarterPosition.x}px`, top: `${StarterPosition.y}px` }}
        className="foxai-starter absolute z-[2147483600]"
        hidden={!showStarter}
      >
        <div
          onMouseLeave={() => setMouseHover(false)}
          className="starter-logo bg-[black] rounded-full overflow-hidden"
        >
          <div
            className="flex flex-row items-center justify-center text-[white]">
            <div
              onMouseEnter={() => setMouseHover(true)}
              onClick={() => {
                setShowStarter(false);
                setShowPanel(true);
                sliderStore.setShowActions(true);
              }}
              className="logo-container flex items-center p-[4px] hover:bg-[#74666685]">
              <LogoSVG size={22} fill={"none"} />
            </div>

            <div
              style={{
                width: mouseHover ? '60px' : '0px',
                height: mouseHover ? 'auto' : '0px',
                transition: 'all 0.4s ease-in-out'
              }}
              className="flex items-center text-[white]"
            >
              <div
                onClick={handleTranslate}
                className="trans flex items-center py-[6.5px] px-[5px] hover:bg-[#74666685] hover:text-[var(--blue)]">
                <TranslateSVG size={18} fill={"currentColor"} />
              </div>

              <div
                onClick={openSettingPage}
                className="setting flex items-center py-[5px] px-[5px]  hover:bg-[#74666685] hover:text-[var(--blue)]">
                <SettingSVG size={21} fill={"currentColor"} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
});

export default Starter;
