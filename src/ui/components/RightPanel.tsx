import * as React from "react";
import { Widget } from "../../widget";
import { Paper } from "material-ui";
import { PropertiesPanel } from "./PropertiesPanel";

export const RightPanel: React.SFC<{
    widget?: Widget;
    onChangeFontSizeWidget: (fontSize: number) => void;
}> = ({widget, onChangeFontSizeWidget}) => (
    widget ? (
        <Paper style={{position: 'absolute', right: 0, top: 0, width: '218px'}}>
            <PropertiesPanel widget={widget} onChangeFontSizeWidget={onChangeFontSizeWidget} />
        </Paper>
    ) : null
);
