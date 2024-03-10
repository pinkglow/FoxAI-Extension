
const adminUrl = chrome.runtime.getURL('admin.html');

chrome.runtime.onInstalled.addListener((details) => {
  const { reason } = details;
  if (reason === 'install') {
    chrome.tabs.create({ url: adminUrl });
  }
  else if (reason === 'update') {
    chrome.tabs.create({ url: adminUrl });
  }
});

