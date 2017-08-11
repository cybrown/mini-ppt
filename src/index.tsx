import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Root } from './Root';
import { store } from './store';

import * as injectTapEventPlugin from 'react-tap-event-plugin';
import 'roboto-fontface/css/roboto/roboto-fontface.css';

injectTapEventPlugin();

const root = document.createElement('div');
root.setAttribute('id', 'app-root');
document.body.appendChild(root);

const doRender = (component?: JSX.Element) => render(
    <AppContainer>
        {component}
    </AppContainer>
, root);

doRender(<Root store={store} />);

declare var require: any;
declare var module: any;

if (module.hot) {
    module.hot.accept("./Root", () => {
        const NextRoot = require("./Root").Root;
        doRender(<NextRoot store={store} />);
    });
}
