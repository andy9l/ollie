const styles = theme => ({
  wrapper: {
    width: "360px",
    padding: `${theme.spacing(3)}px ${theme.spacing(2)}px ${theme.spacing(1)}px`
  },
  enableButton: {
    width: "6em",
    height: "6em",
    borderRadius: "6em",
    "& svg": {
      fontSize: "4em"
    }
  },
  label: {
    color: theme.palette.grey[600],
    transform: "scale(0.75)",
    letterSpacing: "normal"
  },
  spaceChips: {
    marginTop: "0.35em"
  },
  buttonGroup: {
    marginTop: theme.spacing(0.5)
  },
  gridItemSpace: {
    marginTop: theme.spacing(2),
    paddingBottom: `0 !important`
  },
  gridItemVersion: {
    paddingTop: `0 !important`
  },
  gridItemMVT: {
    paddingTop: `${theme.spacing(1.5)}px !important`
  },
  gridItemUtilities: {
    paddingTop: `${theme.spacing(2)}px !important`
  },
  utilityButtonsWrapper: {
    marginTop: `${theme.spacing(1)}px !important`,
    "&.hidden": {
      display: "none"
    }
  }
})

export default styles