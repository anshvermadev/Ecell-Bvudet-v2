import gsap from "gsap";
import splitting from "splitting";
import S from "./Contact.module.scss";
import { Link } from "react-router-dom";
import { PageProps } from "../page.types";
import Nav from "../../components/Nav/Nav";
import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/Button/Button";
import { FaTwitter, FaLinkedinIn, FaInstagram, FaWhatsapp, FaEnvelope, FaArrowRight } from "react-icons/fa";

const Contact: React.FC<PageProps> = ({
	appLoaded,
	preloaded,
	navOnClick,
	windowWidth,
	setAppLoaded,
}) => {
	const navRef = useRef(null);
	const [activeHover, setActiveHover] = useState<number | null>(null);

	useEffect(() => {
		if (preloaded) {
			setAppLoaded(true);
		}
	}, [preloaded]);

	useEffect(() => {
		if (preloaded) {
			splitting({ by: "words", target: "#contact-section .split-text" });
			const delay = appLoaded ? 3 : 0;
			const contactScope = gsap.utils.selector("#contact-section");
			gsap.set(contactScope(".hidden-init"), { visibility: "visible" });
			
			gsap.from(contactScope(".split-text .word, .whitespace"), {
				delay: 0.25 + delay,
				duration: 0.75,
				opacity: 0,
				yPercent: 100,
				stagger: 0.02,
				ease: "power3.out",
			});

			gsap.to(contactScope(`.${S.column}, .${S.footer}`), {
				delay: 0.6 + delay,
				duration: 1.2,
				opacity: 1,
				y: 0,
				stagger: 0.15,
				ease: "power4.out",
			});
		}
	}, [preloaded]);

	useEffect(() => {
		const html = document.querySelector("html");
		if (html) html.setAttribute("data-page", "credits");
		return () => html?.removeAttribute("data-page");
	}, []);

	return (
		<>
			<Nav ref={navRef} onClick={navOnClick} />
			<section id="contact-section" className={S.section}>
				<div className={S.wrapper}>
					
					{/* COLUMN 1: WhatsApp Community */}
					<a 
						href="https://chat.whatsapp.com/F0o5KqG8bM1B3Lq9GzHw4v"
						target="_blank" 
						rel="noopener noreferrer"
						className={`${S.column} ${S.whatsappCol} hidden-init`}
						onMouseEnter={() => setActiveHover(1)}
						onMouseLeave={() => setActiveHover(null)}
					>
						{/* Vertical Watermark Background Text */}
						<div className={S.watermarkText}>CHAT</div>
						
						{/* Glow Overlay */}
						<div className={S.columnGlow} />

						<div className={S.colHeader}>
							<span className={S.number}>01</span>
							<span className={S.category}>Community</span>
						</div>

						<div className={S.colBody}>
							<h2 className={`${S.title} split-text`}>WhatsApp</h2>
							<div className={S.details}>
								<p>Join the official E-Cell Community for Announcements, Startup Discussions, and Event Updates.</p>
								<div className={S.actionLink}>
									<span>JOIN THE COMMUNITY</span>
									<FaWhatsapp className={S.whatsappIcon} />
									<FaArrowRight className={S.arrowIcon} />
								</div>
							</div>
						</div>
					</a>

					{/* COLUMN 2: Email */}
					<a 
						href="mailto:ecell.detnm@bvucoep.edu.in"
						className={`${S.column} ${S.emailCol} hidden-init`}
						onMouseEnter={() => setActiveHover(2)}
						onMouseLeave={() => setActiveHover(null)}
					>
						{/* Vertical Watermark Background Text */}
						<div className={S.watermarkText}>MAIL</div>
						
						{/* Glow Overlay */}
						<div className={S.columnGlow} />

						<div className={S.colHeader}>
							<span className={S.number}>02</span>
							<span className={S.category}>Inquiries</span>
						</div>

						<div className={S.colBody}>
							<h2 className={`${S.title} split-text`}>Email</h2>
							<div className={S.details}>
								<p>For Sponsorships, Partnerships, Speaker Proposals, and general official communication.</p>
								<span className={S.emailText}>ecell.detnm@bvucoep.edu.in</span>
								<div className={S.actionLink}>
									<span>SEND AN EMAIL</span>
									<FaEnvelope className={S.emailIcon} />
									<FaArrowRight className={S.arrowIcon} />
								</div>
							</div>
						</div>
					</a>

					{/* COLUMN 3: Socials */}
					<div 
						className={`${S.column} ${S.socialCol} hidden-init`}
						onMouseEnter={() => setActiveHover(3)}
						onMouseLeave={() => setActiveHover(null)}
					>
						{/* Vertical Watermark Background Text */}
						<div className={S.watermarkText}>CONNECT</div>
						
						{/* Glow Overlay */}
						<div className={S.columnGlow} />

						<div className={S.colHeader}>
							<span className={S.number}>03</span>
							<span className={S.category}>Social Hubs</span>
						</div>

						<div className={S.colBody}>
							<h2 className={`${S.title} split-text`}>Socials</h2>
							<div className={S.details}>
								<p>Follow our digital channels to stay updated with E-Cell's events and stories.</p>
								<div className={S.socialList}>
									<a href="https://instagram.com/ecell_bvudet" target="_blank" rel="noopener noreferrer" className={S.socialLink}>
										<FaInstagram /> <span>Instagram</span>
									</a>
									<a href="https://www.linkedin.com/company/e-cell-bvudet/" target="_blank" rel="noopener noreferrer" className={S.socialLink}>
										<FaLinkedinIn /> <span>LinkedIn</span>
									</a>
									<a href="https://twitter.com/ecell_bvudet" target="_blank" rel="noopener noreferrer" className={S.socialLink}>
										<FaTwitter /> <span>X (Twitter)</span>
									</a>
								</div>
							</div>
						</div>
					</div>

				</div>

				{/* Running Footer Overlay */}
				<footer className={`${S.footer} hidden-init`}>
					<div className={S.footerItem}>BVUDET</div>
					<div className={S.footerDivider} />
					<div className={S.footerItem}>ESTABLISHED 2023</div>
					<div className={S.footerDivider} />
					<div className={S.footerItem}>NAVI MUMBAI</div>
				</footer>
			</section>
		</>
	);
};

export default Contact;
