import gsap from "gsap";
import splitting from "splitting";
import S from "./TeamArchive.module.scss";
import { Link } from "react-router-dom";
import { PageProps } from "../page.types";
import Nav from "../../components/Nav/Nav";
import LocomotiveScroll from "locomotive-scroll";
import IntroAnimation from "../../animations/intro";
import React, { useEffect, useRef, useState } from "react";
import { pastTeams, currentTeam } from "../../data/teamMembers";

const TeamArchive: React.FC<PageProps> = ({
	appLoaded,
	preloaded,
	navOnClick,
	windowWidth,
	setAppLoaded,
}) => {
	const navRef = useRef(null);
	const scrollRef = useRef(null);
	const [scroll, setScroll] = useState<any>();

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
			splitting({ by: "words", target: "#team-archive-page .split-text" });
			const delay = appLoaded ? 2.5 : 0;
			const pageScope = gsap.utils.selector("#team-archive-page");
			gsap.set(pageScope(".hidden-init"), { visibility: "visible" });
			gsap.from(pageScope(".split-text .word, .whitespace"), {
				delay: 0.25 + delay,
				duration: 1.5,
				opacity: 0,
				yPercent: 100,
				stagger: 0.05,
				ease: "power3.out",
			});
			gsap.to(pageScope(`.${S.animateOpacity}`), {
				delay: 1 + delay,
				duration: 1.25,
				opacity: 1,
				stagger: 0.05,
				ease: "power2.out",
			});
		}
	}, [preloaded]);

	// Prepare row data
	const rows = [
		{
			tenure: "2026–27",
			slug: "2026-27",
			label: "CURRENT TEAM",
			count: `${currentTeam.length} members`,
			isCurrent: true,
			to: "/team"
		},
		...pastTeams.map(team => ({
			tenure: team.tenure,
			slug: team.slug,
			label: "CORE TEAM",
			count: team.members.length > 0 ? `${team.members.length} members` : "TBA",
			isCurrent: false,
			to: `/team/archive/${team.slug}`
		}))
	];

	return (
		<>
			<Nav ref={navRef} onClick={navOnClick} />
			<div id="team-archive-page" ref={scrollRef} className={S.section} data-scroll-container>
				
				{/* Section 1: Hero */}
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
						Every team. Every tenure. Every name.
					</p>
				</div>

				{/* Section 2: Year List */}
				<div className={S.list} data-scroll-section>
					{rows.map((row, idx) => (
						<Link
							key={row.slug}
							to={row.to}
							className={`${S.row} ${row.isCurrent ? S.currentHighlight : ""} ${S.animateOpacity}`}
							data-scroll
						>
							<div className={S.rowHeader}>
								<p className={S.tenureYear}>{row.tenure}</p>
								<p className={S.label}>{row.label}</p>
								<p className={S.memberCount}>{row.count}</p>
							</div>
						</Link>
					))}
				</div>

			</div>
		</>
	);
};

export default TeamArchive;
