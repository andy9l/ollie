import { Box, Grid, Typography, withStyles } from '@material-ui/core';
import OptInIcon from '@material-ui/icons/CheckCircleOutline';
import OpenBannerIcon from '@material-ui/icons/MenuOpen';
import OptOutIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';
import OpenModalIcon from '@material-ui/icons/Tune';
import React, { PureComponent } from 'react';
import OPrivacyPreference from '../components/OPrivacyPreference';
import OUtilityButton from '../components/OUtilityButton';
import styles from '../Popup.css';

class TabPrivacy extends PureComponent {
  render() {
    return (
      <>
        {
          this.props.privacyPreferences !== false ?
            <React.Fragment>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <OUtilityButton
                    title="Open Banner"
                    icon={<OpenBannerIcon />}
                    onClick={() => this.props.onClickUtilityButton('openBanner', true)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <OUtilityButton
                    title="Open Modal"
                    icon={<OpenModalIcon />}
                    onClick={() => this.props.onClickUtilityButton('openModal', true)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <OUtilityButton
                    title="Opt-in All"
                    icon={<OptInIcon />}
                    onClick={() => this.props.onClickUtilityButton('optInAll')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <OUtilityButton
                    title="Opt-out All"
                    color="secondary"
                    icon={<OptOutIcon />}
                    onClick={() => this.props.onClickUtilityButton('optOutAll')}
                  />
                </Grid>
              </Grid>
              <Box className={this.props.classes.privacyPreferenceRowContainer}>
                {Object.keys(this.props.privacyPreferences).sort().map((preference, i) =>
                  <OPrivacyPreference
                    key={i}
                    darkMode={this.props.darkMode}
                    preference={preference}
                    preferenceValue={this.props.privacyPreferences[preference]}
                    onChangePreference={this.props.onChangePreference}
                  />
                )}
              </Box>
            </React.Fragment>
            :
            <React.Fragment>
              <Grid container className={this.props.classes.privacyPreferenceRowContainer}>
                <Grid item xs={12}>
                  <Typography variant="body" component="div" align="center" color="secondary" className={`${this.props.classes.privacyPreferenceLabelError}`}>Ensighten Privacy not detected</Typography>
                </Grid>
              </Grid>
            </React.Fragment>
        }
      </>
    )
  }
}

export default withStyles(styles, { withTheme: true })(TabPrivacy)