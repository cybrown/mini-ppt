import * as React from "react";
import { WidgetTextZone } from "../../widget";
import { TextField } from "material-ui";

export const TextPropertiesPanel: React.SFC<{
    widget: WidgetTextZone;
    onChangeFontSizeWidget: (fontSize: number) => void;
}> = ({widget, onChangeFontSizeWidget}) => (
    <div>
        <TextField floatingLabelText="Font size" value={widget.fontSize} onChange={e => onChangeFontSizeWidget(Number((e.target as any).value))} />
    </div>
);
