import * as React from "react";
import { modifierForMultiSelection } from "../index";

export const HasPosition: React.SFC<{
    x: number;
    y: number;
    onClick?: (ctrl: boolean) => void;
}> = ({x, y, children, onClick}) => (
    <div
        style={{position: 'absolute', left: x + 'px', top: y + 'px'}}
        onClick={e => (onClick && onClick(e.getModifierState(modifierForMultiSelection())), e.stopPropagation())}
    >
        {children}
    </div>
);
