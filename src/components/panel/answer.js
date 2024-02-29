import React from "react";
import "./index.css";

import { observer } from "mobx-react-lite";
import answerStore from "../../store/answer";
import ReactMarkdown from 'react-markdown';

const PanelAnswer = observer(() => {
  const { answerList, answerIndex } = answerStore;
  const answerContainerRef = React.useRef(null);

  React.useEffect(() => {
    const answerContainer = answerContainerRef.current;
    answerContainer.scrollTop = answerContainer.scrollHeight;
  }, [answerList]);

  return (
    <>
      <div className="foxai-header-answer px-[20px] pb-[8px] text-[14px] text-[#1a1a1a]">
        <div className="flex flex-row items-start">
          <div
            ref={answerContainerRef}
            className="panel-answer overflow-auto foxai-scroll flex flex-col w-full"
          >
            <ReactMarkdown>
              {answerList[answerIndex].text}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </>
  )
});

export default PanelAnswer;