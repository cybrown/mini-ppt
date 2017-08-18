import * as React from "react";
import { Widget } from "../../widget";
import { Paper } from "material-ui";
import { PropertiesPanel } from "./PropertiesPanel";

export const RightPanel: React.SFC<{
    widgets: Widget[];
    onChangeFontSizeWidget: (fontSize: number) => void;
    onChangeOpacity: (opacity: number, final: boolean) => void;
}> = ({widgets, onChangeFontSizeWidget, onChangeOpacity}) => (
    widgets.length > 0 ? (
        <Paper style={{position: 'absolute', right: 0, top: 0, width: '218px'}}>
            <PropertiesPanel
                widgets={widgets}
                onChangeFontSizeWidget={onChangeFontSizeWidget}
                onChangeOpacity={onChangeOpacity}
            />
        </Paper>
    ) : null
);
