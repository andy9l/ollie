import { Button, ButtonGroup, Grid, Typography, withStyles } from '@material-ui/core';
import ListTagsIcon from '@material-ui/icons/Assignment';
import TestTagIcon from '@material-ui/icons/AssignmentTurnedIn';
import MVTIcon from '@material-ui/icons/CallSplitOutlined';
import ServerCompIcon from '@material-ui/icons/Code';
import ListDataIcon from '@material-ui/icons/List';
import ResolveDataIcon from '@material-ui/icons/PlaylistAddCheck';
import React, { PureComponent } from 'react';
import OFieldWrapper from '../components/OFieldWrapper';
import OUtilityButton from '../components/OUtilityButton';
import styles from '../Popup.css';

class TabUtilities extends PureComponent {

  onChangeMVT(flag) {
    this.props.setChromeStorage({ mvt: flag })
    try {
      window.chrome.runtime.sendMessage({ command: "upstreamEvent", type: "mvtQAToggle" + (flag === 1 ? "On" : "Off") })
    } catch (e) { }
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
        <Grid item xs={12} className={this.props.classes.tabWrapper} hidden={this.props.hidden}>
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
          <Grid container spacing={2}>
            <Grid item xs={12} className={this.props.classes.mvt}>
              <OFieldWrapper reference="mvt" adornmentIcon={<MVTIcon color={(this.props.mvt ? "secondary" : "")} />}>
                <Typography variant="caption" className={`${this.props.classes.label} ${this.props.darkMode ? "dark" : ""}`}>MVT Test Audience</Typography>
                <ButtonGroup color="secondary" disabled={!this.props.loaded} disableElevation fullWidth size="small">
                  <Button onClick={() => this.onChangeMVT(1)} variant={this.props.mvt === 1 ? "contained" : "outlined"}>Enabled</Button>
                  <Button onClick={() => this.onChangeMVT(0)} variant={this.props.mvt === 0 ? "contained" : "outlined"}>Disabled</Button>
                </ButtonGroup>
              </OFieldWrapper>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(TabUtilities)