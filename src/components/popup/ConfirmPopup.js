import PopupWithForm from './PopupWithForm';

export default function ConfirmPopup(props) {
    const { isOpen, onClose, handleSubmit } = props;

    const onSubmit = (evt) => {
        evt.preventDefault();
        if (evt.type === 'submit' && evt.target.classList.contains('popup__form')) {
            handleSubmit();
        }
    }

    const dontDelete = (evt) => {
        evt.preventDefault();
        if (evt.type === 'click' && evt.target.classList.contains('popup__button')) {
            onClose();
        }
    }

    return (
        <PopupWithForm onSubmit={onSubmit} isValid={true} name="confirm" title="Sure you want to delete?" isOpen={isOpen} onClose={onClose} buttonText={'Yes, i am sure.'}>
            <button className='popup__button' onClick={dontDelete}>
                Don`t delete.
            </button>
        </PopupWithForm>
    );
}