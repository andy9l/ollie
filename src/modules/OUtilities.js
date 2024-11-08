export const OUtilities = {
  refreshConfig: (config, callback = null) => {
    chrome.storage.local.get(config.storageKeys, function (storage) {
      Object.keys(storage).forEach(key => {
        config.setting[key] = storage[key];
      });
      chrome.action.setIcon({
        path: {
          '48': chrome.runtime.getURL(`images/${config.setting.enabled ? `icon128` : `icon128-grey`}.png`)
        }
      });
      if (callback) callback(config);
    });
  }
};