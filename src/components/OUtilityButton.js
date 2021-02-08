import { Button, withStyles } from '@material-ui/core'
import React, { PureComponent } from 'react'

const styles = theme => ({})

class OUtilityButton extends PureComponent {
  render() {
    return (
      <Button variant="outlined" fullWidth size="small" color="secondary" onClick={this.props.onClick} startIcon={this.props.icon}>
        {this.props.title}
      </Button>
    )
  }
}

export default withStyles(styles, { withTheme: true })(OUtilityButton)