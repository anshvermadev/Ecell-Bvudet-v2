import gsap from "gsap";
import splitting from "splitting";
import S from "./Credits.module.scss";
import { PageProps } from "../page.types";
import { FaInstagram, FaEnvelope, FaXTwitter, FaFacebookF, FaLinkedinIn, FaPhone, FaGithub, FaGlobe } from "react-icons/fa6";
import Nav from "../../components/Nav/Nav";
import LocomotiveScroll from "locomotive-scroll";
import IntroAnimation from "../../animations/intro";
import React, { useEffect, useRef, useState } from "react";

const Credits: React.FC<PageProps> = ({
	appLoaded,
	preloaded,
	navOnClick,
	windowWidth,
	setAppLoaded,
}) => {
	const navRef = useRef(null);
	const scrollRef = useRef(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const [scroll, setScroll] = useState<any>();
	
	const developers = [
		{
			id: "ansh-verma",
			name: "Ansh Verma",
			role: "LEAD DEVELOPER",
			bio: "Lead Developer who managed the entire website creation and deployment process. Handled technical SEO, image optimization, and implemented advanced animations using GSAP and ScrollTrigger.",
			github: "https://github.com/anshvermadev",
			linkedin: "https://www.linkedin.com/in/ansh-verma-37504b2b7",
			instagram: "https://www.instagram.com/verma_07ansh",
			email: "verma.07ansh@gmail.com",
			website: "https://ansh-verma.xyz"
		},
		{
			id: "siddharth-singh",
			name: "Siddharth Singh",
			role: "DEVELOPER",
			bio: "Contributed to building the website frontend and creating a smooth user experience.",
			github: "https://github.com/SiddharthSingh06",
			linkedin: "https://www.linkedin.com/in/siddharth-singh-9aaa1b30b",
			instagram: "https://www.instagram.com/siddharthsingh2926",
			email: "sidddharthsingh707@gmail.com"
		},
		{
			id: "shivam-kumar",
			name: "Shivam Kumar",
			role: "DEVELOPER",
			bio: "Helped develop the website's user interface and integrated various interactive components.",
			github: "https://github.com/skroy3300-art",
			linkedin: "https://www.linkedin.com/in/shivam-kumar-467794290",
			instagram: "https://www.instagram.com/_shivamkr.28",
			email: "skroy.3300@gmail.com"
		},
		{
			id: "deepanshu-ghosalkar",
			name: "Deepanshu Jayesh Ghosalkar",
			role: "DEVELOPER",
			bio: "Worked on the frontend development of the E-Cell website and ensured optimal performance.",
			github: "https://github.com/SPY-DEEP-06",
			linkedin: "https://www.linkedin.com/in/deepanshu-ghosalkar-deep",
			instagram: "https://www.instagram.com/deep_ghosalkar_",
			email: "ghosalkardeepanshu@gmail.com"
		},
		{
			id: "srushti-kalbhor",
			name: "Srushti Kalbhor",
			role: "DEVELOPER",
			bio: "Assisted in building the website layouts and polishing the overall design.",
			github: "https://github.com/Srushtihkalbhor-2007",
			linkedin: "https://www.linkedin.com/in/srushti-kalbhor-44b865332",
			instagram: "https://www.instagram.com/_srusht.iiik_",
			email: "Srushtikalbhor1307@gmail.com"
		},
		{
			id: "piyush-jaiswal",
			name: "Piyush Jaiswal",
			role: "DEVELOPER",
			bio: "Contributed to the website's development and managed the deployment process.",
			github: "https://github.com/PiyushBillE",
			linkedin: "https://www.linkedin.com/in/piyush-jaiswal-7a5850272",
			instagram: "https://www.instagram.com/probablyalunatic",
			email: "piyushjaiswal0101@gmail.com"
		},
		{
			id: "harshal-sukhdare",
			name: "Harshal Sukhdare",
			role: "DEVELOPER",
			bio: "Helped design and build the frontend sections of the E-Cell website.",
			github: "https://github.com/Harshalss28",
			linkedin: "https://www.linkedin.com/in/harshal-sukhdare-06460434a",
			instagram: "https://www.instagram.com/harshal_sukhdare_28",
			email: "harshalsukhdare28@gmail.com"
		}
	];

	const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

	const handleAccordionClick = (id: string) => {
		setActiveAccordion(prev => prev === id ? null : id);
	};

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
			splitting({ by: "words", target: "#credits-page .split-text" });
			const delay = appLoaded ? 2.5 : 0;
			const pageScope = gsap.utils.selector("#credits-page");
			gsap.set(pageScope(".hidden-init"), { visibility: "visible" });
			
			// Text reveal stagger
			gsap.from(pageScope(".split-text .word, .whitespace"), {
				delay: 0.25 + delay,
				duration: 1.5,
				opacity: 0,
				yPercent: 100,
				stagger: 0.05,
				ease: "power3.out",
			});
			
			// Element fade in reveals
			gsap.to(pageScope(`.${S.animateOpacity}`), {
				delay: 1 + delay,
				duration: 1.25,
				opacity: 1,
				stagger: 0.05,
				ease: "power2.out",
			});

			// Image reveal with clip-path matching existing image fingerprint
			if (imageRef.current) {
				gsap.to(imageRef.current, {
					delay: 0.8 + delay,
					scale: 1,
					duration: 2.5,
					ease: "power3.out",
					clipPath: "inset(0% 0% 0% 0%)",
				});
			}
		}
	}, [preloaded]);

	return (
		<>
			<Nav ref={navRef} onClick={navOnClick} />
			<div id="credits-page" ref={scrollRef} className={S.section} data-scroll-container>
				
				{/* 1. HERO SECTION */}
				<div className={S.hero} data-scroll-section>
					<h1
						data-splitting=""
						className={`${S.headline} split-text hidden-init`}
						data-scroll
						data-scroll-speed="1"
					>
						BUILT BY HUMANS
					</h1>
					<p className={`${S.subtitle} ${S.animateOpacity}`} data-scroll data-scroll-speed="0.5">
						The minds and machinery behind E-Cell BVUDET
					</p>
				</div>

				{/* 2. DEVELOPER PROFILE SECTION */}
				<div className={S.devSection} data-scroll-section>
					<div className={`${S.devAccordionList} ${S.animateOpacity}`} data-scroll>
						{developers.map((member, index) => (
							<AccordionItem
								key={member.id}
								member={member}
								isActive={activeAccordion === member.id}
								isFirst={index === 0}
								onClick={() => handleAccordionClick(member.id)}
							/>
						))}
					</div>
				</div>

				{/* 3. CREATION STORY SECTION */}
				<div className={S.storySection} data-scroll-section>
					<div className={S.storyHeader}>
						<span className={`${S.storySubtitle} ${S.animateOpacity}`} data-scroll>THE JOURNAL</span>
						<h2 className={`${S.storyTitle} split-text hidden-init`} data-scroll>CREATION STORY</h2>
					</div>
					<div className={S.storyGrid}>
						<div className={`${S.storyCard} ${S.animateOpacity}`} data-scroll data-scroll-speed="0.2">
							<span className={S.cardNum}>01</span>
							<h3 className={S.cardTitle}>THE MACHINERY</h3>
							<p className={S.cardBody}>
								Engineered with React, TypeScript, and Vite. The website leverages modern build tools for lightning-fast speeds, component modularity, and SCSS module architecture to ensure visual encapsulation and performance integrity.
							</p>
						</div>

						<div className={`${S.storyCard} ${S.animateOpacity}`} data-scroll data-scroll-speed="0.4">
							<span className={S.cardNum}>02</span>
							<h3 className={S.cardTitle}>THE AESTHETIC</h3>
							<p className={S.cardBody}>
								The York and Dante theme was chosen to project sophistication, authority, and innovation. With its editorial typography, deep charcoal tones, and editorial grid structures, it mirrors the premium and professional nature of E-Cell BVUDET.
							</p>
						</div>

						<div className={`${S.storyCard} ${S.animateOpacity}`} data-scroll data-scroll-speed="0.6">
							<span className={S.cardNum}>03</span>
							<h3 className={S.cardTitle}>THE MOTION DNA</h3>
							<p className={S.cardBody}>
								Powered by GSAP, ScrollTrigger, and Locomotive Scroll. By synchronizing virtual scrolling with high-performance CSS transforms, we achieved lag-free smooth parallax scrolling, text-split stagger reveals, and elegant mask animations.
							</p>
						</div>
					</div>
				</div>

				{/* 5. STATEMENT / SIGN-OFF */}
				<div className={S.statement} data-scroll-section>
					<div className={`${S.quote} ${S.animateOpacity}`} data-scroll data-scroll-speed="1">
						{"Good design is invisible.\nGood execution leaves a mark."}
					</div>
					<p className={`${S.attribution} ${S.animateOpacity}`}>
						- E-Cell BVUDET Technical Team
					</p>
				</div>

				<div className={S.signoff} data-scroll-section>
					<div className={S.animateOpacity} data-scroll>
						<div className={S.footerSocials}>
							<a
								href="https://instagram.com/ecell_bvudet"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
							>
								<FaInstagram />
							</a>
							<a
								href="mailto:ecell.detnm@bvucoep.edu.in"
								aria-label="Email"
							>
								<FaEnvelope />
							</a>
							<a
								href="https://x.com/ecell_bvudet"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="X"
							>
								<FaXTwitter />
							</a>
							<a
								href="https://facebook.com/ecell_bvudet"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Facebook"
							>
								<FaFacebookF />
							</a>
							<a
								href="https://www.linkedin.com/company/e-cell-bvudet/"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="LinkedIn"
							>
								<FaLinkedinIn />
							</a>
							<a
								href="tel:+919876543210"
								aria-label="Phone"
							>
								<FaPhone />
							</a>
						</div>
						<p className={S.footerCopyright}>© E-Cell BVUDET · Est. 2023 · BVUDET, Navi Mumbai</p>
						<a href="mailto:ecell.detnm@bvucoep.edu.in" className={S.footerEmail}>ecell.detnm@bvucoep.edu.in</a>
					</div>
				</div>
			</div>
		</>
	);
};

const AccordionItem = ({ member, isActive, isFirst, onClick }: any) => {
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (contentRef.current) {
			if (isActive) {
				gsap.to(contentRef.current, { height: "auto", opacity: 1, duration: 0.5, ease: "power3.out" });
			} else {
				gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.5, ease: "power3.out" });
			}
		}
	}, [isActive]);

	return (
		<div className={`${S.accordionContainer} ${isFirst ? S.accordionFirst : ''}`} onClick={onClick}>
			<div className={S.accordionHeader}>
				<h1 className={S.accordionTitle}>{member.name}</h1>
				<h3 className={S.accordionRole}>{member.role}</h3>
				<div className={S.accordionAction}>
					<div className={S.hoverTextWrap}>
						<div className={S.hoverBg} />
						<span className={S.hoverTextContent}>{isActive ? 'CLOSE' : 'READ'}</span>
					</div>
				</div>
			</div>
			<div className={S.accordionContent} ref={contentRef} style={{ height: 0, opacity: 0, overflow: 'hidden' }}>
				<div className={S.accordionInner}>
					<div className={S.accordionBio}>
						<p>{member.bio || "Crafting digital experiences with precision and passion. Focusing on modern architectures and seamless execution to push the boundaries of the web."}</p>
						<div className={S.socialsList} style={{ marginTop: '2vh', justifyContent: 'flex-start' }}>
							{member.github && (
								<a href={member.github} target="_blank" rel="noopener noreferrer" className={S.socialLink} aria-label="GitHub Profile">
									<FaGithub className={S.icon} />
								</a>
							)}
							{member.linkedin && (
								<a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={S.socialLink} aria-label="LinkedIn Profile">
									<FaLinkedinIn className={S.icon} />
								</a>
							)}
							{member.instagram && (
								<a href={member.instagram} target="_blank" rel="noopener noreferrer" className={S.socialLink} aria-label="Instagram Profile">
									<FaInstagram className={S.icon} />
								</a>
							)}
							{member.email && (
								<a href={`mailto:${member.email}`} className={S.socialLink} aria-label="Email">
									<FaEnvelope className={S.icon} />
								</a>
							)}
							{member.website && (
								<a href={member.website} target="_blank" rel="noopener noreferrer" className={S.socialLink} aria-label="Personal Portfolio">
									<FaGlobe className={S.icon} />
								</a>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Credits;
