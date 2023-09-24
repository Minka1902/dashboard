import React from "react";
import { delay } from "../../constants/constants";
import { CardPerson } from '../cards/Cards';

export default function AboutUs({ people, title, subtitle }) {
    const [isCopied, setIsCopied] = React.useState(false);
    const [whatWasCopied, setWhatWasCopied] = React.useState('');

    const copy = async (whatWasCopied) => {
        setIsCopied(true);
        setWhatWasCopied(whatWasCopied);
        await delay(0.9);
        setIsCopied(false);
    };

    return (
        <section name='about-us' id='about-us'>
            <h1 className='section__title'>{title}</h1>
            <h4 className='section__title'>{subtitle}</h4>
            <p className="about-us__paragraph">Geomage is a service driven software and technology company with an expertise, focus and passion for R&D innovations.</p>
            <div className='the-team'>
                {people.map((man, index) => {
                    return <CardPerson person={man} isEmail={true} isInstagram={false} isGithub={false} key={index} onCopy={copy} />
                })}
            </div>
            <div className={`about-us__copy-message${whatWasCopied === 'Email' ? ' less-width' : ''}${isCopied ? ' copied' : ''}`}>{whatWasCopied} copied</div>
        </section>
    );
};
