import React from "react";
import "./index.css";
import "../i18n/i18n";

import {observer} from "mobx-react-lite";

import sliderStore from "../store/slider";
import answerStore from "../store/answer";

import PanelHeader from "../components/panel/header";
import PanelStatus from "../components/panel/status";
import PanelContext from "../components/panel/context";
import PanelAnswer from "../components/panel/answer";

import ActionList from "../components/actions";
import Starter from "../starter";
import {geminiGenerate, generatePrompt, getGeminiAPIKey} from "../hook/gemini";

import {useTranslation} from "react-i18next";
import {getLocalStorage, langOptions} from "../utils";


const Slider = observer(() => {
  const {addAnswer, updateLastAnswer, answerList, answerIndex} = answerStore;
  const {
    pointer, showPanel, isLoading, setLoading, isGenerating, setGenerating,
    showAnswer, setShowAnswer, selection, setShowPanel, setUserPrompt
  } = sliderStore;

  const [lastOptions, setLastOptions] = React.useState(null);
  const {t, i18n} = useTranslation();

  const confirmsActions = t("confirms", {returnObjects: true});
  const popupActions = t("popup", {returnObjects: true});

  const handleCompletion = async (options) => {
    const handleGenError = async () => {
      setGenerating(false);
      setLoading(false);

      const key = await getGeminiAPIKey();
      if(!key) {
        addAnswer("Please set Gemini API Key in the settings.");
        setShowAnswer(true);
        return;
      }
      addAnswer("Network error, please try again later.");
      setShowAnswer(true);
    };

    const handleGenEnd = () => {
      setGenerating(false);
      setLoading(false);
      setUserPrompt("");
      setLastOptions(options);
    }

    const handleGenStart = () => {
      setLoading(false);
      setGenerating(true);
      addAnswer("");
      setShowAnswer(true);
      sliderStore.setShowActions(true);
    };

    const {type, selection, user_prompt} = options;
    console.log("type -> ", type, selection, user_prompt);
    const outputLang = i18n.language;
    let promptParams = generatePrompt(type, outputLang, selection, type, user_prompt);

    let started = true;
    setLoading(true);
    setShowAnswer(false);

    geminiGenerate(
        promptParams.prompt,
        promptParams.maxTokens,
        promptParams.temperature,
        (val, done, err) => {
          if (done) {
            handleGenEnd();
            return;
          }
          if (err) {
            handleGenError();
            return;
          }
          if (started) {
            handleGenStart();
            started = false;
          }
          updateLastAnswer(val);
        });
  };


  const geminiCompletion = async (options) => {

  }

  /* const fetchCompletion = async (options) => {
    let payload = { ...options };

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let isFirst = true;
    setLoading(true);
    fetch(`${baseUrl}/chat/completion`, {
      headers: headers,
      method: "POST",
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          return Promise.reject(response);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        function read() {
          return reader.read()
            .then(({ done, value }) => {

              if (done) {
                setGenerating(false);
                console.log("[Done]")
                return true;
              }

              let val = decoder.decode(value, { stream: true });

              if (isFirst) {
                isFirst = false;
                setLoading(false);
                setGenerating(true);
                addAnswer("");
                setShowAnswer(true);
              }
              updateLastAnswer(val);
              return read();
            })
        }
        return read();
      })
      .catch((e) => {
        setGenerating(false);
        setLoading(false);
        setShowAnswer(true);
        addAnswer("Network error, please try again later.");
      })
  }; */

  const handleUserPrompt = async () => {
    let options = {
      type: selection ? "userPromptWithSelection" : "userPrompt",
      selection: showAnswer ? answerList[answerIndex].text : selection,
      user_prompt: sliderStore.userPrompt,
    };

    if (sliderStore.userPrompt === "") return;
    sliderStore.setStatusText("AI is generating...");
    await handleCompletion(options);
  };

  const handleClickAction = async (action) => {
    let options = {
      type: action,
      selection: selection,
      user_prompt: sliderStore.userPrompt,
    };

    sliderStore.setStatusText("AI is generating...");
    await handleCompletion(options);
  };

  const handleClickConfirms = async (action) => {
    let options = {};
    switch (action) {
      case "copy":
        let currAns = answerList[answerIndex].text;
        await navigator.clipboard.writeText(currAns);
        handleClose();
        break;
      case "longer":
        options = {
          type: "longer",
          selection: answerList[answerIndex].text,
          user_prompt: sliderStore.userPrompt,
        }
        sliderStore.setStatusText("AI is writing...");
        await handleCompletion(options);
        break;
      case "continueWriting":
        options = {
          type: "continueWriting",
          selection: answerList[answerIndex].text,
          user_prompt: sliderStore.userPrompt,
        }
        sliderStore.setStatusText("AI is writing...");
        await handleCompletion(options);
        break;
      case "tryAgain":
        await handleCompletion(lastOptions);
        break;
      case "discard":
        handleClose();
        break;
      default:
        break;
    }
  }

  const handleTranslate = async () => {

    setShowPanel(true);
    sliderStore.setShowStarter(false);

    getLocalStorage("language")
        .then((lang) => {
          getLocalStorage("transLang")
              .then(transLang => {
                let options = {
                  type: "English",
                  selection,
                  user_prompt: sliderStore.userPrompt
                };

                console.log(transLang, lang);

                if (!transLang && lang) {
                  options.type = langOptions.filter((e) => {
                    return e.value === lang
                  })[0].label
                } else if (transLang) {
                  options.type = transLang;
                }
                if (!transLang && !lang) {
                  options.type = langOptions.filter((e) => {
                    return e.value === i18n.language
                  })[0].label
                }

                console.log(options);

                sliderStore.setStatusText("AI is translating...");
                handleCompletion(options);

              })
        })

  };

  const handleClose = () => {
    setShowPanel(false);
    setShowAnswer(false);
    setLoading(false);
    setGenerating(false);
    sliderStore.setUserPrompt("");
    sliderStore.setSelection("");
  };

  return (
      <>
        <Starter handleTranslate={handleTranslate}/>
        <div
            style={{left: `${pointer.x}px`, top: `${pointer.y}px`, display: showPanel ? "block" : "none"}}
            className="absolute z-[2147483600]"
        >
          <PanelHeader
              onEnter={handleUserPrompt}
              onClose={handleClose}
          >
            {(!showAnswer && !isLoading && !isGenerating) && <PanelContext/>}
            {(!showAnswer && isLoading) && <PanelStatus/>}
            {showAnswer && <PanelAnswer/>}
          </PanelHeader>

          <div
              style={{display: sliderStore.showActions ? "block" : "none"}}
              className="actions-container mt-[2px] w-[225px]"
          >

            {showAnswer && !isGenerating &&
                <ActionList
                    actions={confirmsActions}
                    onClickAction={handleClickConfirms}
                    style={{paddingTop: "0px", paddingBottom: "0px"}}
                />
            }

            {!showAnswer && !isGenerating && !isLoading &&
                <ActionList
                    actions={popupActions}
                    onClickAction={handleClickAction}
                />
            }
          </div>
        </div>
      </>
  )
});


export default Slider;
