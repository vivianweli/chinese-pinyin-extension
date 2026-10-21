// The dictionary lives only in this service worker, so web pages never load it.
// The service worker starts on the first lookup and keeps the dictionary in
// memory for as long as it stays alive. importScripts must run at the top level.
importScripts("dictionary.js");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "lookup" || typeof message.text !== "string") {
    return;
  }

  const pronunciations = Object.hasOwn(PINYIN_DICTIONARY, message.text)
    ? PINYIN_DICTIONARY[message.text]
    : null;

  sendResponse({ pronunciations });
});
