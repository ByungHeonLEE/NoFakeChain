import React from 'react';
import { Link } from 'react-router-dom';

const Header = (props) => {
	return (
		<div>
			<h3>안녕하세요. 메인페이지 입니다.</h3>
			<ul>
				<Link to="/"><li>메인페이지</li></Link>
				<Link to="/gallery"><li>갤러리페이지</li></Link>
			</ul>
		</div>
	);
};

export default Header;