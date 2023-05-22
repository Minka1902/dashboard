import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddSourcePopup(props) {
    const { linkText, isOpen, handleSwitchPopup, onSubmit, isLoggedIn, onClose, buttonText = 'Submit' } = props;
    const [name, setName] = React.useState('');
    const [isMemory, setIsMemory] = React.useState(true);
    const [url, setUrl] = React.useState('');
    const [isUrlCorrect, setIsUrlCorrect] = React.useState(false);
    const [isValid, setIsValid] = React.useState(false);

    // ! submit
    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (isValid) {
            onSubmit({ name, url, isMemory });
            setIsValid(false);
        }
    };

    React.useEffect(() => {
        const urlRegex = /^www\.[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/;
        const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d+)?$/;
        if (name) {
            if (urlRegex.test(url) || ipRegex.test(url)) {
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
                            id="source-name-input"
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
                            id="source-url-input"
                            type="text"
                            name="urlInput"
                            required
                            minLength="8"
                            maxLength="200"
                            value={url}
                            onChange={(evt) => setUrl(evt.currentTarget.value)}
                        />
                        <p className={`popup__error-massage${isUrlCorrect ? '' : '_visible'}`}>Please enter valid URL.</p>
                        <h3 className="popup__input-title">Is it a memory source?
                            <input
                                value={isMemory}
                                name="isMemoryInput"
                                type="checkbox"
                                id="source-is-memory-input"
                                onChange={(evt) => setIsMemory(evt.target.checked)}
                            />
                        </h3>
                    </>
                    :
                    <h2 className="popup__content_other">Please sign in.</h2>}
            </PopupWithForm>
        </>
    );
}