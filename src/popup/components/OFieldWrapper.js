import { Box, withStyles } from '@material-ui/core'
import React, { PureComponent } from 'react'

const styles = theme => ({
  oFieldContainer: {
    position: "relative"
  },
  adornment: {
    color: theme.palette.grey[700],
    paddingRight: "1em"
  },
})

class OFieldWrapper extends PureComponent {
  render() {
    return (
      <Box display="flex" alignItems="flex-end" data-ref={this.props.reference} className={this.props.classes.oFieldContainer}>
        {this.props.adornmentIcon ? <Box className={this.props.classes.adornment}>{this.props.adornmentIcon}</Box> : ``}
        <Box flexGrow={1}>
          {this.props.children}
        </Box>
      </Box>
    )
  }
}

export default withStyles(styles, { withTheme: true })(OFieldWrapper)