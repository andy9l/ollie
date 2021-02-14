import { Box, Button, Grid, Tab, Tabs, Tooltip, withStyles } from '@material-ui/core';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import React, { Component } from 'react';
import OTab from './components/OTab';
import TabRewrite from './containers/tab.rewrite';
import TabUtilities from './containers/tab.utilities';
import styles from './Popup.css';

const StateStorageKeys = {
  enabled: false,
  space: "",
  account: "",
  domain: "",
  version: 0,
  mvt: 0,
  tab: 0,
}

class Popup extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ...StateStorageKeys,
      loaded: false,
    }
  }

  componentDidMount() {
    this.refreshState()
    try {
      window.chrome.storage.onChanged.addListener(this.refreshState.bind(this));
      window.chrome.runtime.sendMessage({ command: "upstreamEvent", type: "mvtQACheck" })
    } catch (e) { }
  }

  refreshState() {
    try {
      window.chrome.storage.local.get(Object.keys(StateStorageKeys), storage => this.setState({ ...storage, loaded: true }))
    } catch (e) { }
  }

  setChromeStorage(toStore) {
    try {
      window.chrome.storage.local.set(toStore)
    } catch (e) { }
  }

  toggle() {
    this.setChromeStorage({ enabled: !this.state.enabled })
  }

  onTabChange(e, tab) {
    this.setChromeStorage({ tab: tab })
  }

  render() {
    return (
      <React.Fragment>
        <Grid container justify="center" className={`${this.props.classes.wrapper} ${this.props.darkMode ? "dark" : ""}`}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Tooltip title={`${this.state.enabled ? 'Enabled' : 'Disabled'}`} placement="right">
                <Button variant="contained" disabled={!this.state.loaded} onClick={this.toggle.bind(this)} color={this.state.enabled ? 'primary' : 'secondary'} className={this.props.classes.enableButton}>
                  <PowerSettingsNewIcon />
                </Button>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Tabs variant="fullWidth" indicatorColor="primary" value={this.state.tab} onChange={this.onTabChange.bind(this)}>
              <Tab label="Rewrite" />
              <Tab label="Utilities" />
            </Tabs>
          </Grid>
          <OTab hidden={this.state.tab !== 0}>
            <TabRewrite
              darkMode={this.props.darkMode}
              loaded={this.state.loaded}
              enabled={this.state.enabled}
              space={this.state.space}
              account={this.state.account}
              domain={this.state.domain}
              version={this.state.version}
              setChromeStorage={this.setChromeStorage.bind(this)}
            />
          </OTab>
          <OTab hidden={this.state.tab !== 1}>
            <TabUtilities
              darkMode={this.props.darkMode}
              loaded={this.state.loaded}
              mvt={this.state.mvt}
              setChromeStorage={this.setChromeStorage.bind(this)}
            />
          </OTab>
        </Grid>
      </React.Fragment >
    )
  }
}

export default withStyles(styles, { withTheme: true })(Popup)