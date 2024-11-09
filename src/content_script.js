window.addEventListener(`ollie.Event.Upstream`, e => {
  chrome.runtime.sendMessage({ command: `upstreamEvent`, type: e.detail.event_type });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.command === `downstreamEvent` && typeof message?.type !== `undefined`) {
    window.dispatchEvent(new CustomEvent(`ollie.Event.Downstream.${message.type}`));
  }
});

const injectHelperScript = (() => {
  let script = document.createElement(`script`);
  script.src = chrome.runtime.getURL(`/helper.js`);
  document.body.appendChild(script);
})();