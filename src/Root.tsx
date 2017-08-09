import * as React from 'react';
import { MuiThemeProvider } from "material-ui/styles";
import { Provider } from "react-redux";
import { App } from './app/App';

import './style.scss';
import './fonts/mini-ppt-glyphs.css';
import { Store } from "redux";
import { AppState } from "./app/index";

export const Root = ({store}: {store: Store<AppState>}) => (
    <MuiThemeProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </MuiThemeProvider>
);
