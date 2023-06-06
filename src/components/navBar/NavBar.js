import React from 'react';
import { capitalizeFirstWord } from '../../constants/functions';

export default function NavBar({ buttons }) {
    return (
        <nav className="nav-bar">
            <ul className="nav-bar__list">
                {buttons.map((button, index) => (
                    <li className="nav-bar__item" key={index}>
                        <button
                            className="nav-bar__button"
                            onClick={button.onClick}
                        >
                            {capitalizeFirstWord(button.name)}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
