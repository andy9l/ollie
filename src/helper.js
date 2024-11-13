window.ollieHelper = (() => {

  let _private = {};

  _private.store = {
    mvtQAKey: `__MVT_QA__`
  }

  _private.dispatchUpstreamEvent = detail => window.dispatchEvent(new CustomEvent(`ollie.Event.Upstream`, { detail: detail }));

  _private.eventListeners = {

    upstream: {

      mvtQACheck: () => {
        _private.dispatchUpstreamEvent({ event_type: `mvtQA`, payload: localStorage[_private.store.mvtQAKey] });
      },

      privacyPreferencesCheck: () => {
        let payload = {};
        try {
          const consentStatus = window.Bootstrapper.gateway.getConsentStatus();
          Object.keys(consentStatus).map(category => {
            payload[category] = consentStatus[category].categoryEnabled ? 1 : 0
          });
        } catch (e) { }
        _private.dispatchUpstreamEvent({ event_type: `privacyPreferences`, payload: Object.keys(payload).length ? JSON.stringify(payload) : false });
      }

    },

    downstream: {

      listData: e => {
        try {
          const dataDefs = window.Bootstrapper.data.getAllDataDefinitionsOnCurrentPage();
          const outputObj = {};
          Object.keys(dataDefs).forEach(dataDefID => {
            outputObj[dataDefID] = { name: dataDefs[dataDefID].dataDefName, value: window.Bootstrapper.data.resolve(dataDefID) };
          });
          console.table(outputObj);
        } catch (e) {
          console.warn(`No data definitions found on this page`);
        }
      },

      resolveData: e => {
        let testData = window.prompt(`Enter Data Definition name or ID (allows partial matches):`);
        if (testData !== null && testData.length) {
          const regex = new RegExp(testData, `i`);
          const dataDefs = window.Bootstrapper.data.getAllDataDefinitionsOnCurrentPage();
          const outputObj = {};
          Object.keys(dataDefs).forEach(dataDefID => {
            if (regex.test(`${dataDefID}-${dataDefs[dataDefID].dataDefName}`)) {
              outputObj[dataDefID] = { name: dataDefs[dataDefID].dataDefName, value: window.Bootstrapper.data.resolve(dataDefID) };
            }
          });
          if (Object.keys(outputObj).length) {
            console.table(outputObj);
          } else {
            console.warn(`No Data Definitions matching '${testData}' found on this page`);
          }
        }
      },

      listTags: e => {
        try {
          console.table(window.Bootstrapper.getAllDeploymentIds());
        } catch (e) {
          console.warn(`No deployments found on this page`);
        }
      },

      testTag: e => {
        let testID = window.prompt(`Enter Tag/Deployment ID to look for (enter full ID):`);
        if (testID !== null) {
          if (/^\d{5,7}$/.test(testID)) {
            const found = window.Bootstrapper.getAllDeploymentIds().filter(id => id == testID).length > 0;
            if (found) {
              console.log(`The tag ${testID} HAS FIRED on this page`);
            } else {
              console.warn(`The tag ${testID} has NOT FIRED on this page`);
            }
          } else {
            console.warn(`Invalid tag ID - should be a 5-7 digit ID`);
          }
        }
      },

      getServerComp: e => {
        const sc = document.head.querySelector(`script[src*='serverComponent.php']`);
        if (sc !== null) {
          console.log(`Server Component URL:\n${sc.src}\n\nServer Component Parameters:`);
          console.table(decodeURI(sc.src).replace(/.+\?(.+)/, `$1`).split(`&`).map(keyVal => {
            const pair = keyVal.split(`=`);
            return { param: pair[0], value: pair[1] }
          }));
        } else {
          console.warn(`serverComponent.php script not found`);
        }
      },

      mvtQAToggleOn: e => {
        localStorage[_private.store.mvtQAKey] = 1;
        _private.eventListeners.upstream.mvtQACheck();
      },

      mvtQAToggleOff: e => {
        localStorage[_private.store.mvtQAKey] = 0;
        _private.eventListeners.upstream.mvtQACheck();
      },

      privacyPreferenceToggle: (preference, flag) => {
        try {
          const change = window.Bootstrapper.gateway.setConsentStatus(preference, flag);
          if (typeof change?.then === "function") change.then(_private.eventListeners.upstream.privacyPreferencesCheck);
          else _private.eventListeners.upstream.privacyPreferencesCheck();
        } catch (e) { }
      },

      openBanner: () => {
        try {
          window.Bootstrapper.gateway.openBanner();
        } catch (e) { }
      },

      openModal: () => {
        try {
          window.Bootstrapper.gateway.openModal();
        } catch (e) { }
      },

      optInAll: () => {
        try {
          Object.keys(window.Bootstrapper?.gateway?.getConsentStatus() || {})
            .map(preference => _private.eventListeners.downstream.privacyPreferenceToggle(preference, 1));
        } catch (e) { }
        _private.eventListeners.upstream.privacyPreferencesCheck();
      },

      optOutAll: () => {
        try {
          Object.keys(window.Bootstrapper?.gateway?.getConsentStatus() || {})
            .map(preference => _private.eventListeners.downstream.privacyPreferenceToggle(preference, 0));
        } catch (e) { }
        _private.eventListeners.upstream.privacyPreferencesCheck();
      },

      refreshPopupState: () => {
        _private.eventListeners.upstream.privacyPreferencesCheck();
        _private.eventListeners.upstream.mvtQACheck();
      }

    }
  };

  _private.attachEventListeners = () => {
    Object.keys(_private.eventListeners.downstream).forEach(key => {
      window.addEventListener(`ollie.Event.Downstream.${key}`, _private.eventListeners.downstream[key]);
    });
    Object.keys(window.Bootstrapper?.gateway?.getConsentStatus() || {}).map(preference => {
      window.addEventListener(`ollie.Event.Downstream.Privacy.${preference}.On`, () => _private.eventListeners.downstream.privacyPreferenceToggle(preference, 1));
      window.addEventListener(`ollie.Event.Downstream.Privacy.${preference}.Off`, () => _private.eventListeners.downstream.privacyPreferenceToggle(preference, 0));
    });
  };

  _private.init = () => {
    _private.attachEventListeners();
  };

  _private.init();

})();