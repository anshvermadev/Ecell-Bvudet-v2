import gsap from "gsap";
import splitting from "splitting";
import S from "./NotFound.module.scss";
import { Link } from "react-router-dom";
import { PageProps } from "../page.types";
import Nav from "../../components/Nav/Nav";
import React, { useEffect, useRef } from "react";
import Button from "../../components/Button/Button";

const NotFound: React.FC<PageProps> = ({
	appLoaded,
	preloaded,
	navOnClick,
	setAppLoaded,
}) => {
	const navRef = useRef(null);

	useEffect(() => {
		if (preloaded) {
			setAppLoaded(true);
		}
	}, [preloaded]);

	useEffect(() => {
		if (preloaded) {
			splitting({ by: "words", target: "#notfound-section .split-text" });
			const delay = appLoaded ? 2.5 : 0;
			const scope = gsap.utils.selector("#notfound-section");
			gsap.set(scope(".hidden-init"), { visibility: "visible" });

			gsap.from(scope(".split-text .word, .whitespace"), {
				delay: 0.25 + delay,
				duration: 1.5,
				opacity: 0,
				yPercent: 100,
				stagger: 0.05,
				ease: "power3.out",
			});

			gsap.to(scope(`.${S.animateOpacity}`), {
				delay: 1 + delay,
				duration: 1.25,
				opacity: 1,
				stagger: 0.05,
				ease: "power2.out",
			});
		}
	}, [preloaded, appLoaded]);

	return (
		<>
			<Nav ref={navRef} onClick={navOnClick} />
			<div id="notfound-section" className={S.section}>
				<div className={S.main}>
					<div className={`${S.number} split-text hidden-init`}>
						404
					</div>
					<h1 className={`${S.title} split-text hidden-init`}>
						PAGE NOT FOUND
					</h1>
					<p className={`${S.text} ${S.animateOpacity}`}>
						The page you are looking for doesn't exist or has been moved.
					</p>
					<div className={S.animateOpacity}>
						<Link to="/" className={S.buttonLink}>
							<Button use="credits" text="GO BACK HOME" />
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default NotFound;
