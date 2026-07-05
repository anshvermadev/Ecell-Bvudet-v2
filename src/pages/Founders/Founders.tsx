import gsap from "gsap";
import splitting from "splitting";
import S from "./Founders.module.scss";
import { Link } from "react-router-dom";
import { PageProps } from "../page.types";
import Nav from "../../components/Nav/Nav";
import LocomotiveScroll from "locomotive-scroll";
import Button from "../../components/Button/Button";
import IntroAnimation from "../../animations/intro";
import React, { useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

interface Founder {
	name: string;
	role: string;
	company: string;
	classOf: string;
	description: string;
	image: string;
}

const foundersData: Founder[] = [
	{
		name: "Adityaa Negi",
		role: "Co-Founder & Fullstack Dev",
		company: "Terabit Support",
		classOf: "",
		description: "Turned a career-ending hand injury into a new beginning - channeling athletic discipline into full-stack development and co-founding a company building transformative digital solutions.",
		image: "https://i.ibb.co/fY3LQJzC/workshop-1.png"
	},
	{
		name: "Fahim Khan",
		role: "Owner",
		company: "FK Jersey House",
		classOf: "",
		description: "Built his own jersey brand from scratch, reaching ₹1.2 lakh in revenue within two years through a lean, low-cost selling model that streamlined operations while keeping profit margins intact.",
		image: "https://i.ibb.co/wFqsdPCt/workshop-2.png"
	},
	{
		name: "Ravikishan Singh",
		role: "Creator",
		company: "Beatsonmusic",
		classOf: "",
		description: "The faceless creator behind a 1M+ subscriber YouTube channel, started during lockdown with just a phone, crafting Bollywood edits known for emotion, nostalgia, and cinematic storytelling.",
		image: "https://i.ibb.co/rfk7FSd6/7.png"
	},
	{
		name: "Prajakta Bangale",
		role: "Freelancer",
		company: "",
		classOf: "",
		description: "Passionate freelance graphic designer, video editor, and content creator who helps brands tell their stories in unique and engaging ways through impactful content that connects with audiences.",
		image: "https://i.ibb.co/LDwQtHqt/workshop.png"
	},
	{
		name: "Omkar Padekar",
		role: "Founder",
		company: "BuildMyBrand",
		classOf: "",
		description: "Helps creators, freelancers, and founders cut through the noise with bold positioning, viral storytelling, and psychology-driven personal branding strategies that turn invisibility into influence.",
		image: "https://i.ibb.co/60Z8SDky/5.png"
	},
	{
		name: "Shubham Gaikwad",
		role: "Founder",
		company: "CampHustle",
		classOf: "",
		description: "Runs a student-powered creative agency delivering reels, photoshoots, and social media strategy for brands - with clients including RedBull, McCaffeine, Britannia, and Under25.",
		image: "https://i.ibb.co/JXgpbG9/6.png"
	}
];

const FounderCard: React.FC<{ founder: Founder; index: number }> = ({ founder, index }) => {
	const ref = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const textRef = useRef<HTMLDivElement>(null);
	const isOnScreen = useIntersectionObserver(ref, 0.15);

	useEffect(() => {
		if (isOnScreen) {
			if (imageRef.current) {
				gsap.to(imageRef.current, {
					scale: 1,
					duration: 2.5,
					ease: "power3.out",
					clipPath: "inset(0% 0% 0% 0%)",
				});
			}
			if (textRef.current) {
				gsap.to(textRef.current, {
					opacity: 1,
					y: 0,
					duration: 1.5,
					ease: "power2.out",
					delay: 0.2
				});
			}
		}
	}, [isOnScreen]);

	const isEven = index % 2 === 0;

	return (
		<div
			ref={ref}
			className={`${S.card} ${isEven ? S.even : S.odd}`}
			data-scroll
		>
			<div className={S.imageWrapper}>
				<div className={S.imageContainer}>
					<img
						ref={imageRef}
						src={founder.image}
						alt={founder.name}
						className={S.image}
					/>
				</div>
			</div>
			<div ref={textRef} className={`${S.textWrapper} hidden-init`} style={{ opacity: 0, transform: "translateY(50px)" }}>
				<span className={S.classTag}>{founder.classOf}</span>
				<h3 className={S.founderName}>{founder.name}</h3>
				<p className={S.companyTag}>{founder.role} · {founder.company}</p>
				<p className={S.description}>{founder.description}</p>
			</div>
		</div>
	);
};

const Founders: React.FC<PageProps> = ({
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
			splitting({ by: "words", target: "#founders-page .split-text" });
			const delay = appLoaded ? 2.5 : 0;
			const pageScope = gsap.utils.selector("#founders-page");
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
			<div id="founders-page" ref={scrollRef} className={S.section} data-scroll-container>
				<div className={S.hero} data-scroll-section>
					<h1
						data-splitting=""
						className={`${S.headline} split-text hidden-init`}
						data-scroll
						data-scroll-speed="1"
					>
						THEY STARTED HERE
					</h1>
					<p className={`${S.subtitle} ${S.animateOpacity}`} data-scroll data-scroll-speed="0.5">
						Featured student &amp; alumni founders of E-Cell BVUDET
					</p>
				</div>

				<div className={S.grid} data-scroll-section>
					{foundersData.map((founder, index) => (
						<FounderCard key={index} founder={founder} index={index} />
					))}
				</div>

				<div className={S.quoteSection} data-scroll-section>
					<div className={`${S.quote} ${S.animateOpacity}`} data-scroll data-scroll-speed="1">
						{"The best time to start was yesterday.\nThe second best time is now."}
					</div>
					<p className={`${S.attribution} ${S.animateOpacity}`}>
						- E-Cell BVUDET
					</p>
				</div>

				<div className={S.nomination} data-scroll-section>
				<div className={`${S.nominationCard} ${S.animateOpacity}`} data-scroll>
					<div className={S.nominationGlow} />
					<div className={S.nominationBorderGradient} />
					<div className={S.nominationContent}>
						<div className={S.nominationIcon}>
							<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="32" cy="32" r="30" stroke="url(#iconGrad)" strokeWidth="2" opacity="0.3" />
								<path d="M20 28L32 20L44 28V40C44 41.1 43.1 42 42 42H22C20.9 42 20 41.1 20 40V28Z" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
								<polyline points="44,28 32,36 20,28" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
								<circle cx="32" cy="14" r="3" fill="url(#iconGrad)" opacity="0.6"/>
								<path d="M28 14L32 10L36 14" stroke="url(#iconGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
								<defs>
									<linearGradient id="iconGrad" x1="16" y1="10" x2="48" y2="50">
										<stop offset="0%" stopColor="#ff4040" />
										<stop offset="100%" stopColor="#ff8c40" />
									</linearGradient>
								</defs>
							</svg>
						</div>
						<span className={S.nominationBadge}>GET FEATURED</span>
						<h3 className={S.nominationTitle}>NOMINATE A FOUNDER</h3>
						<p className={S.nominationText}>
							Know a founder who started their journey at BVUDET? Or are you running a startup yourself? 
							We'd love to hear your story and showcase it to the world.
						</p>
						<a href="mailto:ecell.detnm@bvucoep.edu.in" className={S.nominationCta}>
							<span className={S.nominationCtaText}>ecell.detnm@bvucoep.edu.in</span>
							<span className={S.nominationCtaArrow}>→</span>
						</a>
					</div>
				</div>
			</div>

				<div className={S.cta} data-scroll-section>
					<div className={S.animateOpacity} data-scroll>
						<h2 className={S.ctaTitle}>YOUR STORY STARTS AT E-CELL</h2>
						<Link to="/join" className={S.ctaButton}>
							<Button use="credits" text="JOIN US NOW" />
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default Founders;
