import { createMuiTheme } from "@material-ui/core";
import { cyan, red } from "@material-ui/core/colors";

export default createMuiTheme({
  palette: {
    primary: {
      main: cyan[300]
    },
    secondary: {
      main: red[500]
    }
  }
})