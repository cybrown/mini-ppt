import * as React from "react";
import { Widget } from "../../widget";
import { TextPropertiesPanel } from "./TextPropertiesPanel";

export const PropertiesPanel: React.SFC<{
    widget: Widget;
    onChangeFontSizeWidget: (fontSize: number) => void;
}> = ({widget, onChangeFontSizeWidget}) => {
    switch (widget.kind) {
        case 'rectangle':
            return null;
        case 'text':
            return <TextPropertiesPanel widget={widget} onChangeFontSizeWidget={onChangeFontSizeWidget} />;
    }
};
