import gsap from "gsap";
import splitting from "splitting";
import S from "./Team.module.scss";
import { PageProps } from "../page.types";
import Nav from "../../components/Nav/Nav";
import { Link } from "react-router-dom";
import LocomotiveScroll from "locomotive-scroll";
import Button from "../../components/Button/Button";
import IntroAnimation from "../../animations/intro";
import React, { useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { currentTeam, TeamMember } from "../../data/teamMembers";
import { FaGithub, FaLinkedinIn, FaInstagram, FaEnvelope, FaGlobe, FaXmark, FaArrowRight } from "react-icons/fa6";

const FacultyCard: React.FC<{ name: string; role: string; dept: string; image: string; index: number }> = ({ name, role, dept, image, index }) => {
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
		<div ref={ref} className={S.facultyCard} data-scroll>
			<div className={S.imageWrapper}>
				<img ref={imageRef} src={image} alt={name} className={S.image} />
			</div>
			<div ref={textRef} className="hidden-init" style={{ opacity: 0, transform: "translateY(45px)" }}>
				<h3 className={S.facultyName}>{name}</h3>
				<p className={S.facultyRole}>{role}</p>
				<hr className={S.divider} />
				<p className={S.facultyDept}>{dept}</p>
			</div>
		</div>
	);
};

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

const Team: React.FC<PageProps> = ({
	appLoaded,
	preloaded,
	navOnClick,
	windowWidth,
	setAppLoaded,
}) => {
	const navRef = useRef(null);
	const scrollRef = useRef(null);
	const [scroll, setScroll] = useState<any>();
	const [activeMember, setActiveMember] = useState<TeamMember | null>(null);

	const overlayRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);

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
			splitting({ by: "words", target: "#team-page .split-text" });
			const delay = appLoaded ? 2.5 : 0;
			const pageScope = gsap.utils.selector("#team-page");
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

	return (
		<>
			<Nav ref={navRef} onClick={navOnClick} />
			<div id="team-page" ref={scrollRef} className={S.section} data-scroll-container>
				
				{/* Section 1: Hero */}
				<div className={S.hero} data-scroll-section>
					<h1
						data-splitting=""
						className={`${S.headline} split-text hidden-init`}
						data-scroll
						data-scroll-speed="1"
					>
						THE PEOPLE BEHIND IT
					</h1>
					<p className={`${S.subtitle} ${S.animateOpacity}`} data-scroll data-scroll-speed="0.5">
						Faculty · Core Team · Alumni
					</p>
					<div className={`${S.scrollExplore} ${S.animateOpacity}`} data-scroll data-scroll-speed="-0.2">
						<span className={S.scrollText}>SCROLL TO EXPLORE</span>
						<FaArrowRight className={S.scrollArrow} />
					</div>
				</div>

				{/* Section 2: Faculty Coordinators */}
				<div className={S.facultySection} data-scroll-section>
					<h2 className={`${S.sectionTitle} ${S.animateOpacity}`} data-scroll>
						FACULTY COORDINATORS
					</h2>
					<div className={S.facultyGrid}>
						<FacultyCard 
							name="Dr. Divya Rohatgi"
							role="Convenor, E-Cell BVUDET"
							dept="Head of Department - Information Technology, BVUDET"
							image="https://res.cloudinary.com/dobmi3ojr/image/upload/v1782035465/Divya_mam_qorwbf.png"
							index={0}
						/>
						<FacultyCard 
							name="Prof. Deepika Sharma"
							role="Co-Convenor, E-Cell BVUDET"
							dept="Department of Computer Science Engineering, BVUDET"
							image="https://res.cloudinary.com/dobmi3ojr/image/upload/v1782035461/Deepika_mam_rfsjpl.png"
							index={1}
						/>
					</div>
				</div>

				{/* Section 3: Current Core Team */}
				<div className={S.coreSection} data-scroll-section>
					<h2 className={`${S.sectionTitle} ${S.animateOpacity}`} data-scroll>
						CORE TEAM - 2026·27
					</h2>
					<p className={`${S.sectionSubtitle} ${S.animateOpacity}`} data-scroll>
						President · Vice President · Heads · Executives
					</p>
					<div className={S.teamGrid}>
						{currentTeam.map((member, index) => (
							<MemberCard 
								key={member.id} 
								member={member} 
								onOpenProfile={handleOpenProfile} 
								index={index} 
							/>
						))}
					</div>
				</div>

				{/* Section 4: Past Teams CTA Band */}
				<div className={S.ctaBand} data-scroll-section>
					<div className={S.animateOpacity} data-scroll>
						<h2 className={S.ctaTitle}>EVERY TENURE. EVERY TEAM.</h2>
						<p className={S.ctaSubtext}>Explore the teams that built E-Cell BVUDET.</p>
						<Link to="/team/archive" className={S.ctaButton}>
							<Button use="credits" text="VIEW PAST TEAMS" />
						</Link>
					</div>
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

						{/* Middle Block: Bio */}
						<div className={S.modalSection}>
							<span className={S.modalLabel}>ABOUT</span>
							<p className={S.modalBody}>
								{activeMember.bio ? activeMember.bio : <span className={S.mutedText}>Bio coming soon.</span>}
							</p>
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

export default Team;
