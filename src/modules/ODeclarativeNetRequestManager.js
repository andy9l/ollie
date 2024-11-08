// Ugly and needs tidying
export const ODeclarativeNetRequestManager = {
  rules: config => {
    const regexFilter = (config => {
      const domain = config.setting.fpfrom?.length ? config.setting.fpfrom : config.defaultDomain;
      const parts = domain.match(/^([^\.]+)\.([^\/]+)\/?(.*)/);
      let regexString;
      if (parts && parts[1] && parts[2]) {
        regexString = `^(http|https):\/\/(${parts[1]})(-test|\d{1})?\.(${parts[2].replace(".", "\.")})`;
        if (!config.setting.fpfrom?.length) {
          regexString += `\/([^\/]+)\/([^\/]*?)(stage|prod)?\/?Bootstrap\.js$`;
        } else if (parts[3]) {
          regexString += `\/${parts[3]}\/?$`
        }
      }
      return regexString;
    })(config);
    const regexSubstitution = (config => {
      const isFirstParty = config.setting.fpfrom?.length;
      let regexString;
      if (config.setting.fpto) {
        if (isFirstParty) {
          regexString = `\\1://\\2${config.setting.version === 1 ? `-test` : ``}.\\4${`/${config.setting.fpto}`.replace(/\/+/g, "/")}`;
        } else {
          regexString = `\\1://\\2${config.setting.version === 1 ? `-test` : ``}.\\4/${config.setting.account?.length ? config.setting.account : `\\5`}/${config.setting.space?.length ? (/^\*/.test(config.setting.space) ? `\\6${config.setting.space.replace("*", "")}` : config.setting.space) : `\\6\\7`}/Bootstrap.js`;
        }
        regexString += `?r=${Math.random().toString().substring(2, 6)}`;
      }
      return regexString;
    })(config);
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
    if (config.setting?.enabled) {
      const dynamicRules = ODeclarativeNetRequestManager.rules(config);
      if (dynamicRules !== null) newRules.push(dynamicRules[config.setting.blocking ? `block` : `redirect`]);
    }
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldRules.map(rule => rule.id),
      addRules: newRules.map((rule, i) => { return { ...rule, id: i + 1, priority: 1 } })
    });
  }
}