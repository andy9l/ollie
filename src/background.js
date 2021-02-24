let config = {
  bootstrapPattern: /(http|https):\/\/nexus(-test|\d{1})?\.ensighten\.com\/([^\/]+)\/([^\/]*)\/?Bootstrap\.js(?!\?r=\d+)/,
  bootstrapPatternFirstParty: /(http|https):\/\/([^\.]+)(\.[^\/]+)/,
  egifPattern: /.+error\/e\.gif\?msg=.+/,
  defaultSpace: `prod`,
  storageKeys: [`enabled`, `space`, `account`, `domain`, `path`, `version`, `mvt`],
  setting: {}
};

const Notifications = {
  send: (message, title, items) => {
    chrome.notifications.create({
      type: `basic`,
      message: message,
      title: title,
      iconUrl: chrome.runtime.getURL(`images/icon128.png`),
    });
  },
  clearNotification: notificationId => {
    chrome.notifications.clear(notificationId);
  }
};

const Utilities = {
  refreshConfig: () => {
    chrome.storage.local.get(config.storageKeys, function (storage) {
      Object.keys(storage).forEach(key => {
        config.setting[key] = storage[key];
      });
      chrome.browserAction.setIcon({
        path: {
          '48': chrome.runtime.getURL(`images/${config.setting.enabled ? `icon128` : `icon128-grey`}.png`)
        }
      });
    });
  },
};

chrome.webRequest.onBeforeRequest.addListener(
  requestDetails => {
    if (config.setting.enabled) {
      if (!/ManageUI/.test(requestDetails.url) && config.bootstrapPattern.test(requestDetails.url)) {
        const parts = requestDetails.url.match(config.bootstrapPattern);
        if (!parts[4]) parts[4] = config.defaultSpace;
        const getRewrittenBootstrap = bootstrap => {
          if (bootstrap && bootstrap == 1) return `nexus-test`;
          return `nexus`;
        }
        const getRewrittenSpace = space => {
          if (space && space.length) {
            if (space === `*stage`) return parts[4].replace(/prod/, `stage`);
            if (space === `*prod`) return parts[4].replace(/stage/, `prod`);
            return space;
          }
          return parts[4];
        };
        const getRewrittenAccount = account => {
          if (account && account.length) return account;
          else return parts[3];
        };
        return {
          redirectUrl: `${parts[1]}://${getRewrittenBootstrap(config.setting.version)}.ensighten.com/${getRewrittenAccount(config.setting.account)}/${getRewrittenSpace(config.setting.space)}/Bootstrap.js?r=${new Date().getTime()}`
        }
      } else if (config.setting.domain && config.setting.path && new RegExp(config.setting.domain).test(requestDetails.url)) {
        const parts = requestDetails.url.match(config.bootstrapPatternFirstParty);
        return {
          redirectUrl: `${parts[1]}://${parts[2]}${config.setting.version == 1 ? `-test` : ``}${parts[3]}/${config.setting.path}`.replace(/\/+/g, `/`)
        }
      }
    }
    if (config.egifPattern.test(requestDetails.url) && !/ensighten/.test(requestDetails.originUrl || requestDetails.initiator)) {
      Notifications.send(`Ensighten e.gif error(s) detected - check network tab for details.`, `ollie`);
    }
  },
  {
    urls: [
      `*://*/*`
    ],
    types: []
  },
  [`blocking`]
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

chrome.notifications.onClicked.addListener(Notifications.clearNotification);
chrome.storage.onChanged.addListener(Utilities.refreshConfig);

Utilities.refreshConfig();