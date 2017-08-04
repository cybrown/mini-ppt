import * as React from "react";
import { Widget } from "./index";

const TextZone: React.SFC<{
    text: string;
    width: number;
    height: number;
    fontSize: number;
    backgroundColor: string;
}> = ({text, width, height, fontSize, backgroundColor}) => (
    <div style={{width: width + 'px', height: height + 'px', fontSize: fontSize + 'px', backgroundColor}}>{text}</div>
);

const Rectangle: React.SFC<{backgroundColor: string, width: number, height: number}> = ({backgroundColor, width, height}) => (
    <div style={{width: width + 'px', height: height + 'px', backgroundColor}}></div>
)

export const WidgetRenderer: React.SFC<{widget: Widget}> = ({widget}) => {
    switch (widget.kind) {
        case 'text':
            return <TextZone backgroundColor={widget.backgroundColor} text={widget.text} width={widget.width} height={widget.height} fontSize={widget.fontSize} />;
        case 'rectangle':
            return <Rectangle backgroundColor={widget.backgroundColor} width={widget.width} height={widget.height} />;
    }
}
