import * as React from "react";
import { Widget, WidgetTextZone } from "../../widget";
import { TextPropertiesPanel } from "./TextPropertiesPanel";
import { Divider, Slider } from "material-ui";

export const PropertiesPanel: React.SFC<{
    widgets: Widget[];
    onChangeFontSizeWidget: (fontSize: number) => void;
    onChangeOpacity: (opacity: number) => void;
}> = ({widgets, onChangeFontSizeWidget, onChangeOpacity}) => {
    let specificPropertiesPanel;
    switch (true) {
        case widgets.every(w => w.kind === 'rectangle'):
            specificPropertiesPanel = null;
            break;
        case widgets.every(w => w.kind === 'text'):
            specificPropertiesPanel = <TextPropertiesPanel widgets={widgets as WidgetTextZone[]} onChangeFontSizeWidget={onChangeFontSizeWidget} />;
            break;
    }
    return (
        <div>
            <div style={{padding: '8px'}}>
                <Slider value={widgets[0].opacity} onChange={(_, opacity) => onChangeOpacity(opacity)} />
            </div>
            <Divider />
            {specificPropertiesPanel}
        </div>
    );
};
