import axios from "axios";

export const website = "https://foxai.me";
export const baseUrl = "https://foxai.me/api/v1";

export const langOptions = [
  {label: "English", value: "en"},
  {label: "中文", value: "zh"},
  {label: "日本語", value: "ja"},
  {label: "русский", value: "ru"},
  {label: "한국어", value: "ko"},
  {label: "Deutsch", value: "de"},
  {label: "Français", value: "fr"},
  {label: "Italiano", value: "it"},
];


export const request = axios.create({
  baseURL: baseUrl,
});

var storage;

export const getChromeLocalStorage = () => {
  if (storage) return storage;
  storage = chrome.storage.local;
  return storage;
};


export const getLocalStorage = async (key) => {
  return new Promise((resolve) => {
    if (!storage) getChromeLocalStorage();
    storage.get(key, (result) => {
      if (!result[key]) return resolve(null);
      resolve(result[key]);
    });
  })
};


export const setLocalStorage = async (key, value) => {
  return new Promise((resolve) => {
    if (!storage) getChromeLocalStorage();
    let data = {};
    data[key] = value;
    storage.set(data);
    resolve(true);
  })
};


export function isDateExpired(dateString) {
  const currentDate = new Date();
  const targetDate = new Date(dateString);
  // 如果当前时间大于目标时间，说明过期了, 返回true
  return targetDate.getTime() <= currentDate.getTime();
}


export const getLocalImage = (name) => {
  return chrome.runtime.getURL(`images/${name}`);
}


