import gsap from "gsap";
gsap.config({
	force3D: true,
});

const AlphabetsAnimation = (
	delay: number,
	element: gsap.TweenTarget,
	letter: string,
	index: string,
	width: number,
) => {
	const indexNumber = Number(index);
	const letterNumber = Number(letter);
	const unit = width > 1024 ? "vh" : "rem";
	const translateNumber = width > 1024 ? -7.2267 : -1.626;

	const alphabets = gsap.timeline({ delay: delay + 0.5 });

	alphabets
		.to(element, {
			delay: 0.1 * indexNumber,
			duration:
				letterNumber < 6 ? 0.15 * letterNumber : 0.05 * letterNumber,
			transform: `translateY(${translateNumber * letterNumber}${unit})`,
		})
		.eventCallback("onComplete", () => {
			alphabets.kill();
		});

	return alphabets.totalDuration()
};

export default AlphabetsAnimation;
