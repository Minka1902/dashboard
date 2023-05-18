export default function NavBar(props) {
	const { isLoggedIn, firstButtonClick, secondButtonClick, theme, isHomePage } = props;

	return (
		<div className={`nav-bar ${isLoggedIn ? '' : 'nav-bar_reduced'}`}>
			<button className={`nav-bar__button${isHomePage ? '_active' : ''}${theme ? '_theme_dark' : ''}`} onClick={firstButtonClick}>Refresh</button>
			{isLoggedIn ? <button className={`nav-bar__button${isHomePage ? '' : '_active'}${theme ? '_theme_dark' : ''}`} onClick={secondButtonClick}>Saved articles</button> : <></>}
		</div>
	);
}
