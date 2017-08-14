declare module 'react-mui-speeddial' {
    import * as React from 'react';

    // TODO: https://www.npmjs.com/package/react-mui-speeddial

    export class SpeedDial extends React.Component<{
        fabContentOpen?: JSX.Element;
        fabContentClose?: JSX.Element;
        style?: React.CSSProperties;
    }> {}

    export class SpeedDialItem extends React.Component<{
        label?: string | JSX.Element;
        fabContent?: JSX.Element;
        onTouchTap: React.MouseEventHandler<{}>;
    }> {}
}
