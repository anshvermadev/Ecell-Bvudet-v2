import React from "react";
import S from "./SectionSix.module.scss";

const SectionSix: React.FC = () => {
	return (
		<section data-scroll-section>
			<div className={S.section}>
				<div data-scroll data-scroll-speed='-10' className={S.videoWrapper}>
					<img src="https://res.cloudinary.com/dobmi3ojr/image/upload/v1783243118/0bb3a2f0d98272065a813572efcee5aa_2_y7uyor.jpg" alt="" className={S.img} />
				</div>
			</div>
		</section>
	);
};

export default SectionSix;
