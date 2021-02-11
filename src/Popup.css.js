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
  buttonGroup: {
    marginTop: theme.spacing(0.5)
  },
  gridItemSpace: {
    marginTop: theme.spacing(3),
    paddingBottom: `0 !important`
  },
  gridItemVersion: {
    paddingTop: `0 !important`
  },
  gridItemMVT: {
    paddingTop: `${theme.spacing(1.5)}px !important`
  },
  gridItemStandard: {
    paddingTop: `${theme.spacing(3)}px !important`
  },
})

export default styles