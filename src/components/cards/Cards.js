import './cards.css';
import * as Svg from '../../images/SvgComponents';

export function CardPerson({ person, isInstagram = true, isLinkedin = true, isGithub = true, isWhatsApp = false, isEmail = false, isPhone = true, onCopy }) {
    const onButtonClick = (evt) => {
        const buttonClicked = getButton(evt.target);
        if (buttonClicked) {
            const classes = buttonClicked.className;
            if (classes.indexOf('instagram') !== -1) {
                window.open(person.social.instagram, '_blank', 'noopener,noreferrer');
            } else {
                if (classes.indexOf('linkedin') !== -1) {
                    window.open(person.social.linkedin, '_blank', 'noopener,noreferrer');
                } else {
                    if (classes.indexOf('github') !== -1) {
                        window.open(person.social.github, '_blank', 'noopener,noreferrer');
                    } else {
                        if (classes.indexOf('email') !== -1) {
                            handleCopy(false);
                        } else {
                            if (classes.indexOf('phone') !== -1) {
                                handleCopy(true);
                            }
                        }
                    }
                }
            }
        }
    };

    const getButton = (element) => {
        if (element.nodeName.toLowerCase() === 'button') {
            return element;
        }
        return getButton(element.parentElement);
    };

    const handleCopy = (isNumber) => {
        const tempInput = document.createElement("input");
        tempInput.style = "position: absolute; left: -1000px; top: -1000px";
        if (onCopy) {
            if (isNumber) {
                tempInput.value = "+972-585241224";
                onCopy('Phone number');
            } else {
                tempInput.value = "minka@geomage.com";
                onCopy('Email');
            }
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy", tempInput.value);
            document.body.removeChild(tempInput);
        }
    };

    return (
        <div className="card-person">
            <img className="card-person__photo" src={person.image} alt="" />
            <div className="card-person__title"><span className='capitalized'>{person.name}</span> <br />
                <span>{person.title}</span>
            </div>
            <div className="card-person__socials">
                {isInstagram ? <button className="card-person__socials_btn social-instagram" onClick={onButtonClick}>
                    <Svg.SvgInstagram />
                </button> : <></>}
                {isGithub ? <button className="card-person__socials_btn social-github" onClick={onButtonClick}>
                    <Svg.SvgGithub />
                </button> : <></>}
                {isLinkedin ? <button className="card-person__socials_btn social-linkedin" onClick={onButtonClick}>
                    <Svg.SvgLinkedIn />
                </button> : <></>}
                {isWhatsApp ? <button className="card-person__socials_btn social-whatsapp" onClick={onButtonClick}>
                    <Svg.SvgWhatsApp />
                </button> : <></>}
                {isEmail ? <button className="card-person__socials_btn social-email" onClick={onButtonClick}>
                    <Svg.SvgMail title='Copy email' />
                </button> : <></>}
                {isPhone ? <button className="card-person__socials_btn social-phone" onClick={onButtonClick}>
                    <Svg.SvgPhone title='Copy phone number' />
                </button> : <></>}
            </div>
        </div>
    );
};
