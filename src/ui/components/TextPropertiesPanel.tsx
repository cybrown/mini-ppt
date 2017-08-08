import * as React from "react";
import { WidgetTextZone } from "../../widget";
import { TextField } from "material-ui";

export const TextPropertiesPanel: React.SFC<{
    widgets: WidgetTextZone[];
    onChangeFontSizeWidget: (fontSize: number) => void;
}> = ({widgets, onChangeFontSizeWidget}) => (
    <div>
        <TextField floatingLabelText="Font size" value={widgets[0].fontSize} onChange={e => onChangeFontSizeWidget(Number((e.target as any).value))} />
    </div>
);
