import gsap from "gsap";
import splitting from "splitting";
import S from "./EventGallery.module.scss";
import { useParams, Link } from "react-router-dom";
import { PageProps } from "../page.types";
import Nav from "../../components/Nav/Nav";
import LocomotiveScroll from "locomotive-scroll";
import Button from "../../components/Button/Button";
import IntroAnimation from "../../animations/intro";
import React, { useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { pastEvents } from "../../data/pastEvents";
import { FaXmark, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { getOptimizedUrl } from "../../utils/cloudinaryUrl";

const GridImage: React.FC<{ src: string; index: number; onClick: () => void }> = ({ src, index, onClick }) => {
	const ref = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const [loaded, setLoaded] = useState(false);
	const isOnScreen = useIntersectionObserver(ref, 0.1);

	// Lazy load: only set the real src when near viewport
	useEffect(() => {
		if (isOnScreen && imageRef.current && !loaded) {
			imageRef.current.src = getOptimizedUrl(src, 400);
			setLoaded(true);
			gsap.set(imageRef.current, { visibility: "visible" });
			gsap.to(imageRef.current, {
				scale: 1,
				duration: 2.5,
				ease: "power3.out",
				clipPath: "inset(0% 0% 0% 0%)",
			});
		}
	}, [isOnScreen, loaded, src]);

	return (
		<div ref={ref} className={S.imageContainer} onClick={onClick}>
			<img
				ref={imageRef}
				alt={`Event Image ${index + 1}`}
				className={S.image}
				decoding="async"
			/>
		</div>
	);
};

const EventGallery: React.FC<PageProps> = ({
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
	
	// Lightbox state
	const [activeImgIdx, setActiveImgIdx] = useState<number | null>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const lightboxImageRef = useRef<HTMLImageElement>(null);

	const event = pastEvents.find(e => e.slug === slug);

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
		if (preloaded && event) {
			splitting({ by: "words", target: "#gallery-view-page .split-text" });
			const delay = appLoaded ? 2.5 : 0;
			const pageScope = gsap.utils.selector("#gallery-view-page");
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
	}, [preloaded, event]);

	// Lightbox functions
	const handleOpenLightbox = (index: number) => {
		setActiveImgIdx(index);
		if (scroll) {
			scroll.stop();
		}
		setTimeout(() => {
			if (overlayRef.current && lightboxImageRef.current) {
				gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" });
				gsap.fromTo(lightboxImageRef.current,
					{ scale: 0.95, opacity: 0 },
					{ scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" }
				);
			}
		}, 50);
	};

	const handleCloseLightbox = () => {
		if (overlayRef.current && lightboxImageRef.current) {
			gsap.to(lightboxImageRef.current, {
				scale: 0.95,
				opacity: 0,
				duration: 0.35,
				ease: "power2.in"
			});
			gsap.to(overlayRef.current, {
				opacity: 0,
				duration: 0.35,
				ease: "power2.in",
				onComplete: () => {
					setActiveImgIdx(null);
					if (scroll) {
						scroll.start();
					}
				}
			});
		} else {
			setActiveImgIdx(null);
			if (scroll) {
				scroll.start();
			}
		}
	};

	const handleNext = (e?: React.MouseEvent) => {
		if (e) e.stopPropagation();
		if (event && activeImgIdx !== null) {
			const images = event.images && event.images.length > 0 ? event.images : defaultPlaceholders;
			const nextIdx = (activeImgIdx + 1) % images.length;
			
			// Animate out, change source, animate in
			if (lightboxImageRef.current) {
				gsap.to(lightboxImageRef.current, {
					opacity: 0,
					scale: 0.97,
					duration: 0.15,
					ease: "power2.in",
					onComplete: () => {
						setActiveImgIdx(nextIdx);
						gsap.to(lightboxImageRef.current, {
							opacity: 1,
							scale: 1,
							duration: 0.3,
							ease: "power2.out"
						});
					}
				});
			} else {
				setActiveImgIdx(nextIdx);
			}
		}
	};

	const handlePrev = (e?: React.MouseEvent) => {
		if (e) e.stopPropagation();
		if (event && activeImgIdx !== null) {
			const images = event.images && event.images.length > 0 ? event.images : defaultPlaceholders;
			const prevIdx = (activeImgIdx - 1 + images.length) % images.length;

			if (lightboxImageRef.current) {
				gsap.to(lightboxImageRef.current, {
					opacity: 0,
					scale: 1.03,
					duration: 0.15,
					ease: "power2.in",
					onComplete: () => {
						setActiveImgIdx(prevIdx);
						gsap.to(lightboxImageRef.current, {
							opacity: 1,
							scale: 1,
							duration: 0.3,
							ease: "power2.out"
						});
					}
				});
			} else {
				setActiveImgIdx(prevIdx);
			}
		}
	};

	// Keyboard controls
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (activeImgIdx === null) return;
			if (e.key === "Escape") {
				handleCloseLightbox();
			} else if (e.key === "ArrowRight") {
				handleNext();
			} else if (e.key === "ArrowLeft") {
				handlePrev();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [activeImgIdx]);

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

	const defaultPlaceholders = [
		"https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038697/IMG_0526_xxsgcv.heic",
		"https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038696/IMG_0678_phvzks.heic",
		"https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038690/IMG_0518_zp40xi.heic",
		"https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038661/IMG_0732_rzbdrd.heic",
		"https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782040239/IMG_5067_ippz8t.heic",
		"https://res.cloudinary.com/dobmi3ojr/image/upload/f_auto,q_auto/v1782038703/IMG_0663_zid8mc.heic"
	];
	const images = event.images && event.images.length > 0 ? event.images : defaultPlaceholders;

	// Distribute images across columns (3 for desktop, 2 for mobile)
	const desktopCol1: string[] = [];
	const desktopCol2: string[] = [];
	const desktopCol3: string[] = [];
	images.forEach((img, idx) => {
		if (idx % 3 === 0) desktopCol1.push(img);
		else if (idx % 3 === 1) desktopCol2.push(img);
		else desktopCol3.push(img);
	});

	const mobileCol1: string[] = [];
	const mobileCol2: string[] = [];
	images.forEach((img, idx) => {
		if (idx % 2 === 0) mobileCol1.push(img);
		else mobileCol2.push(img);
	});

	return (
		<>
			<Nav ref={navRef} onClick={navOnClick} />
			<div id="gallery-view-page" ref={scrollRef} className={S.gallery} data-scroll-container>
				
				{/* Section 1: Hero */}
				<div className={S.headerContainer} data-scroll-section>
					<h1
						data-splitting=""
						className={`${S.headline} split-text hidden-init`}
						data-scroll
						data-scroll-speed="1"
					>
						{event.name}
					</h1>
					<p className={`${S.subtitle} ${S.animateOpacity}`} data-scroll data-scroll-speed="0.5">
						Full Gallery
					</p>
				</div>

				{/* Section 2: Parallax Columns Grid */}
				<div className={S.grid} data-scroll-section>
					{windowWidth > 1024 && (
						<>
							<div
								data-scroll
								id="leftColumn"
								data-scroll-speed={-20}
								className={S.desktopColumn}
							>
								{desktopCol1.map((img, i) => (
									<GridImage
										key={i}
										src={img}
										index={i * 3}
										onClick={() => handleOpenLightbox(i * 3)}
									/>
								))}
							</div>
							<div
								id="middleColumn"
								className={S.middleColumn}
							>
								{desktopCol2.map((img, i) => (
									<GridImage
										key={i}
										src={img}
										index={i * 3 + 1}
										onClick={() => handleOpenLightbox(i * 3 + 1)}
									/>
								))}
							</div>
							<div
								data-scroll
								id="rightColumn"
								data-scroll-speed={-20}
								className={S.desktopColumn}
							>
								{desktopCol3.map((img, i) => (
									<GridImage
										key={i}
										src={img}
										index={i * 3 + 2}
										onClick={() => handleOpenLightbox(i * 3 + 2)}
									/>
								))}
							</div>
						</>
					)}
					{windowWidth <= 1024 && (
						<>
							<div
								data-scroll
								id="leftColumn"
								data-scroll-speed={-20}
								className={S.leftColumn}
							>
								{mobileCol1.map((img, i) => (
									<GridImage
										key={i}
										src={img}
										index={i * 2}
										onClick={() => handleOpenLightbox(i * 2)}
									/>
								))}
							</div>
							<div
								id="middleColumn"
								className={S.rightColumn}
							>
								{mobileCol2.map((img, i) => (
									<GridImage
										key={i}
										src={img}
										index={i * 2 + 1}
										onClick={() => handleOpenLightbox(i * 2 + 1)}
									/>
								))}
							</div>
						</>
					)}
				</div>

				{/* Section 3: Back Nav */}
				<div className={S.backNavWrapper} data-scroll-section>
					<Link to={`/past-events/${event.slug}`} className={`${S.backNav} ${S.animateOpacity}`} data-scroll>
						← BACK TO EVENT
					</Link>
				</div>

			</div>

			{/* Fullscreen Lightbox Overlay */}
			{activeImgIdx !== null && (
				<div
					ref={overlayRef}
					className={`${S.lightboxOverlay} ${activeImgIdx !== null ? S.isOpen : ""}`}
					onClick={handleCloseLightbox}
				>
					<div className={S.lightboxContent}>
						<button className={S.closeBtn} onClick={handleCloseLightbox} aria-label="Close Lightbox">
							<FaXmark />
						</button>

						<button className={S.prevBtn} onClick={handlePrev} aria-label="Previous Image">
							<FaChevronLeft />
						</button>

						<img
							ref={lightboxImageRef}
							src={getOptimizedUrl(images[activeImgIdx], 1400)}
							alt={`Event zoom ${activeImgIdx + 1}`}
							className={S.lightboxImage}
						/>

						<button className={S.nextBtn} onClick={handleNext} aria-label="Next Image">
							<FaChevronRight />
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default EventGallery;
