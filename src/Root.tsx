import * as React from 'react';
import { MuiThemeProvider } from "material-ui/styles";
import { Provider } from "react-redux";

import { store } from './store';
import { App } from './app/App';

import './style.scss';
import './fonts/mini-ppt-glyphs.css';

export const Root = () => (
    <MuiThemeProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </MuiThemeProvider>
);
