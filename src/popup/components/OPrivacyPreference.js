import { Box, Button, ButtonGroup, Grid, Typography, withStyles } from '@material-ui/core';
import React, { PureComponent } from 'react';
import PreferenceOnIcon from '@material-ui/icons/CheckCircleOutline';
import PreferenceOffIcon from '@material-ui/icons/RadioButtonUnchecked';

const styles = theme => ({
  privacyPreferenceRow: {
    marginTop: theme.spacing(1.5),
    alignItems: "center"
  },
  privacyPreferenceIcon: {
    paddingRight: theme.spacing(0.75),
    cursor: "pointer"
  },
  privacyPreferenceIconSvg: {
    width: "0.85em",
    height: "0.85em"
  },
  privacyPreferenceLabel: {
    color: "rgba(0, 0, 0, 0.54)",
    "&.dark": {
      color: "rgba(255, 255, 255, 0.7)",
    }
  },
})

class OPrivacyPreference extends PureComponent {

  togglePrivacyPreference() {
    this.props.onChangePreference(`Privacy.${this.props.preference}.${this.props.preferenceValue == 0 ? "On" : "Off"}`);
  }

  render() {
    return (
      <Grid container className={this.props.classes.privacyPreferenceRow}>
        <Grid item xs={9}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box display="flex" className={this.props.classes.privacyPreferenceIcon} onClick={this.togglePrivacyPreference.bind(this)}>
              {this.props.preferenceValue == 1 ?
                <PreferenceOnIcon color="primary" className={this.props.classes.privacyPreferenceIconSvg} />
                :
                <PreferenceOffIcon color="secondary" className={this.props.classes.privacyPreferenceIconSvg} />
              }
            </Box>
            <Typography className={`${this.props.classes.privacyPreferenceLabel} ${this.props.darkMode ? "dark" : ""}`}>{this.props.preference}</Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <ButtonGroup color={this.props.preferenceValue == 1 ? "primary" : "secondary"} disableElevation fullWidth size="small">
            <Button onClick={this.togglePrivacyPreference.bind(this)} variant={this.props.preferenceValue == 1 ? "contained" : "outlined"}>|</Button>
            <Button onClick={this.togglePrivacyPreference.bind(this)} variant={this.props.preferenceValue == 0 ? "contained" : "outlined"}>0</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles, { withTheme: true })(OPrivacyPreference)