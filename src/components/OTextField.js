import { IconButton, TextField, withStyles } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/BackspaceOutlined';
import React, { PureComponent } from 'react';

const styles = theme => ({
  clearButton: {
    position: "absolute",
    color: theme.palette.secondary.main,
    top: "1em",
    right: "0.25em",
  }
})

class OTextField extends PureComponent {
  onFocus(e) {
    e.target.setSelectionRange(0, e.target.value.length);
  }

  render() {
    return (
      <div>
        <TextField
          fullWidth
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}
          label={this.props.label}
          onChange={this.props.onChange}
          onKeyDown={this.props.onKeyDown}
          value={this.props.value}
          onFocus={this.onFocus}
          inputProps={{
            'data-ref': this.props.reference,
          }}
          InputLabelProps={{
            'shrink': true
          }} />
        { this.props.value.length ? <IconButton disabled={this.props.disabled} size="small" onClick={this.props.onClear} className={this.props.classes.clearButton}><ClearIcon fontSize="inherit" /></IconButton> : ''}
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(OTextField)