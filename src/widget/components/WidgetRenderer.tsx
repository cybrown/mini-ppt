import * as React from "react";
import { TextZone } from "./TextZone";
import { Rectangle } from "./Rectangle";
import { Widget } from "../index";

export const WidgetRenderer: React.SFC<{widget: Widget}> = ({widget}) => {
    switch (widget.kind) {
        case 'text':
            return <TextZone backgroundColor={widget.backgroundColor} text={widget.text} width={widget.width} height={widget.height} fontSize={widget.fontSize} />;
        case 'rectangle':
            return <Rectangle backgroundColor={widget.backgroundColor} width={widget.width} height={widget.height} />;
    }
}
