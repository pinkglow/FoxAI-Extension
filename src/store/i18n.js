import { makeAutoObservable, toJS, runInAction } from 'mobx';
import zh from '../i18n/zh.json';
import en from '../i18n/en.json';

import { getLocalStorage, setLocalStorage } from "../utils";


class I18nStore {
  defaultLanguage = "en"; // 默认语言就是探测语言
  slectedLanguage = null;
  languages = null;

  langOptions = [
    { label: "English", value: "en" },
    { label: "中文", value: "zh" },
    { label: "日本語", value: "ja" },
    { label: "русский", value: "ru" },
    { label: "한국어", value: "ko" },
    { label: "Deutsch", value: "de" },
    { label: "Français", value: "fr" },
    { label: "Italiano", value: "it" },
  ];

  constructor() {
    makeAutoObservable(this);
  };

  changeLanguage = (language) => {
    runInAction(() => {
      this.slectedLanguage = language;
      setLocalStorage("slectedLanguage", language);
      switch (language) {
        case "zh":
          this.languages = zh;
          break;
        case "en":
          this.languages = en;
          break;
        default:
          this.languages = en;
          break;
      }
    });
  };

  loadLanguage = () => {
    getLocalStorage("slectedLanguage")
    .then((res) => {
      console.log("loadLanguage -> ", res);
      if (res) {
        this.changeLanguage(res);
      } else {
        this.changeLanguage(this.defaultLanguage);
      }
    });
  }
}

const i18nStore = new I18nStore();
export default i18nStore;
