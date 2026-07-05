import gsap from "gsap";
import { LongLine } from "../../LongLine";
import React, { useEffect } from "react";
import S from "./SectionEight.module.scss";
import useRefArray from "../../../hooks/useRefArray";
import useIntersectionObserver from "../../../hooks/useIntersectionObserver";

type SectionEightProps = {
	windowWidth: number;
};

const SectionEight: React.FC<SectionEightProps> = ({ windowWidth }) => {
	const refs = useRefArray<SVGSVGElement>(5);
	const linesVisibility: boolean[] = [
		useIntersectionObserver(refs[0], 1),
		useIntersectionObserver(refs[1], 1),
		useIntersectionObserver(refs[2], 1),
		useIntersectionObserver(refs[3], 1),
		useIntersectionObserver(refs[4], 1),
	];

	useEffect(() => {
		if (!refs) return;
		refs.forEach((ref, i) => {
			if (linesVisibility[i]) {
				gsap.to(ref.current?.firstChild, {
					delay: windowWidth > 1024 ? 0.5 : 0.2,
					duration: 2.5,
					ease: "expo.out",
					strokeDashoffset: 0,
				});
			}
		});
	}, [linesVisibility, refs]);

	return (
		<section id="section-eight" data-scroll-section>
			<div className={S.section}>
				<div className={S.box}>
					<LongLine
						ref={refs[0]}
						className={S.line}
						windowWidth={windowWidth}
					/>
					<p className={S.title}>Launchpad</p>
					<p className={S.text}>
						An innovation challenge where ideas meet execution. Launchpad is designed to push students to validate their startup concepts, build prototypes, and pitch to industry mentors.
					</p>
					<img
						className={S.img}
						src="https://res.cloudinary.com/dobmi3ojr/image/upload/v1783246586/dev_with_ai_30_x_60_in_Logo_1_nrqbje.jpg"
						alt="Launchpad"
					/>
				</div>
				<div className={S.box}>
					<LongLine
						ref={refs[1]}
						className={S.line}
						windowWidth={windowWidth}
					/>
					<p className={S.title}>Dev with AI</p>
					<p className={S.text}>
						Annual hackathon focused on AI-powered solutions. Developers, designers, and innovators collaborate to build functional prototypes leveraging modern AI APIs and models.
					</p>
					<img
						className={S.img}
						src="https://res.cloudinary.com/dobmi3ojr/image/upload/v1783246351/dev_with_ai_30_x_60_in_Logo_slhe2b.png"
						alt="Dev with AI"
					/>
				</div>
				<div className={S.box}>
					<LongLine
						ref={refs[2]}
						className={S.line}
						windowWidth={windowWidth}
					/>
					<p className={S.title}>Shark Tank</p>
					<p className={S.text}>
						Pitch your startup to a panel of active angel investors and venture capitalists. Secure funding, mentorship, and incubation opportunities directly on campus.
					</p>
					<img
						className={S.img}
						src="https://res.cloudinary.com/dobmi3ojr/image/upload/v1783246580/shark_tank_magazine_Logo_cje2pr.jpg"
						alt="Shark Tank"
					/>
				</div>
				<div className={S.box}>
					<LongLine
						ref={refs[3]}
						className={S.line}
						windowWidth={windowWidth}
					/>
					<p className={S.title}>0 to 1 Sprint</p>
					<p className={S.text}>
						A startup competition held at CC Lab BVUDET and listed on Unstop. Teams move from initial ideation to a fully structured business proposal within an intensive sprint.
					</p>
					<img
						className={S.img}
						src="https://res.cloudinary.com/dobmi3ojr/image/upload/v1783246588/0-1_Logo_idcbaq.jpg"
						alt="0 to 1 Sprint"
					/>
					<LongLine
						ref={refs[4]}
						className={S.line}
						windowWidth={windowWidth}
					/>
				</div>
			</div>
		</section>
	);
};

export default SectionEight;
