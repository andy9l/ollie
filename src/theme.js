import { createMuiTheme } from "@material-ui/core";
import { cyan, red } from "@material-ui/core/colors";

const theme = {
  palette: {
    primary: {
      main: cyan[300]
    },
    secondary: {
      main: red[500]
    }
  }
}

const darkTheme = {
  ...theme,
  palette: {
    type: 'dark',
    ...theme.palette
  }
}

export default {
  light: createMuiTheme(theme),
  dark: createMuiTheme(darkTheme)
}