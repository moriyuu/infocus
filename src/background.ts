import { DEFAULT_REDIRECT_URL, KEYS } from "./constants";

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.url && changeInfo.status) {
    const { activated: _activated, redirectUrl: _redirectUrl } =
      await chrome.storage.sync.get([KEYS.ACTIVATED, KEYS.REDIRECT_URL]);
    const activated: boolean = _activated ?? true;
    const redirectUrl: string = _redirectUrl ?? DEFAULT_REDIRECT_URL;

    if (activated && tab.url !== redirectUrl) {
      console.log("tab.url :>> ", tab.url);
      const { blockUrls: _blockUrls } = await chrome.storage.sync.get(
        KEYS.BLOCK_URLS
      );
      const blockUrls: string[] = _blockUrls ?? [];
      if (blockUrls.includes(tab.url)) {
        console.log("move!");
        chrome.tabs.update(tabId, { url: redirectUrl });
      }
    }
  }
});
