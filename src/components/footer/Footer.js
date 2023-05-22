import React from "react";

export default function Footer(props) {
	return (
		<footer className="footer">
			<p className="footer__text">&copy; Powered by Geomage 2003 LTD</p>
			<div className='footer__container'>
				<div className="footer__container-links">
					{/* eslint-disable-next-line */}
					<a className="footer__link" href='#' onClick={props.homeClick}>Home</a>
					<a className="footer__link" href="https://www.geomage.com" rel="noopener noreferrer" target="_blank">Geomage</a>
				</div>
			</div>
		</footer>
	);
}
