import gsap from "gsap";
import splitting from "splitting";
import S from "./TeamYear.module.scss";
import { useParams, Link } from "react-router-dom";
import { PageProps } from "../page.types";
import Nav from "../../components/Nav/Nav";
import Button from "../../components/Button/Button";
import LocomotiveScroll from "locomotive-scroll";
import IntroAnimation from "../../animations/intro";
import React, { useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { pastTeams, TeamMember } from "../../data/teamMembers";
import { FaGithub, FaLinkedinIn, FaInstagram, FaEnvelope, FaGlobe, FaXmark } from "react-icons/fa6";

const MemberCard: React.FC<{ member: TeamMember; onOpenProfile: (member: TeamMember) => void; index: number }> = ({ member, onOpenProfile, index }) => {
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

	return (
		<div ref={ref} className={S.memberCard} data-scroll>
			<div className={S.imageWrapper}>
				<img ref={imageRef} src={member.photo} alt={member.name} className={S.image} />
			</div>
			<div ref={textRef} className="hidden-init" style={{ opacity: 0, transform: "translateY(45px)" }}>
				<h3 className={S.memberName}>{member.name}</h3>
				<p className={S.memberRole}>{member.role}</p>
				{member.isPlaceholder ? (
					<p className={`${S.viewProfile} ${S.disabledLink}`}>View Profile</p>
				) : (
					<p className={S.viewProfile} onClick={() => onOpenProfile(member)}>
						View Profile
					</p>
				)}
			</div>
		</div>
	);
};

const TeamYear: React.FC<PageProps> = ({
	appLoaded,
	preloaded,
	navOnClick,
	windowWidth,
	setAppLoaded,
}) => {
	const { slug } = useParams<{ slug: string }>();
	const navRef = useRef(null);
	const scrollRef = useRef(null);
	const [scroll, setScroll] = useState<any>();
	const [activeMember, setActiveMember] = useState<TeamMember | null>(null);

	const overlayRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);

	// Find past team year matching the slug
	const teamYear = pastTeams.find((team) => team.slug === slug);

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
		if (preloaded && teamYear) {
			splitting({ by: "words", target: "#team-year-page .split-text" });
			const delay = appLoaded ? 2.5 : 0;
			const pageScope = gsap.utils.selector("#team-year-page");
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
	}, [preloaded, slug, teamYear]);

	// Modal animations and scroll lock
	const handleOpenProfile = (member: TeamMember) => {
		setActiveMember(member);
		if (scroll) {
			scroll.stop();
		}
		setTimeout(() => {
			if (overlayRef.current && panelRef.current) {
				gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" });
				gsap.fromTo(panelRef.current, 
					{ y: 50, opacity: 0 }, 
					{ y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
				);
			}
		}, 50);
	};

	const handleClose = () => {
		if (overlayRef.current && panelRef.current) {
			gsap.to(panelRef.current, {
				y: 50,
				opacity: 0,
				duration: 0.4,
				ease: "power2.in"
			});
			gsap.to(overlayRef.current, {
				opacity: 0,
				duration: 0.4,
				ease: "power2.in",
				onComplete: () => {
					setActiveMember(null);
					if (scroll) {
						scroll.start();
					}
				}
			});
		} else {
			setActiveMember(null);
			if (scroll) {
				scroll.start();
			}
		}
	};

	// Close on Escape key
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && activeMember) {
				handleClose();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [activeMember]);

	if (!teamYear) {
		return (
			<>
				<Nav ref={navRef} onClick={navOnClick} />
				<div style={{ background: "#121212", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
					<h1 style={{ font: "600 5vh 'New York Extra Large', serif", marginBottom: "2rem" }}>TENURE YEAR NOT FOUND</h1>
					<Link to="/team/archive">
						<Button use="credits" text="back to archive" />
					</Link>
				</div>
			</>
		);
	}

	return (
		<>
			<Nav ref={navRef} onClick={navOnClick} />
			<div id="team-year-page" ref={scrollRef} className={S.section} data-scroll-container>
				
				{/* Section 1: Hero */}
				<div className={S.hero} data-scroll-section>
					<h1
						data-splitting=""
						className={`${S.headline} split-text hidden-init`}
						data-scroll
						data-scroll-speed="1"
					>
						{teamYear.tenure}
					</h1>
					<p className={`${S.subtitle} ${S.animateOpacity}`} data-scroll data-scroll-speed="0.5">
						E-Cell BVUDET Core Team
					</p>
					<div className={`${S.scrollIndicator} ${S.animateOpacity}`}>
						<span>scroll to view team</span>
						<div className={S.scrollLine} />
					</div>
				</div>

				{/* Section 2: Team Grid */}
				<div className={S.coreSection} data-scroll-section>
					{teamYear.members && teamYear.members.length > 0 ? (
						<div className={S.teamGrid}>
							{teamYear.members.map((member, index) => (
								<MemberCard 
									key={member.id} 
									member={member} 
									onOpenProfile={handleOpenProfile} 
									index={index} 
								/>
							))}
						</div>
					) : (
						<div className={`${S.fallbackMessage} ${S.animateOpacity}`} data-scroll>
							Team data for this tenure is being updated.
						</div>
					)}

					{/* Section 3: Back Nav */}
					<Link to="/team/archive" className={S.backNav} data-scroll>
						← BACK TO ARCHIVE
					</Link>
				</div>

			</div>

			{/* Member Detail Modal */}
			{activeMember && (
				<div 
					ref={overlayRef} 
					className={`${S.modalOverlay} ${activeMember ? S.isOpen : ""}`}
					onClick={(e) => e.target === overlayRef.current && handleClose()}
				>
					<div ref={panelRef} className={S.modalPanel}>
						<button className={S.modalClose} onClick={handleClose} aria-label="Close Profile">
							<FaXmark />
						</button>

						{/* Top Block */}
						<div className={S.modalIdentity}>
							<div className={S.modalAvatarWrapper}>
								<img src={activeMember.photo} alt={activeMember.name} className={S.modalAvatar} />
							</div>
							<h3 className={S.modalName}>{activeMember.name}</h3>
							<p className={S.modalRole}>{activeMember.role}</p>
						</div>

						{/* Bottom Block: Links */}
						{(activeMember.linkedin || activeMember.instagram || activeMember.github || activeMember.email || activeMember.website) && (
							<div className={S.modalSection}>
								<span className={S.modalLabel}>CONNECT</span>
								<div className={S.modalLinks}>
									{activeMember.linkedin && (
										<a href={activeMember.linkedin} target="_blank" rel="noopener noreferrer" className={S.modalLink}>
											<FaLinkedinIn /> LinkedIn
										</a>
									)}
									{activeMember.instagram && (
										<a href={activeMember.instagram} target="_blank" rel="noopener noreferrer" className={S.modalLink}>
											<FaInstagram /> Instagram
										</a>
									)}
									{activeMember.github && (
										<a href={activeMember.github} target="_blank" rel="noopener noreferrer" className={S.modalLink}>
											<FaGithub /> GitHub
										</a>
									)}
									{activeMember.email && (
										<a href={`mailto:${activeMember.email}`} className={S.modalLink}>
											<FaEnvelope /> Email
										</a>
									)}
									{activeMember.website && (
										<a href={activeMember.website} target="_blank" rel="noopener noreferrer" className={S.modalLink}>
											<FaGlobe /> Website
										</a>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default TeamYear;
