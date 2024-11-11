import { ONotifications } from "./modules/ONotifications.js";
import { OUtilities } from "./modules/OUtilities.js";
import { ODeclarativeNetRequestManager } from "./modules/ODeclarativeNetRequestManager.js";
import { Constants } from "./constants.js";

let config = Constants.storageKeys;

chrome.webNavigation.onBeforeNavigate.addListener(navigationDetails => navigationDetails.frameId === 0 && ODeclarativeNetRequestManager.updateDynamicRules(config));

chrome.webRequest.onBeforeRequest.addListener(
  requestDetails => {
    if (config.notifications && Constants.egifPattern.test(requestDetails.url) && !/ensighten/.test(requestDetails.originUrl || requestDetails.initiator)) {
      ONotifications.send(`Ensighten e.gif error(s) detected - check network tab for details.`, `ollie`);
    }
  },
  {
    urls: [`*://*/*`],
    types: [`image`]
  }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === `upstreamEvent`) {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      if (sender?.tab?.id === tabs[0]?.id) {
        if (message.event_type === "mvtQA")
          chrome.storage.local.set({ mvt: message.payload == 1 ? 1 : 0 });
        else if (message.event_type === "privacyPreferences")
          chrome.storage.local.set({ privacyPreferences: message.payload });
      } else
        chrome.tabs.sendMessage(tabs[0]?.id, { ...message, command: `downstreamEvent` });
    });
  }
});

chrome.commands.onCommand.addListener(command => command === "toggle" && chrome.storage.local.set({ enabled: !config.enabled }));
chrome.notifications.onClicked.addListener(ONotifications.clearNotification);
chrome.storage.onChanged.addListener(() => OUtilities.refreshConfig(config, ODeclarativeNetRequestManager.updateDynamicRules));

OUtilities.refreshConfig(config, ODeclarativeNetRequestManager.updateDynamicRules);