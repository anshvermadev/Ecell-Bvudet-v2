import React from "react";
import S from "./SectionTwo.module.scss";

const SectionTwo: React.FC = () => {
	return (
		<section id="section-two" data-scroll-section>
			<div className={S.section}>
				<div className={S.textWrapper}>
					<h2 className={S.title}>The story behind the cell</h2>
					<p className={S.text}>
						Founded in 2023 with one mission - to turn students
						into entrepreneurs. E-Cell BVUDET bridges academic
						theory with real-world business execution, shifting
						student mindset from job seekers to job creators. We
						provide resources, mentorship, and a platform for
						students to validate their ideas, build prototypes, and
						launch startups.
					</p>
					<p className={S.signature}>
						Dr. Divya Rohatgi &amp; Prof. Deepika Sharma
					</p>
					<p className={S.person}>Faculty Convenors</p>
				</div>
				<div className={S.imageWrapper}>
					<div className={S.imageContainer}>
						<div
							data-scroll
							className={S.image}
							data-scroll-speed="-1"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SectionTwo;
