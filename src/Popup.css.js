import { grey } from "@material-ui/core/colors"

const styles = theme => ({
  wrapper: {
    width: "360px",
    padding: theme.spacing(3),
    "&.dark": {
      background: grey[900],
      color: grey[50]
    }
  },
  enableButton: {
    width: "6em",
    height: "6em",
    borderRadius: "6em",
    marginBottom: theme.spacing(2),
    "& svg": {
      fontSize: "4em"
    }
  },
  tab: {
    width: "100%"
  },
  label: {
    color: "rgba(0, 0, 0, 0.7)",
    transform: "scale(0.75)",
    letterSpacing: "normal",
    "&.disabled": {
      color: "rgba(0, 0, 0, 0.5)"
    },
    "&.dark": {
      color: "rgba(255, 255, 255, 0.7)",
      "&.disabled": {
        color: "rgba(255, 255, 255, 0.5)"
      }
    }
  },
  spaceChips: {
    marginTop: "0.35em"
  },
  tabWrapper: {
    marginTop: theme.spacing(2)
  },
  tagVersion: {
    marginTop: -theme.spacing(2)
  },
  mvt: {
    marginTop: theme.spacing(2)
  },
})

export default styles