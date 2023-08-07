import React from "react";
import { CardPerson } from '../cards/Cards';

export default function AboutUs({ people }) {
    const [isCopied, setIsCopied] = React.useState(false);
    const [whatWasCopied, setWhatWasCopied] = React.useState('');
    const delay = (seconds) => new Promise(res => setTimeout(res, seconds * 1000));

    const copy = async (whatWasCopied) => {
        setIsCopied(true);
        setWhatWasCopied(whatWasCopied);
        await delay(0.9);
        setIsCopied(false);
    };

    return (
        <section name='about-us' id='about-us'>
            <h1 className='section__title'>Geomage</h1>
            <p className='section__title'>Geomage is a company founded in 2003.</p>
            <div className='the-team'>
                {people.map((man, index) => {
                    return <CardPerson person={man} isEmail={true} isInstagram={false} isGithub={false} key={index} onCopy={copy} />
                })}
            </div>

            <div className={`about-us__copy-message${whatWasCopied === 'Email' ? ' less-width' : ''}${isCopied ? ' copied' : ''}`}>{whatWasCopied} copied</div>
        </section>
    );
};
