import React from "react";
import Button from "../../Button/Button";
import { Link } from "react-router-dom";
import S from "./SectionNine.module.scss";

type SectionEightProps = {
	windowWidth: number;
};

const SectionEight: React.FC<SectionEightProps> = ({ windowWidth }) => {
	const textScrollSpeed = windowWidth <= 1024 ? -5 : 3;

	return (
		<section id="section-nine" data-scroll-section>
			<div className={S.section}>
				<div className={S.left}>
					<p className={S.text}>
						Meet the minds building the future
					</p>
					<Link to="/team">
						<div className={S.button}>
							<Button use="section-nine" text="go to team" />
						</div>
					</Link>
				</div>
				<div className={S.right}>
					<img
						className={S.image1}
						src="https://res.cloudinary.com/dobmi3ojr/image/upload/q_auto,f_auto/v1782038661/IMG_0732_rzbdrd.heic"
						alt=""
					/>
					<img
						className={S.image2}
						src="https://res.cloudinary.com/dobmi3ojr/image/upload/q_auto,f_auto/v1782038698/IMG_0683_wecune.heic"
						alt=""
					/>
					<img
						className={S.image3}
						src="https://res.cloudinary.com/dobmi3ojr/image/upload/q_auto,f_auto/v1783247152/Copy_of_IMG_9045_vtjbry.jpg"
						alt=""
					/>
					<p
						data-scroll
						className={S.title}
						data-scroll-direction="horizontal"
						data-scroll-speed={textScrollSpeed}
					>
						E-Cell BVUDET
					</p>
				</div>
			</div>
		</section>
	);
};

export default SectionEight;
