import React from 'react';
import RightClickItem from './RightClickItem';

export default function RightClickMenu({ items, isLoggedIn }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [evt, setEvt] = React.useState(undefined);
    const filteredItems = isLoggedIn ? items : items.filter(item => item.isAllowed);

    const handleItemClick = (item) => {
        const isFound = handleFilter(evt.target, item.filter);
        if (isFound.found) {
            item.buttonClicked(isFound);
        }
        setIsOpen(false);
    };

    const handleFilter = (element, filter) => {
        while (element) {
            if ((element.classList.contains(filter)) || (element.id === filter)) {
                return { found: true, id: element.id };
            }
            if (element.nodeName === 'BODY') {
                return { found: false };
            }
            element = element.parentElement;
        }
        return { found: false };
    };

    React.useEffect(() => {
        // ! setting the position of the right click menu to the mouse position, opening the menu, and checking what menu should be opened
        const handleContextMenu = (event) => {
            setIsOpen(false);
            event.preventDefault();
            setEvt(event);
            if (items.some(item => handleFilter(event.target, item.filter).found)) {
                setIsOpen(true);
            }
            setPosition({ x: event.clientX, y: event.clientY });
        };
        //! closing the menu when the user clicks outside of it
        const closeMenu = (evt) => {
            if (!evt.target.classList.contains('menu-item') && !evt.target.classList.contains('right-click-menu')) {
                setIsOpen(false);
            }
        };
        //! closing the menu when the user clicks the ESCAPE key
        const closeByEscape = (evt) => {
            if (evt.key === 'Escape') {
                setIsOpen(false);
            }
        };
        //! closing the menu when the user start scrolling
        const closeWhenScroll = () => {
            setIsOpen(false);
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('click', closeMenu);
        document.addEventListener('keydown', closeByEscape);
        document.addEventListener('scroll', closeWhenScroll);
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('click', closeMenu);
            document.removeEventListener('keydown', closeByEscape);
            document.removeEventListener('scroll', closeWhenScroll);
        };
    }, []);         //eslint-disable-line

    return (
        <div className={`right-click-menu ${isOpen ? 'open' : ''}`} style={{ top: position.y, left: position.x }}>
            {filteredItems.map((item, index) => {
                if (item.filter !== 'header') {
                    return <RightClickItem item={item} key={index} index={index} handleClick={handleItemClick} isNone={handleFilter(evt ? evt.target : undefined, item.filter).found} />
                } else {
                    if (isLoggedIn) {
                        return <RightClickItem item={item} key={index} index={index} handleClick={handleItemClick} isNone={handleFilter(evt ? evt.target : undefined, item.filter).found} />
                    } else {
                        <></>
                    }
                }
            })}
        </div>
    );
};
