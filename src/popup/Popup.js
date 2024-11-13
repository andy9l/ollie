import { Box, Button, Grid, Tab, Tabs, Tooltip, withStyles } from '@material-ui/core';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import BlockIcon from '@material-ui/icons/Block';
import React, { Component } from 'react';
import OTab from './components/OTab';
import TabRewrite from './containers/tab.rewrite';
import TabUtilities from './containers/tab.utilities';
import styles from './Popup.css';
import { Constants } from '../constants';
import TabPrivacy from './containers/tab.privacy';

class Popup extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ...Constants.storageKeys,
      loaded: false,
      toggleMouseDownTime: 0
    }
  }

  componentDidMount() {
    this.refreshState()
    try {
      window.chrome.storage.onChanged.addListener(this.refreshState.bind(this))
      window.chrome.runtime.sendMessage({ command: "upstreamEvent", event_type: "refreshPopupState" })
    } catch (e) { }
  }

  refreshState() {
    try {
      window.chrome.storage.local.get(Object.keys(Constants.storageKeys), storage => this.setState({ ...storage, loaded: true }))
    } catch (e) { }
  }

  setChromeStorage(toStore) {
    try {
      window.chrome.storage.local.set(toStore)
    } catch (e) { }
  }

  toggle() {
    if (this.state.toggleMouseDownTime > 0 && new Date().getTime() - this.state.toggleMouseDownTime > 500)
      this.setChromeStorage({ enabled: this.state.enabled || !this.state.blocking, blocking: !this.state.blocking, toggleMouseDownTime: 0 })
    else
      this.setChromeStorage({ enabled: !this.state.enabled || this.state.blocking, blocking: false, toggleMouseDownTime: 0 })
  }

  toggleMouseDown() {
    this.setState({ toggleMouseDownTime: new Date().getTime() })
  }

  onTabChange(e, tab) {
    this.setChromeStorage({ tab: tab })
  }

  sendUpstreamEvent(event_type, closeExtension = false) {
    try {
      window.chrome.runtime.sendMessage({ command: `upstreamEvent`, event_type: event_type })
      if (closeExtension) window.close()
    } catch (e) { }
  }

  render() {
    return (
      <React.Fragment>
        <Grid container justifyContent="center" className={`${this.props.classes.wrapper} ${this.props.darkMode ? "dark" : ""}`}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Tooltip title={`${this.state.enabled ? (this.state.blocking ? 'Blocking' : 'Enabled') : 'Disabled'}`} placement="right">
                <Button
                  variant="contained"
                  disabled={!this.state.loaded}
                  onClick={this.toggle.bind(this)}
                  onMouseDown={this.toggleMouseDown.bind(this)}
                  color={this.state.enabled ? 'primary' : 'secondary'}
                  className={this.props.classes.enableButton}>
                  {!this.state.blocking ? <PowerSettingsNewIcon /> : <BlockIcon />}
                </Button>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Tabs variant="fullWidth" indicatorColor="primary" value={this.state.tab} onChange={this.onTabChange.bind(this)}>
              <Tab label="Rewrite" />
              <Tab label="Utilities" />
              <Tab label="Privacy" />
            </Tabs>
          </Grid>
          <OTab hidden={this.state.tab !== 0}>
            <TabRewrite
              darkMode={this.props.darkMode}
              loaded={this.state.loaded}
              enabled={this.state.enabled && !this.state.blocking}
              space={this.state.space}
              account={this.state.account}
              fpdomain={this.state.fpdomain}
              fpfrom={this.state.fpfrom}
              fpto={this.state.fpto}
              version={this.state.version}
              setChromeStorage={this.setChromeStorage.bind(this)}
            />
          </OTab>
          <OTab hidden={this.state.tab !== 1}>
            <TabUtilities
              darkMode={this.props.darkMode}
              loaded={this.state.loaded}
              mvt={this.state.mvt}
              notifications={this.state.notifications}
              setChromeStorage={this.setChromeStorage.bind(this)}
              onClickUtilityButton={this.sendUpstreamEvent.bind(this)}
            />
          </OTab>
          <OTab hidden={this.state.tab !== 2}>
            <TabPrivacy
              darkMode={this.props.darkMode}
              loaded={this.state.loaded}
              privacyPreferences={JSON.parse(this.state.privacyPreferences)}
              onClickUtilityButton={this.sendUpstreamEvent.bind(this)}
              onChangePreference={this.sendUpstreamEvent.bind(this)}
            />
          </OTab>
        </Grid>
      </React.Fragment >
    )
  }
}

export default withStyles(styles, { withTheme: true })(Popup)