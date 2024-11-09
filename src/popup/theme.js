import { createTheme } from "@material-ui/core";
import { cyan, red } from "@material-ui/core/colors";

const theme = {
  palette: {
    primary: {
      main: cyan[800]
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
    ...theme.palette,
    primary: {
      main: cyan[300]
    }
  }
}

export default {
  light: createTheme(theme),
  dark: createTheme(darkTheme)
}