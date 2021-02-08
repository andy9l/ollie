window.ollieHelper = (() => {

  let _private = {}, _public = {};

  _private.store = {
    mvtQAKey: `__MVT_QA__`
  }

  _private.eventListeners = {

    upstream: {

      mvtQACheck: e => {
        const event = localStorage[_private.store.mvtQAKey] == 1 ? `Enabled` : `Disabled`;
        window.dispatchEvent(new CustomEvent(`ollie.Event.Upstream`, { detail: { event_type: `mvtQA${event}` } }));
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
          console.table(unescape(sc.src).replace(/.+\?(.+)/, `$1`).split(`&`).map(keyVal => {
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
        // setTimeout(() => window.location.reload(), 250);
      },

      mvtQAToggleOff: e => {
        localStorage[_private.store.mvtQAKey] = 0;
        _private.eventListeners.upstream.mvtQACheck();
        // setTimeout(() => window.location.reload(), 250);
      },

      mvtQACheck: e => _private.eventListeners.upstream.mvtQACheck()

    }
  };

  _private.attachEventListeners = () => {
    Object.keys(_private.eventListeners.downstream).forEach(key => {
      window.addEventListener(`ollie.Event.Downstream.${key}`, _private.eventListeners.downstream[key]);
    });
  };

  _private.init = () => {
    _private.attachEventListeners();
    _private.eventListeners.upstream.mvtQACheck();
  };

  _private.init();

  return _public;

})();