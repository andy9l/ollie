import { Constants } from "../constants.js";

const buildRegexFilter = config => {
  const parts = (config.fpfrom?.length ? config.fpfrom : Constants.defaultDomain).match(/^([^\.]+)\.([^\/]+)\/?(.*)/);
  let regexString;
  if (parts && parts[1] && parts[2]) {
    regexString = `^(http|https):\/\/(${parts[1]})(-test|\d{1})?\.(${parts[2].replace(/\.+/g, "\.")})`;
    if (!config.fpfrom?.length) {
      regexString += `\/([^\/]+)\/([^\/]*?)(stage|prod)?\/?Bootstrap\.js$`;
    } else if (parts[3]) {
      regexString += `\/${parts[3]}\/?$`
    }
  }
  return regexString;
};

const buildRegexSubstitution = config => {
  let regexString;
  if (config.fpfrom?.length && config.fpto?.length) {
    regexString = `\\1://\\2${config.version === 1 ? `-test` : ``}.\\4${`/${config.fpto}`.replace(/\/+/g, "/")}`;
  } else if (!config.fpfrom?.length) {
    regexString = `\\1://\\2${config.version === 1 ? `-test` : ``}.\\4/${config.account?.length ? config.account : `\\5`}/${config.space?.length ? (/^\*/.test(config.space) ? `\\6${config.space.replace("*", "")}` : config.space) : `\\6\\7`}/Bootstrap.js`;
  }
  return regexString ? `${regexString}?r=${Math.random().toString().substring(2, 6)}` : ``;
};

// Ugly and needs tidying
export const ODeclarativeNetRequestManager = {
  rules: config => {
    const regexFilter = buildRegexFilter(config);
    const regexSubstitution = buildRegexSubstitution(config)
    if (!regexFilter || !regexSubstitution) return null;
    return {
      block: {
        "action": {
          "type": "block"
        },
        "condition": {
          "regexFilter": regexFilter,
          "resourceTypes": ["script"]
        }
      },
      redirect: {
        "action": {
          "type": "redirect",
          "redirect": {
            "regexSubstitution": regexSubstitution
          }
        },
        "condition": {
          "regexFilter": regexFilter,
          "resourceTypes": ["script"]
        }
      }
    }
  },
  updateDynamicRules: async config => {
    const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
    const newRules = [];
    if (config?.enabled) {
      const dynamicRules = ODeclarativeNetRequestManager.rules(config);
      if (dynamicRules !== null) newRules.push(dynamicRules[config.blocking ? `block` : `redirect`]);
    }
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldRules.map(rule => rule.id),
      addRules: newRules.map((rule, i) => { return { ...rule, id: i + 1, priority: 1 } })
    });
  }
}