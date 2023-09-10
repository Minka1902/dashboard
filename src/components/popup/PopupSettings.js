import React from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function PopupSettings({ isOpen, handleSubmit, onClose }) {
    const currentUser = React.useContext(CurrentUserContext);
    const [yAxis, setYAxis] = React.useState('zero');
    const [theme, setTheme] = React.useState('light');
    const [watch, setWatch] = React.useState('capacity');

    const changeYAxis = (evt) => {
        evt.preventDefault();
        if (evt.target.selectedOptions[0]) {
            setYAxis(evt.target.selectedOptions[0].value);
        }
    };

    const changeWatch = (evt) => {
        evt.preventDefault();
        if (evt.target.selectedOptions[0]) {
            setWatch(evt.target.selectedOptions[0].value);
        }
    };

    const changeTheme = (evt) => {
        evt.preventDefault();
        if (evt.target.selectedOptions[0]) {
            setTheme(evt.target.selectedOptions[0].value);
        }
    };

    const saveSettings = (evt) => {
        if (evt.type === 'click' || evt.type === 'submit') {
            const newSettings = { yAxis, theme, watch };
            handleSubmit(newSettings);
        }
    };

    return (
        <>
            {currentUser && currentUser.email ?
                <PopupWithForm onSubmit={saveSettings} name="settings" title="Settings" isOpen={isOpen} onClose={onClose} buttonText='Save' isValid={true}>
                    <label className="popup__setting">
                        Theme:
                        <select className="popup__settings-select" onChange={changeTheme} value={theme}>
                            <option>light</option>
                        </select>
                    </label>
                    <label className="popup__setting">
                        Y axis starts at:
                        <select className="popup__settings-select" onChange={changeYAxis} value={yAxis}>
                            <option id='zero'>zero</option>
                            <option id='lowest'>lowest</option>
                        </select>
                    </label>
                    <label className="popup__setting">
                        Watch:
                        <select className="popup__settings-select" onChange={changeWatch} value={watch}>
                            <option>memory</option>
                            <option>capacity</option>
                        </select>
                    </label>
                </PopupWithForm>
                : <></>}
        </>
    );
};
