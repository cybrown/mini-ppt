import * as React from "react";

export const Rectangle: React.SFC<{backgroundColor: string, width: number, height: number}> = ({backgroundColor, width, height}) => (
    <div style={{width: width + 'px', height: height + 'px', backgroundColor}}></div>
);
