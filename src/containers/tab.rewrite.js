import { Box, Button, ButtonGroup, Chip, Grid, Typography, withStyles } from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircle'
import SpacesIcon from '@material-ui/icons/Cloud'
import FpDomainIcon from '@material-ui/icons/Domain'
import FpFromIcon from '@material-ui/icons/CallReceived'
import FpToIcon from '@material-ui/icons/CallMade'
import VersionIcon from '@material-ui/icons/LocalOffer'
import React, { PureComponent } from 'react'
import OFieldWrapper from '../components/OFieldWrapper'
import OTextField from '../components/OTextField'
import styles from '../Popup.css'

class TabRewrite extends PureComponent {

  onKeyDownOTextField(e) {
    if (/enter/i.test(e.key)) window.close()
  }

  onChangeOTextField(e) {
    const ref = e.target.getAttribute('data-ref')
    let value = e.target.value
    if (ref === "account") value = value.replace(/[^A-z0-9-_]+/g, "")
    if (ref === "fpdomain") value = value.replace(/(^(http|https):\/\/)/i, "").replace(/\//g, "");
    this.props.setChromeStorage({ [ref]: value.trim() })
  }

  onClearOTextField(e) {
    const refElem = e.target.closest("[data-ref]")
    if (null !== refElem) {
      this.props.setChromeStorage({ [refElem.getAttribute('data-ref')]: "" })
    }
  }

  forceSpace(space) {
    this.props.setChromeStorage({ space: space })
  }

  onChangeVersion(flag) {
    this.props.setChromeStorage({ version: flag })
  }

  render() {
    return (

      <Grid container spacing={3}>
        <Grid item xs={12} hidden={this.props.fpdomain.length}>
          <OFieldWrapper reference="space" adornmentIcon={<SpacesIcon color={this.props.enabled ? (this.props.space.length ? "primary" : "") : "disabled"} />}>
            <OTextField
              darkMode={this.props.darkMode}
              disabled={!this.props.enabled || this.props.fpdomain.length}
              label={"Ensighten Space"}
              placeholder={"Default"}
              reference="space"
              value={this.props.space}
              onChange={this.onChangeOTextField.bind(this)}
              onClear={this.onClearOTextField.bind(this)}
              onKeyDown={this.onKeyDownOTextField.bind(this)}
            />
          </OFieldWrapper>
          <Box display="flex" justifyContent="flex-end" className={this.props.classes.spaceChips}>
            <Chip
              disabled={!this.props.enabled || this.props.fpdomain.length}
              size="small"
              color={this.props.space === "*stage" ? "primary" : "default"}
              label="*stage"
              onClick={() => { if (this.props.enabled) this.forceSpace("*stage") }}
            />
            <Chip
              disabled={!this.props.enabled || this.props.fpdomain.length}
              size="small"
              color={this.props.space === "*prod" ? "primary" : "default"}
              label="*prod"
              onClick={() => { if (this.props.enabled) this.forceSpace("*prod") }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} className={`${this.props.classes.tagVersion} ${this.props.fpdomain.length ? "space" : ""}`}>
          <OFieldWrapper reference="version" adornmentIcon={<VersionIcon color={this.props.enabled ? "primary" : "disabled"} />}>
            <Typography variant="caption" className={`${this.props.classes.label} ${this.props.darkMode ? "dark" : ""} ${this.props.enabled ? "" : "disabled"}`}>Tag Version</Typography>
            <ButtonGroup
              color={this.props.enabled ? "primary" : "disabled"}
              disabled={!this.props.loaded || !this.props.enabled}
              disableElevation
              fullWidth
              size="small">
              <Button onClick={() => this.onChangeVersion(1)} variant={this.props.version === 1 ? "contained" : "outlined"}>Committed</Button>
              <Button onClick={() => this.onChangeVersion(0)} variant={this.props.version === 0 ? "contained" : "outlined"}>Published</Button>
            </ButtonGroup>
          </OFieldWrapper>
        </Grid>
        <Grid item xs={12} hidden={this.props.fpdomain.length}>
          <OFieldWrapper reference="account" adornmentIcon={<AccountIcon color={this.props.enabled ? (this.props.account.length ? "primary" : "") : "disabled"} />}>
            <OTextField
              darkMode={this.props.darkMode}
              disabled={!this.props.enabled || this.props.fpdomain.length}
              label="Ensighten Account"
              placeholder="Default"
              reference="account"
              value={this.props.account}
              onChange={this.onChangeOTextField.bind(this)}
              onClear={this.onClearOTextField.bind(this)}
              onKeyDown={this.onKeyDownOTextField.bind(this)}
            />
          </OFieldWrapper>
        </Grid>
        <Grid item xs={12}>
          <OFieldWrapper reference="fpdomain" adornmentIcon={<FpDomainIcon color={this.props.enabled ? (this.props.fpdomain.length && this.props.fpfrom.length && this.props.fpto.length ? "primary" : "") : "disabled"} />}>
            <OTextField
              darkMode={this.props.darkMode}
              disabled={!this.props.enabled}
              label="First-Party Bootstrap Domain"
              placeholder="tags.example.com"
              reference="fpdomain"
              value={this.props.fpdomain}
              onChange={this.onChangeOTextField.bind(this)}
              onClear={this.onClearOTextField.bind(this)}
              onKeyDown={this.onKeyDownOTextField.bind(this)}
            />
          </OFieldWrapper>
        </Grid>
        <Grid item xs={12} hidden={!this.props.fpdomain.length}>
          <OFieldWrapper reference="fpfrom" adornmentIcon={<FpFromIcon color={this.props.enabled ? (this.props.fpdomain.length && this.props.fpfrom.length && this.props.fpto.length ? "primary" : "") : "disabled"} />}>
            <OTextField
              darkMode={this.props.darkMode}
              disabled={!this.props.enabled}
              label="First-Party Bootstrap Original Path"
              placeholder="/current/path/Bootstrap.js"
              reference="fpfrom"
              value={this.props.fpfrom}
              onChange={this.onChangeOTextField.bind(this)}
              onClear={this.onClearOTextField.bind(this)}
              onKeyDown={this.onKeyDownOTextField.bind(this)}
            />
          </OFieldWrapper>
        </Grid>
        <Grid item xs={12} hidden={!this.props.fpdomain.length}>
          <OFieldWrapper reference="fpto" adornmentIcon={<FpToIcon color={this.props.enabled ? (this.props.fpdomain.length && this.props.fpfrom.length && this.props.fpto.length ? "primary" : "") : "disabled"} />}>
            <OTextField
              darkMode={this.props.darkMode}
              disabled={!this.props.enabled}
              label="First-Party Bootstrap Rewrite Path"
              placeholder="/rewrite/path/Bootstrap.js"
              reference="fpto"
              value={this.props.fpto}
              onChange={this.onChangeOTextField.bind(this)}
              onClear={this.onClearOTextField.bind(this)}
              onKeyDown={this.onKeyDownOTextField.bind(this)}
            />
          </OFieldWrapper>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles, { withTheme: true })(TabRewrite)