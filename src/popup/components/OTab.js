import { Grid, withStyles } from '@material-ui/core'
import React, { PureComponent } from 'react'
import styles from '../Popup.css'

class OTab extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <Grid item xs={12} className={this.props.classes.tabWrapper} hidden={this.props.hidden}>
          {this.props.children}
        </Grid>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(OTab)