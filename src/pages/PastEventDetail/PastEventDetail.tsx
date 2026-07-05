import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import splitting from "splitting";
import S from "./PastEventDetail.module.scss";
import { useParams, Link } from "react-router-dom";
import { PageProps } from "../page.types";
import Nav from "../../components/Nav/Nav";
import { pastEvents } from "../../data/pastEvents";
import LocomotiveScroll from "locomotive-scroll";
import Button from "../../components/Button/Button";
import IntroAnimation from "../../animations/intro";
import React, { useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { getOptimizedUrl } from "../../utils/cloudinaryUrl";

// TODO: Guests & Speaker lists contain placeholder data marked TBA. Update as official details release.
const GuestCard: React.FC<{ name: string; role: string; org: string }> = ({ name, role, org }) => {
	const ref = useRef<HTMLDivElement>(null);
	const isOnScreen = useIntersectionObserver(ref, 0.15);

	useEffect(() => {
		if (isOnScreen && ref.current) {
			gsap.to(ref.current, {
				opacity: 1,
				y: 0,
				duration: 1.25,
				ease: "power2.out"
			});
		}
	}, [isOnScreen]);

	return (
		<div ref={ref} className={S.guestCard} style={{ opacity: 0, transform: "translateY(40px)" }}>
			<h4 className={S.guestName}>{name}</h4>
			<p className={S.guestRole}>{role}</p>
			<p className={S.guestOrg}>{org}</p>
		</div>
	);
};

const GalleryImage: React.FC<{ src: string; index: number; windowWidth: number }> = ({ src, index, windowWidth }) => {
	const ref = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const isOnScreen = useIntersectionObserver(ref, 0.15);

	useEffect(() => {
		if (windowWidth <= 1024 && isOnScreen && imageRef.current) {
			gsap.to(imageRef.current, {
				scale: 1,
				duration: 2.5,
				ease: "power3.out",
				clipPath: "inset(0% 0% 0% 0%)",
			});
		}
	}, [isOnScreen, windowWidth]);

	return (
		<div ref={ref} className={S.galleryImageContainer}>
			<img
				ref={imageRef}
				src={getOptimizedUrl(src, 600)}
				alt={`Event Image ${index + 1}`}
				className={S.galleryImage}
				decoding="async"
			/>
		</div>
	);
};

const HighlightItem: React.FC<{ text: string }> = ({ text }) => {
	const ref = useRef<HTMLParagraphElement>(null);
	const isOnScreen = useIntersectionObserver(ref, 0.15);

	useEffect(() => {
		if (isOnScreen && ref.current) {
			gsap.to(ref.current, {
				opacity: 1,
				y: 0,
				duration: 1.5,
				ease: "power2.out"
			});
		}
	}, [isOnScreen]);

	return (
		<p ref={ref} className={`${S.highlightItem}`} style={{ opacity: 0, transform: "translateY(30px)" }}>
			{text}
		</p>
	);
};

const PastEventDetail: React.FC<PageProps> = ({
	appLoaded,
	preloaded,
	navOnClick,
	windowWidth,
	setAppLoaded,
}) => {
	const { slug } = useParams<{ slug: string }>();
	const [renderedSlug, setRenderedSlug] = useState(slug);
	const navRef = useRef(null);
	const scrollRef = useRef(null);
	const [scroll, setScroll] = useState<any>();
	const pinWrapperRef = useRef<HTMLDivElement>(null);

	const currentEventIndex = pastEvents.findIndex((e) => e.slug === renderedSlug);
	const event = pastEvents[currentEventIndex];

	// Find chronological previous/next events
	const prevEvent = currentEventIndex > 0 ? pastEvents[currentEventIndex - 1] : null;
	const nextEvent = currentEventIndex < pastEvents.length - 1 ? pastEvents[currentEventIndex + 1] : null;

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
		if (slug !== renderedSlug) {
			const tl = gsap.timeline();
			tl.to("#event-detail-page", {
				opacity: 0,
				duration: 0.35,
				ease: "power2.out",
				onComplete: () => {
					setRenderedSlug(slug);
					if (scroll) {
						scroll.scrollTo(0, { duration: 0, disableLerp: true });
						setTimeout(() => {
							scroll.update();
						}, 50);
					}
				}
			});
		}
	}, [slug, scroll, renderedSlug]);

	useEffect(() => {
		if (preloaded && event) {
			gsap.fromTo("#event-detail-page", 
				{ opacity: 0 },
				{ opacity: 1, duration: 0.65, ease: "power2.out" }
			);

			splitting({ by: "words", target: "#event-detail-page .split-text" });
			const delay = appLoaded ? 2.5 : 0;
			const pageScope = gsap.utils.selector("#event-detail-page");
			gsap.set(pageScope(".hidden-init"), { visibility: "visible" });
			gsap.from(pageScope(".split-text .word, .whitespace"), {
				delay: 0.15 + delay,
				duration: 1.25,
				opacity: 0,
				yPercent: 100,
				stagger: 0.04,
				ease: "power3.out",
			});
			gsap.to(`.${S.animateOpacity}`, {
				delay: 0.5 + delay,
				duration: 1.0,
				opacity: 1,
				stagger: 0.05,
			});
		}
	}, [preloaded, renderedSlug, appLoaded]);

	useEffect(() => {
		if (!scroll || windowWidth <= 1024) return;

		const initScrollTrigger = () => {
			gsap.registerPlugin(ScrollTrigger);

			// Synchronize scroll triggers with Locomotive Scroll transforms
			scroll.on("scroll", ScrollTrigger.update);

			ScrollTrigger.scrollerProxy("#event-detail-page", {
				scrollTop(value) {
					return arguments.length 
						? scroll.scrollTo(value, 0, 0) 
						: scroll.scroll.instance.scroll.y;
				},
				getBoundingClientRect() {
					return {
						top: 0,
						left: 0,
						width: window.innerWidth,
						height: window.innerHeight
					};
				},
				pinType: "transform"
			});

			const gallerySec = document.querySelector(`.${S.gallerySection}`);
			const scrollContainer = document.querySelector(`.${S.galleryScrollContainer}`);
			
			if (gallerySec && scrollContainer) {
				const scrollWidth = scrollContainer.scrollWidth;
				const viewWidth = window.innerWidth;
				const xDist = -(scrollWidth - viewWidth + 200); // end of pan offset

				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: gallerySec,
						scroller: "#event-detail-page",
						pin: pinWrapperRef.current,
						pinSpacing: false,
						scrub: true,
						start: "top top",
						end: "bottom bottom",
						invalidateOnRefresh: true,
					}
				});

				tl.to(scrollContainer, {
					x: () => xDist,
					ease: "none"
				});

				// Animating image clip path reveals horizontally using containerAnimation
				const images = scrollContainer.querySelectorAll(`.${S.galleryImage}`);
				images.forEach((img) => {
					gsap.to(img, {
						scale: 1,
						clipPath: "inset(0% 0% 0% 0%)",
						scrollTrigger: {
							trigger: img,
							scroller: "#event-detail-page",
							containerAnimation: tl,
							start: "left 90%",
							toggleActions: "play none none none"
						}
					});
				});
			}

			// Update scroll trigger context on refresh
			ScrollTrigger.addEventListener("refresh", () => scroll.update());
			ScrollTrigger.refresh();
		};

		// If the app is already loaded, wait for the page transition (2.5s) to complete before initializing ScrollTrigger
		const timer = setTimeout(initScrollTrigger, appLoaded ? 2600 : 100);

		return () => {
			clearTimeout(timer);
			ScrollTrigger.getAll().forEach(t => t.kill());
		};
	}, [scroll, renderedSlug, windowWidth, appLoaded]);

	if (!event) {
		return (
			<>
				<Nav ref={navRef} onClick={navOnClick} />
				<div style={{ background: "#121212", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
					<h1 style={{ font: "600 5vh 'New York Extra Large', serif", marginBottom: "2rem" }}>EVENT NOT FOUND</h1>
					<Link to="/past-events">
						<Button use="credits" text="back to archive" />
					</Link>
				</div>
			</>
		);
	}

	return (
		<>
			<Nav ref={navRef} onClick={navOnClick} />
			<div id="event-detail-page" ref={scrollRef} className={S.section} data-scroll-container>
				<div className={S.hero} data-scroll-section>
					<div className={S.watermark}>{event.date}</div>
					<span className={`${S.tag} ${S.animateOpacity}`} data-scroll>{event.tag}</span>
					<h1
						data-splitting=""
						className={`${S.headline} split-text hidden-init`}
						data-scroll
						data-scroll-speed="1"
					>
						{event.name}
					</h1>
					<div className={`${S.metaRow} ${S.animateOpacity}`} data-scroll data-scroll-speed="0.5">
						<span className={S.metaItem}>{event.date}</span>
						<span className={S.metaItem}>·</span>
						<span className={S.metaItem}>{event.location}</span>
						<span className={S.metaItem}>·</span>
						<span className={S.metaItem}>{event.participantCount} Participants</span>
					</div>
				</div>

				<div className={S.overview} data-scroll-section>
					<div className={`${S.overviewLeft} ${S.animateOpacity}`} data-scroll>
						<h2 className={S.sectionTitle}>ABOUT THE EVENT</h2>
						<p className={S.overviewDesc}>{event.description}</p>
					</div>
					<div className={`${S.overviewRight} ${S.animateOpacity}`} data-scroll>
						<div className={S.overviewStat}>
							<p className={S.statNum}>{event.participantCount}</p>
							<p className={S.statLabel}>PARTICIPANTS</p>
						</div>
						<div className={S.overviewStat}>
							<p className={S.statNum}>{event.duration}</p>
							<p className={S.statLabel}>DURATION</p>
						</div>
						<div className={S.overviewStat}>
							<p className={S.statNum}>{event.edition}</p>
							<p className={S.statLabel}>EDITION</p>
						</div>
					</div>
				</div>

				<div className={S.detailsStrip} data-scroll-section>
					<div className={`${S.stripItem} ${S.animateOpacity}`} data-scroll>
						<p className={S.stripLabel}>WHEN</p>
						<p className={S.stripValue}>{event.date}</p>
					</div>
					<div className={`${S.stripItem} ${S.animateOpacity}`} data-scroll>
						<p className={S.stripLabel}>WHERE</p>
						<p className={S.stripValue}>{event.location}</p>
					</div>
					<div className={`${S.stripItem} ${S.animateOpacity}`} data-scroll>
						<p className={S.stripLabel}>FORMAT</p>
						<p className={S.stripValue}>{event.format}</p>
					</div>
					<div className={`${S.stripItem} ${S.animateOpacity}`} data-scroll>
						<p className={S.stripLabel}>HOSTED BY</p>
						<p className={S.stripValue}>E-Cell BVUDET</p>
					</div>
				</div>

				<div className={S.objectiveSection} data-scroll-section>
					<div className={`${S.animateOpacity}`} data-scroll>
						<h2 className={S.sectionTitle} style={{ color: "#ff4040", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "2vh", marginBottom: "4vh" }}>THE OBJECTIVE</h2>
						<p className={S.objectiveText}>{event.objective}</p>
					</div>
				</div>

				<div className={S.guestsSection} data-scroll-section>
					<h2 className={`${S.sectionTitle} ${S.animateOpacity}`} data-scroll>GUESTS AND JUDGES</h2>
					<div className={S.guestsGrid}>
						{event.guests.map((guest, idx) => (
							<GuestCard key={idx} name={guest.name} role={guest.role} org={guest.organization} />
						))}
					</div>
				</div>

				{(() => {
					const defaultPlaceholders = [
						"https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038697/IMG_0526_xxsgcv.heic",
						"https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038696/IMG_0678_phvzks.heic",
						"https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038690/IMG_0518_zp40xi.heic",
						"https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038661/IMG_0732_rzbdrd.heic",
						"https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782040239/IMG_5067_ippz8t.heic",
						"https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038703/IMG_0663_zid8mc.heic"
					];
					const galleryImages = (event.images && event.images.length > 0 ? event.images : defaultPlaceholders).slice(0, 4);

					return (
						<div className={S.gallerySection} data-scroll-section>
							<div ref={pinWrapperRef} className={S.galleryPinWrapper}>
								<h2 className={`${S.sectionTitle} ${S.animateOpacity}`}>FROM THE EVENT</h2>
								<div className={S.galleryScrollWrapper}>
									<div className={S.galleryScrollContainer}>
										{galleryImages.map((img, idx) => (
											<GalleryImage key={idx} src={img} index={idx} windowWidth={windowWidth} />
										))}
									</div>
								</div>
								<div className={`${S.exploreFullGalleryWrapper} ${S.animateOpacity}`}>
									<Link to={`/past-events/${event.slug}/gallery`} className={S.exploreLink}>
										EXPLORE FULL GALLERY →
									</Link>
								</div>
							</div>
						</div>
					);
				})()}

				<div className={S.highlightsSection} data-scroll-section>
					<h2 className={`${S.sectionTitle} ${S.animateOpacity}`} data-scroll>HIGHLIGHTS</h2>
					<div className={S.highlightsList}>
						{event.highlights.map((highlight, idx) => (
							<HighlightItem key={idx} text={highlight} />
						))}
					</div>
				</div>

				<div className={S.navFooter} data-scroll-section>
					{prevEvent ? (
						<Link to={`/past-events/${prevEvent.slug}`} className={`${S.navBlock} ${S.prev} ${S.animateOpacity}`} data-scroll>
							<span className={S.navLabel}>PREVIOUS EVENT</span>
							<span className={S.navName}>← {prevEvent.shortName}</span>
						</Link>
					) : (
						<div style={{ flex: 1 }} />
					)}
					{nextEvent ? (
						<Link to={`/past-events/${nextEvent.slug}`} className={`${S.navBlock} ${S.next} ${S.animateOpacity}`} data-scroll>
							<span className={S.navLabel}>NEXT EVENT</span>
							<span className={S.navName}>{nextEvent.shortName} →</span>
						</Link>
					) : (
						<div style={{ flex: 1 }} />
					)}
				</div>
			</div>
		</>
	);
};

export default PastEventDetail;
