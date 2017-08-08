import * as React from "react";
import { Widget } from "../../widget";
import { TextPropertiesPanel } from "./TextPropertiesPanel";
import { Divider, Slider } from "material-ui";

export const PropertiesPanel: React.SFC<{
    widget: Widget;
    onChangeFontSizeWidget: (fontSize: number) => void;
    onChangeOpacity: (opacity: number) => void;
}> = ({widget, onChangeFontSizeWidget, onChangeOpacity}) => {
    let specificPropertiesPanel;
    switch (widget.kind) {
        case 'rectangle':
            specificPropertiesPanel = null;
            break;
        case 'text':
            specificPropertiesPanel = <TextPropertiesPanel widget={widget} onChangeFontSizeWidget={onChangeFontSizeWidget} />;
            break;
    }
    return (
        <div>
            <div>
                <Slider value={widget.opacity} onChange={(_, opacity) => onChangeOpacity(opacity)} />
            </div>
            <Divider />
            {specificPropertiesPanel}
        </div>
    );
};
