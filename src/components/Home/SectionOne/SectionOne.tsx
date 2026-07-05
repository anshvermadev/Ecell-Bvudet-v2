import Button from "../../Button/Button";
import S from "./SectionOne.module.scss";
import React, { useEffect, useRef } from "react";
import SectionOneAnimation from "../../../animations/section-one";

type SectionOneProps = {
	scroll: any;
	appLoaded: boolean;
	preloaded: boolean;
	windowWidth: number;
};

const SectionOne: React.FC<SectionOneProps> = ({
	scroll,
	appLoaded,
	preloaded,
	windowWidth,
}) => {
	const buttonRef = useRef<HTMLDivElement>(null);
	const subTextRef = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		const loadedAnimationDelay = windowWidth <= 1024 ? 3.3 : 3;
		if (preloaded) {
			SectionOneAnimation(
				[subTextRef.current, buttonRef.current, "#section-one button + p"],
				!appLoaded ? 0 : loadedAnimationDelay
			);
		}
	}, [preloaded]);

	const handleOnClick = () => {
		scroll.scrollTo(document.querySelector("#section-two"), {
			offset: (windowWidth / 100) * -6,
		});
	};

	return (
		<section id="section-one" data-scroll-section>
			<div className={S.section}>
				<video
					autoPlay
					loop
					muted
					playsInline
					className={S.video}
				>
					<source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" type="video/mp4" />
				</video>
				<h1
					data-splitting=""
					className={`${S.text} split-text hidden-init`}
				>
					From Classrooms to Boardrooms
				</h1>
				<p ref={subTextRef} className={`${S.subText} hidden-init`}>
					Entrepreneurship Cell · BVUDET · Est. 2023
				</p>
				<div ref={buttonRef} className={`${S.button} hidden-init`}>
					<Button
						text="explore"
						use="section-one"
						onClick={handleOnClick}
					/>
				</div>
				<div className={S.scrollIndicator}>
					<span>scroll to explore</span>
					<div className={S.scrollLine} />
				</div>
			</div>
		</section>
	);
};

export default SectionOne;
