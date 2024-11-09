import { Constants } from "../constants.js";

const buildRegexFilter = config => {
  let regexString;
  try {
    const [_, subdomain, domain] = (config.fpdomain?.length ? config.fpdomain : Constants.defaultDomain).match(/^([^\.]+)\.(.+)$/);
    if (subdomain && domain) {
      regexString = `^(http|https):\/\/(${subdomain})(-test|\d{1})?\.(${domain.replace(/\.+/g, "\.")})`;
      if (!config.fpdomain?.length) regexString += `\/([^\/]+)\/([^\/]*?)(stage|prod)?\/?Bootstrap\.js$`;
      else if (config.fpfrom?.length) regexString += `\/${config.fpfrom}\/?$`.replace(/\/+/g, "/");
    }
  } catch (e) { }
  return regexString;
};

const buildRegexSubstitution = config => {
  let regexString;
  if (config.fpdomain?.length && config.fpfrom?.length && config.fpto?.length)
    regexString = `\\1://\\2${config.version === 1 ? `-test` : ``}.\\4${`/${config.fpto}`.replace(/\/+/g, "/")}`;
  else if (!config.fpdomain?.length)
    regexString = `\\1://\\2${config.version === 1 ? `-test` : ``}.\\4/${config.account?.length ? config.account : `\\5`}/${config.space?.length ? (/^\*/.test(config.space) ? `\\6${config.space.replace("*", "")}` : config.space) : `\\6\\7`}/Bootstrap.js`;
  return regexString ? `${regexString}?r=${Math.random().toString().substring(2, 6)}` : ``;
};

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