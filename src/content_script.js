import React from "react";
import { createRoot } from "react-dom/client";

import Slider from "./slider";

const injectShadowDOM = () => {
  return new Promise((resolve) => {
    // 创建 shadow dom，防止干扰原有网页
    const container = document.createElement("div");
    container.id = "foxai-shadow-dom";
    document.body.appendChild(container);

    // 创建 shadow dom 的 shadow root
    const shadowRoot = container.attachShadow({ mode: 'open' });

    // 创建 wrapper 
    const wrapper = document.createElement("div");
    wrapper.id = "foxai-wrapper";
    shadowRoot.appendChild(wrapper);

    const styleTag = document.createElement('link');
    styleTag.rel = 'stylesheet';
    styleTag.href = chrome.runtime.getURL('css/content_script.css');
    wrapper.appendChild(styleTag);
 

    // 创建 slider
    const sliderContainer = document.createElement("div");
    sliderContainer.id = "foxai-slider";
    wrapper.appendChild(sliderContainer);
    createRoot(sliderContainer).render(<Slider />);

    resolve();
  });
}


// 注入 web_accessible_resources.js
const injectScriptToPage = async () => {
  return new Promise((resolve, reject) => {
    function injectScript(file_path, tag) {
      const node = document.getElementsByTagName(tag)[0];
      const script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', file_path);
      node.appendChild(script);
    }

    injectScript(chrome.runtime.getURL('js/web_accessible_resources.js'), 'body');
    console.log("注入 web_accessible_resources.js 完成")
    resolve();
  });
}


// 监听来自 Background 的消息
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  let { type, val } = msg;
  switch (type) {
    case "clickContextMenu":
      break;
    default:
      break;
  }
});


const fetchConfig = async () => {

}


const init = async () => {
  await injectScriptToPage();
  await injectShadowDOM();
  await fetchConfig();
  console.log("content_script 载入语言")
}


init();