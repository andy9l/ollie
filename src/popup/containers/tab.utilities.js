import { Button, ButtonGroup, Grid, Typography, withStyles } from '@material-ui/core';
import ListTagsIcon from '@material-ui/icons/Assignment';
import TestTagIcon from '@material-ui/icons/AssignmentTurnedIn';
import MVTIcon from '@material-ui/icons/CallSplitOutlined';
import NotificationIcon from '@material-ui/icons/NotificationImportantOutlined';
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
      window.chrome.runtime.sendMessage({ command: "upstreamEvent", event_type: "mvtQAToggle" + (flag === 1 ? "On" : "Off") })
    } catch (e) { }
  }

  onChangeNotifications(flag) {
    this.props.setChromeStorage({ notifications: flag })
  }

  render() {
    return (
      <React.Fragment>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <OUtilityButton
              title="List data"
              icon={<ListDataIcon />}
              onClick={() => this.props.onClickUtilityButton('listData', true)}
            />
          </Grid>
          <Grid item xs={6}>
            <OUtilityButton
              title="Resolve data"
              icon={<ResolveDataIcon />}
              onClick={() => this.props.onClickUtilityButton('resolveData', true)}
            />
          </Grid>
          <Grid item xs={6}>
            <OUtilityButton
              title="List tags"
              icon={<ListTagsIcon />}
              onClick={() => this.props.onClickUtilityButton('listTags', true)}
            />
          </Grid>
          <Grid item xs={6}>
            <OUtilityButton
              title="Test for tag"
              icon={<TestTagIcon />}
              onClick={() => this.props.onClickUtilityButton('testTag', true)}
            />
          </Grid>
          <Grid item xs={12}>
            <OUtilityButton
              title="Server Component parameters"
              icon={<ServerCompIcon />}
              onClick={() => this.props.onClickUtilityButton('getServerComp', true)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} className={this.props.classes.notifications}>
            <OFieldWrapper reference="notifications" adornmentIcon={<NotificationIcon color={(this.props.notifications ? "primary" : "")} />}>
              <Typography variant="caption" className={`${this.props.classes.label} ${this.props.darkMode ? "dark" : ""}`}>Enable e.gif Notifications</Typography>
              <ButtonGroup color="primary" disabled={!this.props.loaded} disableElevation fullWidth size="small">
                <Button onClick={() => this.onChangeNotifications(1)} variant={this.props.notifications === 1 ? "contained" : "outlined"}>Enabled</Button>
                <Button onClick={() => this.onChangeNotifications(0)} variant={this.props.notifications === 0 ? "contained" : "outlined"}>Disabled</Button>
              </ButtonGroup>
            </OFieldWrapper>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} className={this.props.classes.mvt}>
            <OFieldWrapper reference="mvt" adornmentIcon={<MVTIcon color={(this.props.mvt ? "primary" : "")} />}>
              <Typography variant="caption" className={`${this.props.classes.label} ${this.props.darkMode ? "dark" : ""}`}>MVT Test Audience</Typography>
              <ButtonGroup color="primary" disabled={!this.props.loaded} disableElevation fullWidth size="small">
                <Button onClick={() => this.onChangeMVT(1)} variant={this.props.mvt === 1 ? "contained" : "outlined"}>Enabled</Button>
                <Button onClick={() => this.onChangeMVT(0)} variant={this.props.mvt === 0 ? "contained" : "outlined"}>Disabled</Button>
              </ButtonGroup>
            </OFieldWrapper>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(TabUtilities)