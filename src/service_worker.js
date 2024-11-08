import { ONotifications } from "./modules/ONotifications.js";
import { OUtilities } from "./modules/OUtilities.js";
import { ODeclarativeNetRequestManager } from "./modules/ODeclarativeNetRequestManager.js";

let config = {
  defaultDomain: `nexus.ensighten.com`,
  egifPattern: /.+error\/e\.gif\?msg=.+/,
  storageKeys: [`enabled`, `space`, `account`, `fpfrom`, `fpto`, `version`, `blocking`, `mvt`, `notifications`],
  setting: {}
};

chrome.webNavigation.onBeforeNavigate.addListener(
  navigationDetails => {
    if (navigationDetails.frameId === 0) ODeclarativeNetRequestManager.updateDynamicRules(config);
  }
)

chrome.webRequest.onBeforeRequest.addListener(
  requestDetails => {
    if (config.setting.notifications && config.egifPattern.test(requestDetails.url) && !/ensighten/.test(requestDetails.originUrl || requestDetails.initiator)) {
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
      if (tabs && tabs[0]) {
        const tab = tabs[0];
        if (sender && sender.tab && sender.tab.id === tab.id && /mvtQA(Enabled|Disabled)/.test(message.type)) {
          if (message.type === `mvtQAEnabled`) {
            chrome.storage.local.set({ mvt: 1 });
          } else if (message.type === `mvtQADisabled`) {
            chrome.storage.local.set({ mvt: 0 });
          }
        } else {
          chrome.tabs.sendMessage(tab.id, { command: `downstreamEvent`, type: message.type });
        }
      }
    });
  }
});

chrome.commands.onCommand.addListener(command => {
  if (command === "toggle") chrome.storage.local.set({ enabled: !config.setting.enabled });
});

chrome.notifications.onClicked.addListener(ONotifications.clearNotification);
chrome.storage.onChanged.addListener(() => OUtilities.refreshConfig(config, ODeclarativeNetRequestManager.updateDynamicRules));

OUtilities.refreshConfig(config, ODeclarativeNetRequestManager.updateDynamicRules);