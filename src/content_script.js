window.addEventListener(`ollie.Event.Upstream`, e => {
  chrome.runtime.sendMessage({ command: `upstreamEvent`, ...e.detail });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.command === `downstreamEvent` && typeof message?.event_type !== `undefined`) {
    window.dispatchEvent(new CustomEvent(`ollie.Event.Downstream.${message.event_type}`));
  }
});

let script = document.createElement(`script`);
script.src = chrome.runtime.getURL(`/helper.js`);
document.body.appendChild(script);