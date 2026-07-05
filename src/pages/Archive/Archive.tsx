import gsap from "gsap";
import splitting from "splitting";
import S from "./Archive.module.scss";
import { Link } from "react-router-dom";
import { PageProps } from "../page.types";
import Nav from "../../components/Nav/Nav";
import LocomotiveScroll from "locomotive-scroll";
import Button from "../../components/Button/Button";
import IntroAnimation from "../../animations/intro";
import React, { useEffect, useRef, useState } from "react";
import { pastEvents } from "../../data/pastEvents";
const Archive: React.FC<PageProps> = ({
	appLoaded,
	preloaded,
	navOnClick,
	windowWidth,
	setAppLoaded,
}) => {
	const navRef = useRef(null);
	const scrollRef = useRef(null);
	const [scroll, setScroll] = useState<any>();
	const [activeRow, setActiveRow] = useState<number | null>(null);



	useEffect(() => {
		if (preloaded && !scroll) {
			setScroll(
				new LocomotiveScroll({
					smooth: true,
					el: scrollRef.current,
					tablet: {
						smooth: true,
					},
					smartphone: {
						smooth: true,
					},
					reloadOnContextChange: true,
				})
			);
		} else if (preloaded && scroll) {
			scroll.update();
			scroll.stop();
			scroll.update();
			const delay = windowWidth <= 1024 ? 0.8 : 0.5;
			setTimeout(() => {
				scroll.start();
				!appLoaded &&
					windowWidth > 1024 &&
					IntroAnimation(navRef.current);
				setAppLoaded(true);
			}, !appLoaded ? 0 : delay);
		}
		return () => scroll && scroll.destroy();
	}, [scroll, preloaded]);

	useEffect(() => {
		if (preloaded) {
			splitting({ by: "words", target: "#archive-page .split-text" });
			const delay = appLoaded ? 2.5 : 0;
			const pageScope = gsap.utils.selector("#archive-page");
			gsap.set(pageScope(".hidden-init"), { visibility: "visible" });
			gsap.from(pageScope(".split-text .word, .whitespace"), {
				delay: 0.25 + delay,
				duration: 1.5,
				opacity: 0,
				yPercent: 100,
				stagger: 0.05,
				ease: "power3.out",
			});
			gsap.to(`.${S.animateOpacity}`, {
				delay: 1 + delay,
				duration: 1.25,
				opacity: 1,
				stagger: 0.05,
			});
		}
	}, [preloaded]);

	return (
		<>
			<Nav ref={navRef} onClick={navOnClick} />
			<div id="archive-page" ref={scrollRef} className={S.section} data-scroll-container>
				<div className={S.hero} data-scroll-section>
					<h1
						data-splitting=""
						className={`${S.headline} split-text hidden-init`}
						data-scroll
						data-scroll-speed="1"
					>
						THE ARCHIVE
					</h1>
					<p className={`${S.subtitle} ${S.animateOpacity}`} data-scroll data-scroll-speed="0.5">
						Every event. Every story. Every outcome.
					</p>
				</div>

				<div className={S.list} data-scroll-section>
					{pastEvents.map((event, idx) => (
						<Link
							key={idx}
							to={`/past-events/${event.slug}`}
							className={`${S.row} ${S.animateOpacity}`}
							data-scroll
							onMouseEnter={() => setActiveRow(idx)}
							onMouseLeave={() => setActiveRow(null)}
						>
							<div className={S.rowHeader}>
								<p className={S.eventName}>{event.name}</p>
								<p className={S.eventMeta}>
									{event.date} &nbsp;|&nbsp; {event.type}
								</p>
								<p className={S.eventLocation}>{event.location}</p>
							</div>
							<div
								className={`${S.rowBody} ${
									activeRow === idx ? S.rowBodyActive : ""
								}`}
							>
								<p className={S.description}>{event.description}</p>
							</div>
						</Link>
					))}
				</div>

				<div className={S.stats} data-scroll-section>
					<div className={`${S.statItem} ${S.animateOpacity}`} data-scroll>
						<p className={S.statNumber}>5+</p>
						<p className={S.statLabel}>EVENTS RUN</p>
					</div>
					<div className={`${S.statItem} ${S.animateOpacity}`} data-scroll>
						<p className={S.statNumber}>200+</p>
						<p className={S.statLabel}>PARTICIPANTS</p>
					</div>
					<div className={`${S.statItem} ${S.animateOpacity}`} data-scroll>
						<p className={S.statNumber}>2</p>
						<p className={S.statLabel}>YEARS RUNNING</p>
					</div>
					<div className={`${S.statItem} ${S.animateOpacity}`} data-scroll>
						<p className={S.statNumber}>1</p>
						<p className={S.statLabel}>MISSION</p>
					</div>
				</div>


			</div>
		</>
	);
};

export default Archive;
