export const ONotifications = {
  send: (message, title, items) => {
    chrome.notifications.create({
      type: `basic`,
      message: message,
      buttons: [
        { title: "Dismiss" }
      ],
      title: title,
      iconUrl: chrome.runtime.getURL(`images/icon128.png`),
    });
  },
  clearNotification: notificationId => {
    chrome.notifications.clear(notificationId);
  }
};