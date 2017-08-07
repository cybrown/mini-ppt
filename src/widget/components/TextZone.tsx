import * as React from "react";

export const TextZone: React.SFC<{
    text: string;
    width: number;
    height: number;
    fontSize: number;
    backgroundColor: string;
}> = ({text, width, height, fontSize, backgroundColor}) => (
    <div style={{width: width + 'px', height: height + 'px', fontSize: fontSize + 'px', backgroundColor}}>{text}</div>
);
