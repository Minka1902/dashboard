import * as React from 'react';

export default function NavMenu(props) {
	const { isOpen, isLoggedIn, firstButtonClick, secondButtonClick, children } = props;

	return (
		<>
			<div className={`nav-menu${isOpen ? ' nav-menu_opened' : ''}`}>
				<div className="nav-menu__container">
					<button className='nav-menu__button' onClick={firstButtonClick}>Refresh</button>
					{
						isLoggedIn ?
							<button className='nav-menu__button' onClick={secondButtonClick}>Saved articles</button>
							:
							<></>
					}
				</div>
				{children}
			</div>

			<div className={`overlay${isOpen ? ' overlay_opened' : ''}`}></div>
		</>
	);
}