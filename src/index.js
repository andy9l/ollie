import { ThemeProvider } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './Popup';
import theme from './theme';

const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

ReactDOM.render(
  <React.Fragment>
    <ThemeProvider theme={darkMode ? theme.dark : theme.light}>
      <Popup darkMode={darkMode} />
    </ThemeProvider>
  </React.Fragment>,
  document.getElementById('root')
);