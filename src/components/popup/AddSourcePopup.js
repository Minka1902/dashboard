import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddSourcePopup(props) {
    const { linkText, isOpen, handleSwitchPopup, onSubmit, isLoggedIn, onClose, buttonText = 'Submit' } = props;
    const [name, setName] = React.useState('');
    const [url, setUrl] = React.useState('');
    const [isUrlCorrect, setIsUrlCorrect] = React.useState(false);
    const [isValid, setIsValid] = React.useState(false);

    // ! submit
    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (isValid) {
            onSubmit({ name, url });
            setIsValid(false);
        }
    };

    React.useEffect(() => {
        const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/[\w.-]*)*\/?(\?[^\s]*)?$/i;
        if (name) {
            if (urlRegex.test(url)) {
                setIsUrlCorrect(true);
                setIsValid(true);
            } else {
                setIsUrlCorrect(false);
                setIsValid(false);
            }
        }
    }, [name, url]);

    return (
        <>
            <PopupWithForm onSubmit={handleSubmit} isValid={isValid} handleSwitchPopup={handleSwitchPopup} linkText={linkText} name="add-source" title="Add source" isOpen={isOpen} onClose={onClose} buttonText={buttonText}>
                {isLoggedIn ?
                    <>
                        <h3 className='popup__input-title'>Source name</h3>
                        <input
                            className="popup__input"
                            placeholder="Enter name"
                            id="login-name-input"
                            type="text"
                            name="nameInput"
                            required
                            minLength="2"
                            maxLength="40"
                            value={name}
                            onChange={(evt) => setName(evt.currentTarget.value)}
                            autoComplete="off"
                        />
                        <h3 className='popup__input-title'>Url</h3>
                        <input
                            className="popup__input"
                            placeholder="Enter url"
                            id="login-url-input"
                            type="text"
                            name="urlInput"
                            required
                            minLength="8"
                            maxLength="200"
                            value={url}
                            onChange={(evt) => setUrl(evt.currentTarget.value)}
                        />
                        <p className={`popup__error-massage${isUrlCorrect ? '' : '_visible'}`}>Please enter valid URL.</p>
                    </>
                    :
                    <h2 className="popup__content_other">Please sign in.</h2>}
            </PopupWithForm>
        </>
    );
}