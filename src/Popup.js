import { Box, Button, ButtonGroup, Chip, Grid, Tab, Tabs, Tooltip, Typography, withStyles } from '@material-ui/core';
import AccountIcon from '@material-ui/icons/AccountCircle';
import ListTagsIcon from '@material-ui/icons/Assignment';
import TestTagIcon from '@material-ui/icons/AssignmentTurnedIn';
import MVTIcon from '@material-ui/icons/CallSplitOutlined';
import SpacesIcon from '@material-ui/icons/Cloud';
import ServerCompIcon from '@material-ui/icons/Code';
import ListDataIcon from '@material-ui/icons/List';
import VersionIcon from '@material-ui/icons/LocalOffer';
import ResolveDataIcon from '@material-ui/icons/PlaylistAddCheck';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import DomainIcon from '@material-ui/icons/Language';
import PathIcon from '@material-ui/icons/Code';
import React, { Component } from 'react';
import OFieldWrapper from './components/OFieldWrapper';
import OTextField from './components/OTextField';
import OUtilityButton from './components/OUtilityButton';
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
      loaded: false
    }
  }

  componentDidMount() {
    this.refreshState()
    try {
      window.chrome.storage.onChanged.addListener(this.refreshState.bind(this));
      window.chrome.runtime.sendMessage({ command: "upstreamEvent", type: "mvtQACheck" })
      setTimeout((() => this.setState({ loaded: true })).bind(this), 250)
    } catch (e) { }
  }

  refreshState() {
    try {
      window.chrome.storage.local.get(Object.keys(StateStorageKeys), storage => this.setState(storage))
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

  onKeyDownOTextField(e) {
    if (/enter/i.test(e.key)) window.close()
  }

  onChangeOTextField(e) {
    this.setChromeStorage({ [e.target.getAttribute('data-ref')]: e.target.value })
  }

  onClearOTextField(e) {
    const refElem = e.target.closest("[data-ref]")
    if (null !== refElem && this.state.enabled) {
      this.setChromeStorage({ [refElem.getAttribute('data-ref')]: "" })
    }
  }

  forceSpace(space) {
    this.setChromeStorage({ space: space })
  }

  onChangeVersion(flag) {
    this.setChromeStorage({ version: flag })
  }

  onChangeMVT(flag) {
    this.setChromeStorage({ mvt: flag })
    try {
      window.chrome.runtime.sendMessage({ command: "upstreamEvent", type: "mvtQAToggle" + (flag === 1 ? "On" : "Off") })
    } catch (e) { }
  }

  tabChange(e, tab) {
    this.setChromeStorage({ tab: tab })
  }

  clickUtilityButton(utility, closeExtension) {
    try {
      window.chrome.runtime.sendMessage({ command: `upstreamEvent`, type: utility })
      if (closeExtension) window.close()
    } catch (e) { }
  }

  render() {
    return (
      <React.Fragment>
        <Grid container justify="center" spacing={2} className={this.props.classes.wrapper}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Tooltip title={`${this.state.enabled ? 'Enabled' : 'Disabled'}`} placement="right">
                <Button variant="contained" disabled={!this.state.loaded} onClick={this.toggle.bind(this)} color={this.state.enabled ? 'primary' : 'secondary'} className={this.props.classes.enableButton}>
                  <PowerSettingsNewIcon />
                </Button>
              </Tooltip>
            </Box>
          </Grid>
          <Tabs variant="fullWidth" indicatorColor={this.state.tab === 0 ? "primary" : "secondary"} value={this.state.tab} onChange={this.tabChange.bind(this)}>
            <Tab label="Rewrite" />
            <Tab label="Utilities" />
          </Tabs>
          <Box hidden={this.state.tab !== 0} className={this.props.classes.tab}>
            <Grid item xs={12} className={this.props.classes.gridItemSpace}>
              <OFieldWrapper reference="space" adornmentIcon={this.state.domain.length ? <PathIcon color={this.state.enabled ? "" : "disabled"} /> : <SpacesIcon color={this.state.enabled ? "" : "disabled"} />}>
                <OTextField
                  disabled={!this.state.enabled}
                  label={!this.state.domain.length ? "Ensighten Space" : "Full Bootstrap Path"}
                  placeholder={!this.state.domain.length ? "Default" : "/"}
                  reference="space"
                  value={this.state.space}
                  onChange={this.onChangeOTextField.bind(this)}
                  onClear={this.onClearOTextField.bind(this)}
                  onKeyDown={this.onKeyDownOTextField.bind(this)}
                />
              </OFieldWrapper>
              <Box display="flex" justifyContent="flex-end" className={this.props.classes.spaceChips}>
                <Chip
                  disabled={!this.state.enabled || this.state.domain.length}
                  size="small"
                  color={this.state.space === "*stage" ? "primary" : "default"}
                  label="*stage"
                  onClick={() => { if (this.state.enabled) this.forceSpace("*stage") }}
                />
                <Chip
                  disabled={!this.state.enabled || this.state.domain.length}
                  size="small"
                  color={this.state.space === "*prod" ? "primary" : "default"}
                  label="*prod"
                  onClick={() => { if (this.state.enabled) this.forceSpace("*prod") }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} className={this.props.classes.gridItemVersion}>
              <OFieldWrapper reference="version" adornmentIcon={<VersionIcon color={this.state.enabled ? "" : "disabled"} />}>
                <Typography variant="caption" className={this.props.classes.label}>Tag Version</Typography>
                <ButtonGroup
                  color={this.state.enabled ? "primary" : "disabled"}
                  className={this.props.classes.buttonGroup}
                  disabled={!this.state.loaded || !this.state.enabled}
                  disableElevation
                  fullWidth
                  size="small">
                  <Button onClick={() => this.onChangeVersion(1)} variant={this.state.version === 1 ? "contained" : "outlined"}>Committed</Button>
                  <Button onClick={() => this.onChangeVersion(0)} variant={this.state.version === 0 ? "contained" : "outlined"}>Published</Button>
                </ButtonGroup>
              </OFieldWrapper>
            </Grid>
            <Grid item xs={12} className={this.props.classes.gridItemStandard}>
              <OFieldWrapper reference="account" adornmentIcon={<AccountIcon color={this.state.enabled && !this.state.domain.length ? "" : "disabled"} />}>
                <OTextField
                  disabled={!this.state.enabled || this.state.domain.length}
                  label="Ensighten Account"
                  placeholder="Default"
                  reference="account"
                  value={this.state.account}
                  onChange={this.onChangeOTextField.bind(this)}
                  onClear={this.onClearOTextField.bind(this)}
                  onKeyDown={this.onKeyDownOTextField.bind(this)}
                />
              </OFieldWrapper>
            </Grid>
            <Grid item xs={12} className={this.props.classes.gridItemStandard}>
              <OFieldWrapper reference="domain" adornmentIcon={<DomainIcon color={this.state.enabled ? "" : "disabled"} />}>
                <OTextField
                  disabled={!this.state.enabled}
                  label="Ensighten Bootstrap Domain"
                  placeholder="nexus.ensighten.com"
                  reference="domain"
                  value={this.state.domain}
                  onChange={this.onChangeOTextField.bind(this)}
                  onClear={this.onClearOTextField.bind(this)}
                  onKeyDown={this.onKeyDownOTextField.bind(this)}
                />
              </OFieldWrapper>
            </Grid>
          </Box>
          <Box hidden={this.state.tab !== 1} className={this.props.classes.tab}>
            <Grid item xs={12} className={this.props.classes.gridItemStandard}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <OUtilityButton
                    title="List data"
                    icon={<ListDataIcon />}
                    onClick={() => this.clickUtilityButton('listData', true)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <OUtilityButton
                    title="Resolve data"
                    icon={<ResolveDataIcon />}
                    onClick={() => this.clickUtilityButton('resolveData', true)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <OUtilityButton
                    title="List tags"
                    icon={<ListTagsIcon />}
                    onClick={() => this.clickUtilityButton('listTags', true)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <OUtilityButton
                    title="Test for tag"
                    icon={<TestTagIcon />}
                    onClick={() => this.clickUtilityButton('testTag', true)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <OUtilityButton
                    title="Server Component parameters"
                    icon={<ServerCompIcon />}
                    onClick={() => this.clickUtilityButton('getServerComp', true)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} className={this.props.classes.gridItemStandard}>
              <OFieldWrapper reference="mvt" adornmentIcon={<MVTIcon />}>
                <Typography variant="caption" className={this.props.classes.label}>MVT Test Audience</Typography>
                <ButtonGroup color="secondary" className={this.props.classes.buttonGroup} disabled={!this.state.loaded} disableElevation fullWidth size="small">
                  <Button onClick={() => this.onChangeMVT(1)} variant={this.state.mvt === 1 ? "contained" : "outlined"}>Enabled</Button>
                  <Button onClick={() => this.onChangeMVT(0)} variant={this.state.mvt === 0 ? "contained" : "outlined"}>Disabled</Button>
                </ButtonGroup>
              </OFieldWrapper>
            </Grid>
          </Box>
        </Grid>
      </React.Fragment >
    )
  }
}

export default withStyles(styles, { withTheme: true })(Popup)