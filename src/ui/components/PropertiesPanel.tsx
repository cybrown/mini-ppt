import * as React from "react";
import { Widget, WidgetTextZone } from "../../widget";
import { TextPropertiesPanel } from "./TextPropertiesPanel";
import { Divider } from "material-ui";
import { CustomSlider } from "../../util/components/CustomSlider";

export const PropertiesPanel: React.SFC<{
    widgets: Widget[];
    onChangeFontSizeWidget: (fontSize: number) => void;
    onChangeOpacity: (opacity: number, final: boolean) => void;
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
                <CustomSlider
                    value={widgets[0].opacity}
                    onChange={(_, opacity) => onChangeOpacity(opacity, false)}
                    onDragStop={(_, opacity) => onChangeOpacity(opacity, true)}
                />
            </div>
            <Divider />
            {specificPropertiesPanel}
        </div>
    );
};
