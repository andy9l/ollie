import { Constants } from "../constants.js";

export const OUtilities = {
  refreshConfig: (config, callback = null) => {
    chrome.storage.local.get(Object.keys(Constants.storageKeys), function (storage) {
      Object.keys(storage).forEach(key => {
        config[key] = storage[key];
      });
      chrome.action.setIcon({
        path: {
          '48': chrome.runtime.getURL(`images/${config.enabled ? `icon128` : `icon128-grey`}.png`)
        }
      });
      if (callback) callback(config);
    });
  }
};