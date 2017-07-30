import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';

const root = document.createElement('div');

document.body.appendChild(root);

const doRender = (component?: JSX.Element) => render(<AppContainer>{component}</AppContainer>, root);

doRender(<App />);

declare var require: any;
declare var module: any;

if (module.hot) {
    module.hot.accept("./App", () => {
        const NextApp = require("./App").default;
        doRender(<NextApp />);
    });
}
