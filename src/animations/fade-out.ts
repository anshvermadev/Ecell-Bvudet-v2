import gsap from "gsap";
gsap.config({
	force3D: true,
});

const FadeOutAnimation = (delay: number, element: gsap.TweenTarget, callback: () => void) => {
	const fadeOut = gsap.timeline();
	fadeOut
		.to(element, {
			delay: delay + 1.0,
			duration: 0.8,
			opacity: 0,
		})
		.call(callback, undefined, delay + 1.6)
		.eventCallback("onComplete", () => {
			fadeOut.kill();
		});
};

export default FadeOutAnimation;
