import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';

const setLanguage = (lng) => {
  i18n
      // 检测用户语言
      .use(LanguageDetector)
      // 将 i18n 实例传递给 react-i18next
      .use(initReactI18next)
      // 初始化 i18next
      .init({
        resources,
        fallbackLng: "en",
        lng, // 使用用户选择的语言
        debug: true,
        interpolation: {
          escapeValue: false, // not needed for react as it escapes by default
        },
      });
}

console.log("开始获取 -> ")
// 获取用户选择的语言
chrome.storage.local.get('language', function (data) {
  setLanguage(data.language || 'en');
});

export default i18n;