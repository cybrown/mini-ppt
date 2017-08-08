import * as React from 'react';
import { Menu, MenuItem } from "material-ui";
import { connect } from "react-redux";
import { AppState, AppAction } from "../../app/index";
import { Dispatch } from "redux";
import { ContextMenuEntry } from "../index";

export const ContextMenu = connect((state: AppState) => ({
    entries: Object.keys(state.ui.contextMenu.entries).map(topic => state.ui.contextMenu.entries[topic]).reduce((prev, cur) => prev.concat(cur), [])
}), (dispatch: Dispatch<AppAction>) => ({
    onItemClick: (entry: ContextMenuEntry) => entry.actions.forEach(action => dispatch(action))
}))(props => (
    <Menu>
        {props.entries.map((entry, index) => (
            <MenuItem key={index} primaryText={entry.caption} onClick={() => props.onItemClick(entry)}/>
        ))}
    </Menu>
));
