import * as React from "react";
import { TextZone } from "./TextZone";
import { Rectangle } from "./Rectangle";
import { Widget } from "../index";

export const WidgetRenderer: React.SFC<{widget: Widget}> = ({widget}) => {
    let innerElement;
    switch (widget.kind) {
        case 'text':
            innerElement = <TextZone backgroundColor={widget.backgroundColor}
                                     text={widget.text}
                                     width={widget.width}
                                     height={widget.height}
                                     fontSize={widget.fontSize} />;
        break;
        case 'rectangle':
            innerElement = <Rectangle backgroundColor={widget.backgroundColor}
                                      width={widget.width}
                                      height={widget.height} />;
        break;
    }
    return <div style={{opacity: widget.opacity}}>{innerElement}</div>
}
