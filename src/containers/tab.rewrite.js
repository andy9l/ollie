import { Box, Button, ButtonGroup, Chip, Grid, Typography, withStyles } from '@material-ui/core'
import AccountIcon from '@material-ui/icons/AccountCircle'
import SpacesIcon from '@material-ui/icons/Cloud'
import PathIcon from '@material-ui/icons/Code'
import DomainIcon from '@material-ui/icons/Language'
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
    if (ref === "domain") value = value.replace(/(^(http|https):\/\/)|\/+/gi, "")
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
        <Grid item xs={12} hidden={this.props.hidden}>
          <OFieldWrapper reference="space" adornmentIcon={<SpacesIcon color={this.props.enabled ? (this.props.space.length ? "primary" : "") : "disabled"} />}>
            <OTextField
              disabled={!this.props.enabled}
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
              disabled={!this.props.enabled}
              size="small"
              color={this.props.space === "*stage" ? "primary" : "default"}
              label="*stage"
              onClick={() => { if (this.props.enabled) this.forceSpace("*stage") }}
            />
            <Chip
              disabled={!this.props.enabled}
              size="small"
              color={this.props.space === "*prod" ? "primary" : "default"}
              label="*prod"
              onClick={() => { if (this.props.enabled) this.forceSpace("*prod") }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} className={this.props.classes.tagVersion}>
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
        <Grid item xs={12}>
          <OFieldWrapper reference="account" adornmentIcon={<AccountIcon color={this.props.enabled ? (this.props.account.length ? "primary" : "") : "disabled"} />}>
            <OTextField
              disabled={!this.props.enabled}
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
          <OFieldWrapper reference="domain" adornmentIcon={<DomainIcon color={this.props.enabled ? (this.props.domain.length && this.props.path.length ? "primary" : "") : "disabled"} />}>
            <OTextField
              disabled={!this.props.enabled}
              label="First-Party Bootstrap Domain"
              placeholder="tags.example.com"
              reference="domain"
              value={this.props.domain}
              onChange={this.onChangeOTextField.bind(this)}
              onClear={this.onClearOTextField.bind(this)}
              onKeyDown={this.onKeyDownOTextField.bind(this)}
            />
          </OFieldWrapper>
        </Grid>
        <Grid item xs={12}>
          <OFieldWrapper reference="path" adornmentIcon={<PathIcon color={this.props.enabled ? (this.props.domain.length && this.props.path.length ? "primary" : "") : "disabled"} />}>
            <OTextField
              disabled={!this.props.enabled}
              label="First-Party Bootstrap Path"
              placeholder="/"
              reference="path"
              value={this.props.path}
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