import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './Popup';
import theme from './theme';

ReactDOM.render(
  <React.Fragment>
    <ThemeProvider theme={theme}>
      <Popup />
    </ThemeProvider>
  </React.Fragment>,
  document.getElementById('root')
);