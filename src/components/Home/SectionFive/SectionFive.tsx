import gsap from "gsap";
import Marquee from "react-fast-marquee";
import S from "./SectionFive.module.scss";
import React, { useEffect, useRef } from "react";
import { ReactComponent as Line } from "../../../svgs/line.svg";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";

type SectionFiveProps = {
	windowWidth: number;
};

const SectionFive: React.FC<SectionFiveProps> = ({ windowWidth }) => {
	const title1ScrollSpeed = windowWidth <= 1024 ? -7.5 : 1.2;
	const title2ScrollSpeed = windowWidth <= 1024 ? 6 : -1.2;

	const ref = useRef<HTMLParagraphElement>(null);
	const isOnScreen = useIntersectionObserver(ref, 1);

	useEffect(() => {
		if (isOnScreen) {
			gsap.to("#lineRef > line", {
				duration: 2,
				ease: "expo.out",
				strokeDashoffset: 0,
			});
		}
	}, [isOnScreen]);

	return (
		<section id="section-five" data-scroll-section>
			<div id="target-element" className={S.section}>
				<Marquee
					pauseOnHover
					gradient={false}
					className={S.marquee}
					speed={windowWidth > 1024 ? 15 : 80}
				>
					<p className={S.marqueeText}>Events</p>
					<p className={S.marqueeText}>Events</p>
					<p className={S.marqueeText}>Events</p>
					<p className={S.marqueeText}>Events</p>
				</Marquee>
				<div className={S.main}>
					<h2
						data-scroll
						className={S.title1}
						data-scroll-direction="horizontal"
						data-scroll-speed={title1ScrollSpeed}
					>
						Featured
					</h2>
					<img
						className={S.image}
						src="https://res.cloudinary.com/dobmi3ojr/image/upload/v1783245126/7f5f7fa2fba391b9587c8dad143b23b1_uxnw1x.jpg"
						alt=""
					/>
					<h2
						data-scroll
						className={S.title2}
						data-scroll-direction="horizontal"
						data-scroll-target="#target-element"
						data-scroll-speed={title2ScrollSpeed}
					>
						Events
					</h2>
				</div>
				<div className={S.sub}>
					<p className={S.subText}>Action-driven</p>
					<div className={S.subRow}>
						<Line
							id={"lineRef"}
							width="11.22vh"
							height="0.33vh"
							className={S.line1}
						/>
						<p ref={ref} className={S.subText}>
							Learn &amp; Execute
						</p>
					</div>
					<div className={S.subRow}>
						<p className={S.subText}>Impact-oriented</p>
						<Line
							id={"lineRef"}
							width="11.22vh"
							height="0.33vh"
							className={S.line2}
						/>
					</div>
				</div>
				<div className={S.textWrapper}>
					<p className={S.text}>
						Our calendar is packed with action-driven initiatives designed to challenge, inspire, and launch student-led startups. From intensive ideation challenges to annual regional hackathons, E-Cell BVUDET brings together builders, creators, and leaders. We collaborate with venture funds, industry experts, and startup mentors to build competitive events. Check out our signature initiatives below.
					</p>
				</div>
			</div>
		</section>
	);
};

export default SectionFive;
