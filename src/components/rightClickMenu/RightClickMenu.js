import React from 'react';
import RightClickItem from './RightClickItem';

export default function RightClickMenu({ items, isLoggedIn }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [evt, setEvt] = React.useState(undefined);

    const handleItemClick = (item) => {
        const isFound = handleFilter(evt.target, item.filter);
        if (isFound.found) {
            item.buttonClicked(isFound);
        }
        setIsOpen(false);
    };

    const handleFilter = (element, filter) => {
        if (element) {
            if (element.classList.contains(filter)) {
                return { found: true, id: element.id };
            }
            if (element.nodeName === 'BODY') {
                return { found: false };
            }
            return handleFilter(element.parentElement, filter);

        }
        return { found: false };
    };

    // ! setting the position of the right click menu to the mouse position, opening the menu, and checking what menu should be opened
    React.useEffect(() => {
        const handleContextMenu = (event) => {
            setIsOpen(false);
            event.preventDefault();
            setEvt(event);
            for (let i = 0; i < items.length; i++) {
                if (handleFilter(event.target, items[i].filter).found) {
                    setIsOpen(true);
                }
            }
            setPosition({ x: event.clientX, y: event.clientY });
        };

        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);         //eslint-disable-line

    //! closing the menu when the user clicks outside of it
    React.useEffect(() => {
        const closeMenu = (evt) => {
            if (!evt.target.classList.contains('menu-item') && !evt.target.classList.contains('right-click-menu')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener('click', closeMenu);
    }, []);

    //! closing the menu when the user clicks the ESCAPE key
    React.useEffect(() => {
        const closeByEscape = (evt) => {
            if (evt.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', closeByEscape);
        return () => document.removeEventListener('keydown', closeByEscape);
    }, []);

    //! closing the menu when the user start scrolling
    React.useEffect(() => {
        const closeWhenScroll = () => {
            setIsOpen(false);
        };

        document.addEventListener('scroll', closeWhenScroll);
        return () => document.removeEventListener('scroll', closeWhenScroll);
    }, []);

    return (
        <div className={`right-click-menu ${isOpen ? 'open' : ''}`} style={{ top: position.y, left: position.x }}>
            {items.map((item, index) => {
                if (isLoggedIn) {
                    return <RightClickItem item={item} key={index} index={index} handleClick={handleItemClick} isNone={handleFilter(evt ? evt.target : undefined, item.filter).found} />;
                } else {
                    if (item.isAllowed) {
                        return <RightClickItem item={item} key={index} index={index} handleClick={handleItemClick} isNone={handleFilter(evt ? evt.target : undefined, item.filter).found} />;
                    }
                    return;
                }
            }
            )}
        </div>
    );
};
