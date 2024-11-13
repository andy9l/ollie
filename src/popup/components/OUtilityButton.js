import { Button } from '@material-ui/core'
import React, { PureComponent } from 'react'

class OUtilityButton extends PureComponent {
  render() {
    return (
      <Button variant="outlined" fullWidth size="small" color={this.props.color || "primary"} onClick={this.props.onClick} startIcon={this.props.icon}>
        {this.props.title}
      </Button>
    )
  }
}

export default OUtilityButton