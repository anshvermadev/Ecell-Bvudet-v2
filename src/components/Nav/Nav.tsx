import React from "react";
import { Link } from "react-router-dom";
import S from "./Nav.module.scss";

type NavProps = {
	onClick: () => void;
};

const Nav = React.forwardRef<HTMLElement, NavProps>(({ onClick }, ref) => {
	return (
		<nav ref={ref} className={S.nav}>
			<div className={S.upper} onClick={onClick}>
				<p>Me</p>
				<p>Nu</p>
			</div>
			<Link to="/" className={S.lower} style={{ textDecoration: "none" }}>
				<img src="/E-cell Logo.svg" alt="E-Cell Logo" className={S.logo} />
			</Link>
			<div className={S.div} />
		</nav>
	);
});

export default Nav;
