import gsap from "gsap";
import splitting from "splitting";
import S from "./Join.module.scss";
import { PageProps } from "../page.types";
import Nav from "../../components/Nav/Nav";
import LocomotiveScroll from "locomotive-scroll";
import Button from "../../components/Button/Button";
import IntroAnimation from "../../animations/intro";
import React, { useEffect, useRef, useState } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { submitApplication, FormData, TeamMember } from "../../utils/submitApplication";
import { Link } from "react-router-dom";
import { FaCheck, FaUpload, FaTrash, FaArrowRight } from "react-icons/fa6";

const stageOptions = [
	{ value: "ideation", label: "Ideation - just an idea" },
	{ value: "prototype", label: "Prototype or proof of concept" },
	{ value: "early-traction", label: "Early traction" },
	{ value: "revenue", label: "Revenue generating" },
	{ value: "registered", label: "Registered business" }
];

const industryOptions = [
	"Technology", "Healthcare", "E-commerce", "FinTech", "EdTech",
	"Social Enterprise", "AgriTech", "CleanTech", "Food and Beverage", "Other"
];

const CheckIcon = () => <FaCheck style={{ width: "1.5vh", height: "1.5vh" }} />;

const UploadIcon = () => <FaUpload style={{ width: "4vh", height: "4vh" }} />;

const TrashIcon = () => <FaTrash style={{ width: "1.5vh", height: "1.5vh" }} />;

const Arrow = ({ width }: { width?: string }) => <FaArrowRight style={{ width, height: width }} />;

const benefitsData = [
	{
		number: "01",
		title: "Access Mentorship",
		description: "Get direct 1-on-1 guidance from seasoned industry founders, investors, and alumni who have built real ventures."
	},
	{
		number: "02",
		title: "Unlock Resources",
		description: "Tap into startup toolkits, cloud credits, incubation space, and exclusive pitch opportunities with active seed investors."
	},
	{
		number: "03",
		title: "Join the Ecosystem",
		description: "Collaborate with cross-functional builders, participate in hackathons, and turn classrooms into boardrooms."
	}
];

const BenefitCard: React.FC<{ number: string; title: string; description: string; index: number }> = ({ number, title, description, index }) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const isOnScreen = useIntersectionObserver(cardRef, 0.1);

	useEffect(() => {
		if (isOnScreen) {
			if (contentRef.current) {
				gsap.to(contentRef.current, {
					clipPath: "inset(0% 0% 0% 0%)",
					opacity: 1,
					y: 0,
					duration: 2.0,
					ease: "power3.out",
				});
			}
		}
	}, [isOnScreen]);

	return (
		<div
			ref={cardRef}
			className={S.benefitCard}
			data-scroll
		>
			<div 
				ref={contentRef} 
				style={{ 
					opacity: 0, 
					transform: "translateY(40px)",
					clipPath: "inset(100% 0% 0% 0%)" 
				}} 
				className={S.cardContent}
			>
				<span className={S.cardNum}>{number}</span>
				<h3 className={S.cardTitle}>{title}</h3>
				<p className={S.cardDesc}>{description}</p>
			</div>
		</div>
	);
};

const AnchorToForm: React.FC<{ onClick: () => void }> = ({ onClick }) => {
	const ref = useRef<HTMLDivElement>(null);
	const isOnScreen = useIntersectionObserver(ref, 0.15);

	useEffect(() => {
		if (isOnScreen && ref.current) {
			const items = ref.current.querySelectorAll(".animate-item");
			gsap.to(items, {
				opacity: 1,
				y: 0,
				duration: 1.25,
				stagger: 0.15,
				ease: "power2.out"
			});
		}
	}, [isOnScreen]);

	return (
		<div ref={ref} className={S.anchorSection} onClick={onClick} data-scroll-section>
			<h2 className={`${S.anchorTitle} animate-item`} style={{ opacity: 0, transform: "translateY(30px)" }}>READY TO APPLY?</h2>
			<p className={`${S.anchorSubtext} animate-item`} style={{ opacity: 0, transform: "translateY(20px)" }}>Fill out the form below. We review on a rolling basis.</p>
			<div className={`${S.scrollArrowContainer} animate-item`} style={{ opacity: 0, transform: "translateY(20px)" }}>
				<Arrow width="10vh" />
			</div>
		</div>
	);
};

interface DropdownProps {
	options: { value: string; label: string }[] | string[];
	value: string;
	onChange: (val: string) => void;
	placeholder: string;
	error?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, placeholder, error }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const formattedOptions = options.map((opt: string | { value: string; label: string }) =>
		typeof opt === "string" ? { value: opt, label: opt } : opt
	);

	const selectedOpt = formattedOptions.find((opt) => opt.value === value);

	return (
		<div ref={dropdownRef} className={`${S.dropdownContainer} ${isOpen ? S.isOpenContainer : ""}`}>
			<div
				className={`${S.dropdownSelect} ${isOpen ? S.isOpen : ""}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className={value ? S.selectedValue : S.placeholder} style={{ color: value ? "#fff" : "#555" }}>
					{selectedOpt ? selectedOpt.label : placeholder}
				</span>
				<span className={S.dropdownArrow} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>↓</span>
			</div>
			{isOpen && (
				<div className={S.dropdownMenu}>
					{formattedOptions.map((opt) => (
						<div
							key={opt.value}
							className={`${S.dropdownOption} ${opt.value === value ? S.isSelected : ""}`}
							onClick={() => {
								onChange(opt.value);
								setIsOpen(false);
							}}
						>
							{opt.label}
						</div>
					))}
				</div>
			)}
			{error && <p className={S.errorText}>{error}</p>}
		</div>
	);
};

const Join: React.FC<PageProps> = ({
	appLoaded,
	preloaded,
	navOnClick,
	windowWidth,
	setAppLoaded,
}) => {
	const navRef = useRef(null);
	const scrollRef = useRef(null);
	const [scroll, setScroll] = useState<any>();

	// Form State
	const [formData, setFormData] = useState<FormData>(() => {
		const saved = localStorage.getItem('joinFormData');
		if (saved) {
			try { return JSON.parse(saved); } catch (e) {}
		}
		return {
			leaderName: "",
			leaderEmail: "",
			leaderPhone: "",
			leaderCollege: "",
			leaderYear: "",
			leaderLinkedin: "",
			leaderRole: "",
			startupName: "",
			stage: "",
			industry: "",
			problemStatement: "",
			solution: "",
			targetMarket: "",
			usp: "",
			businessModel: ""
		};
	});

	const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
		const saved = localStorage.getItem('joinTeamMembers');
		if (saved) {
			try { return JSON.parse(saved); } catch (e) {}
		}
		return [{ name: "", role: "", linkedin: "", college: "", year: "" }];
	});

	const [pitchDeck, setPitchDeck] = useState<File | null>(null);
	const [pitchDeckError, setPitchDeckError] = useState<string>("");

	const [step, setStep] = useState<number>(() => {
		const saved = localStorage.getItem('joinStep');
		if (saved) {
			try { return parseInt(saved, 10); } catch (e) {}
		}
		return 0;
	});
	const [errors, setErrors] = useState<Record<string, any>>({});
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [submitError, setSubmitError] = useState<string>("");
	const [isSuccess, setIsSuccess] = useState<boolean>(false);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const formFieldsRef = useRef<HTMLDivElement>(null);
	const successPanelRef = useRef<HTMLDivElement>(null);

	// Save state to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem('joinFormData', JSON.stringify(formData));
	}, [formData]);

	useEffect(() => {
		localStorage.setItem('joinTeamMembers', JSON.stringify(teamMembers));
	}, [teamMembers]);

	useEffect(() => {
		localStorage.setItem('joinStep', step.toString());
	}, [step]);

	// Year calculation (current minus 3 to current plus 6)
	const currentYear = new Date().getFullYear();
	const yearOptions = Array.from({ length: 10 }, (_, i) => String(currentYear - 3 + i));

	useEffect(() => {
		if (formFieldsRef.current && !isSuccess) {
			const inputs = formFieldsRef.current.querySelectorAll(
				`[class*="inputGroup"], [class*="teamMemberCard"], [class*="secondaryBtn"], [class*="fileDetails"], [class*="uploadZone"]`
			);
			gsap.fromTo(inputs, 
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					stagger: 0.05,
					ease: "power2.out"
				}
			);
		}
	}, [step, isSuccess]);

	useEffect(() => {
		if (isSuccess && successPanelRef.current) {
			const elements = successPanelRef.current.querySelectorAll(
				`[class*="successIconWrapper"], [class*="successTitle"], [class*="successSubtext"], [class*="successEmail"], a`
			);
			gsap.fromTo(successPanelRef.current,
				{ opacity: 0, y: 60 },
				{ opacity: 1, y: 0, duration: 1.25, ease: "power3.out" }
			);
			gsap.fromTo(elements,
				{ opacity: 0, y: 30, scale: 0.9 },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 1.0,
					stagger: 0.12,
					ease: "back.out(1.5)",
					delay: 0.15
				}
			);
		}
	}, [isSuccess]);

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
			splitting({ by: "words", target: "#join-page .split-text" });
			const delay = appLoaded ? 2.5 : 0;
			const pageScope = gsap.utils.selector("#join-page");
			gsap.set(pageScope(".hidden-init"), { visibility: "visible" });
			gsap.from(pageScope(".split-text .word, .whitespace"), {
				delay: 0.25 + delay,
				duration: 1.5,
				opacity: 0,
				yPercent: 100,
				stagger: 0.05,
				ease: "power3.out",
			});
			gsap.to(`.${S.animateOpacity}`, {
				delay: 1 + delay,
				duration: 1.25,
				opacity: 1,
				stagger: 0.05,
			});
		}
	}, [preloaded]);

	const scrollToForm = () => {
		if (scroll) {
			setTimeout(() => {
				scroll.update();
				scroll.scrollTo(document.querySelector("#form-section"), {
					duration: 800,
					disableLerp: false
				});
			}, 50);
		}
	};

	const handleInputChange = (field: keyof FormData, val: string) => {
		setFormData({ ...formData, [field]: val });
		if (errors[field]) {
			const updatedErrors = { ...errors };
			delete updatedErrors[field];
			setErrors(updatedErrors);
		}
	};

	const addTeamMember = () => {
		setTeamMembers([...teamMembers, { name: "", role: "", linkedin: "", college: "", year: "" }]);
	};

	const removeTeamMember = (index: number) => {
		if (teamMembers.length > 1) {
			const updated = teamMembers.filter((_, i) => i !== index);
			setTeamMembers(updated);
			// Clean errors for this index if any
			if (errors.teamMembers && errors.teamMembers[index]) {
				const updatedMembersErr = { ...errors.teamMembers };
				delete updatedMembersErr[index];
				setErrors({ ...errors, teamMembers: updatedMembersErr });
			}
		}
	};

	const handleMemberChange = (index: number, field: keyof TeamMember, val: string) => {
		const updated = [...teamMembers];
		updated[index][field] = val;
		setTeamMembers(updated);

		if (errors.teamMembers && errors.teamMembers[index] && errors.teamMembers[index][field]) {
			const updatedMembersErr = { ...errors.teamMembers };
			delete updatedMembersErr[index][field];
			if (Object.keys(updatedMembersErr[index]).length === 0) {
				delete updatedMembersErr[index];
			}
			if (Object.keys(updatedMembersErr).length === 0) {
				const updatedErrors = { ...errors };
				delete updatedErrors.teamMembers;
				setErrors(updatedErrors);
			} else {
				setErrors({ ...errors, teamMembers: updatedMembersErr });
			}
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.type !== "application/pdf") {
			setPitchDeckError("Only PDF files are allowed");
			setPitchDeck(null);
			return;
		}

		if (file.size > 10 * 1024 * 1024) {
			setPitchDeckError("File size must be less than 10MB");
			setPitchDeck(null);
			return;
		}

		setPitchDeckError("");
		setPitchDeck(file);
	};

	const removeFile = (e: React.MouseEvent) => {
		e.stopPropagation();
		setPitchDeck(null);
		setPitchDeckError("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const triggerUpload = () => {
		fileInputRef.current?.click();
	};

	const validateStep0 = () => {
		const step0Errors: Record<string, string> = {};
		if (!formData.leaderName.trim()) step0Errors.leaderName = "Full name is required";
		
		if (!formData.leaderEmail.trim()) {
			step0Errors.leaderEmail = "Email is required";
		} else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.leaderEmail)) {
			step0Errors.leaderEmail = "Please enter a valid email address";
		}

		if (!formData.leaderPhone.trim()) step0Errors.leaderPhone = "Phone number is required";
		if (!formData.leaderCollege.trim()) step0Errors.leaderCollege = "College name is required";
		if (!formData.leaderYear) step0Errors.leaderYear = "Graduation year is required";

		if (!formData.leaderLinkedin.trim()) {
			step0Errors.leaderLinkedin = "LinkedIn URL is required";
		} else if (!/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(formData.leaderLinkedin.trim())) {
			step0Errors.leaderLinkedin = "Must match linkedin.com/in/profile pattern";
		}

		if (!formData.leaderRole.trim()) step0Errors.leaderRole = "Role in startup is required";

		return step0Errors;
	};

	const validateStep1 = () => {
		const step1Errors: Record<string, string> = {};
		if (!formData.startupName.trim()) step1Errors.startupName = "Startup name is required";
		if (!formData.stage) step1Errors.stage = "Startup stage is required";
		if (!formData.industry) step1Errors.industry = "Industry is required";
		if (!formData.problemStatement.trim()) step1Errors.problemStatement = "Problem statement is required";
		if (!formData.solution.trim()) step1Errors.solution = "Solution description is required";
		if (!formData.targetMarket.trim()) step1Errors.targetMarket = "Target market description is required";
		if (!formData.usp.trim()) step1Errors.usp = "USP is required";
		if (!formData.businessModel.trim()) step1Errors.businessModel = "Business model description is required";
		return step1Errors;
	};

	const validateStep2 = () => {
		const step2Errors: Record<string, any> = {};
		const memberErrors: Record<number, Record<string, string>> = {};

		teamMembers.forEach((member, index) => {
			const hasAnyField =
				member.name.trim() ||
				member.role.trim() ||
				member.linkedin.trim() ||
				member.college.trim() ||
				member.year;

			if (hasAnyField) {
				const mErrors: Record<string, string> = {};
				if (!member.name.trim()) mErrors.name = "Full name is required";
				if (!member.role.trim()) mErrors.role = "Role is required";
				
				if (!member.linkedin.trim()) {
					mErrors.linkedin = "LinkedIn is required";
				} else if (!/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(member.linkedin.trim())) {
					mErrors.linkedin = "Must match linkedin.com/in/profile pattern";
				}

				if (Object.keys(mErrors).length > 0) {
					memberErrors[index] = mErrors;
				}
			}
		});

		if (Object.keys(memberErrors).length > 0) {
			step2Errors.teamMembers = memberErrors;
		}

		return step2Errors;
	};

	const handleNext = () => {
		if (step === 0) {
			const step0Errors = validateStep0();
			if (Object.keys(step0Errors).length > 0) {
				setErrors(step0Errors);
				return;
			}
			setErrors({});
			setStep(1);
			scrollToForm();
		} else if (step === 1) {
			const step1Errors = validateStep1();
			if (Object.keys(step1Errors).length > 0) {
				setErrors(step1Errors);
				return;
			}
			setErrors({});
			setStep(2);
			scrollToForm();
		}
	};

	const handleBack = () => {
		if (step > 0) {
			setErrors({});
			setStep(step - 1);
			scrollToForm();
		}
	};

	const handleClearForm = () => {
		if (window.confirm("Are you sure you want to clear the entire form? This cannot be undone.")) {
			setFormData({
				leaderName: "",
				leaderEmail: "",
				leaderPhone: "",
				leaderCollege: "",
				leaderYear: "",
				leaderLinkedin: "",
				leaderRole: "",
				startupName: "",
				stage: "",
				industry: "",
				problemStatement: "",
				solution: "",
				targetMarket: "",
				usp: "",
				businessModel: ""
			});
			setTeamMembers([{ name: "", role: "", linkedin: "", college: "", year: "" }]);
			setPitchDeck(null);
			setPitchDeckError("");
			setErrors({});
			setStep(0);
			localStorage.removeItem('joinFormData');
			localStorage.removeItem('joinTeamMembers');
			localStorage.removeItem('joinStep');
			scrollToForm();
		}
	};

	const handleSubmit = async () => {
		const step2Errors = validateStep2();
		if (Object.keys(step2Errors).length > 0) {
			setErrors(step2Errors);
			return;
		}

		setErrors({});
		setSubmitting(true);
		setSubmitError("");

		try {
			await submitApplication(formData, teamMembers, pitchDeck);
			setIsSuccess(true);
			// Clear local storage upon successful submission
			localStorage.removeItem('joinFormData');
			localStorage.removeItem('joinTeamMembers');
			localStorage.removeItem('joinStep');
			scrollToForm();
		} catch (err: any) {
			console.error("Submission failed", err);
			setSubmitError(err?.message || "Submission failed. Please try again or contact ecell.detnm@bvucoep.edu.in");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<Nav ref={navRef} onClick={navOnClick} />
			<div id="join-page" ref={scrollRef} className={S.section} data-scroll-container>
				{/* SECTION 1 - Page Hero */}
				<div className={S.hero} data-scroll-section>
					<h1
						data-splitting=""
						className={`${S.headline} split-text hidden-init`}
						data-scroll
						data-scroll-speed="1"
					>
						Join Our Community
					</h1>
					<p className={`${S.subtitle} ${S.animateOpacity}`} data-scroll data-scroll-speed="0.5" style={{ color: "#ff4040" }}>
						Are you a student passionate about entrepreneurship?
					</p>
					<p className={`${S.description} ${S.animateOpacity}`} data-scroll data-scroll-speed="0.3">
						Register now for exclusive resources, mentorship, and a community of innovators. Whether you have an idea or just want to learn, we're here to support you!
					</p>
				</div>

				{/* BENEFITS SECTION */}
				<div className={S.benefitsSection} data-scroll-section>
					<div className={S.benefitsHeader}>
						<span className={`${S.benefitsSubtitle} ${S.animateOpacity}`} data-scroll data-scroll-speed="0.5">THE BENEFITS</span>
						<h2 className={`${S.benefitsTitle} split-text hidden-init`} data-scroll data-scroll-speed="0.3">WHAT YOU GET AS A MEMBER</h2>
					</div>
					<div className={S.benefitsGrid}>
						{benefitsData.map((benefit, idx) => (
							<BenefitCard
								key={idx}
								index={idx}
								number={benefit.number}
								title={benefit.title}
								description={benefit.description}
							/>
						))}
					</div>
				</div>

				{/* SECTION 4 - Anchor to Form */}
				<AnchorToForm onClick={scrollToForm} />

				{/* LAYER 2 - REGISTRATION FORM SECTION */}
				<div id="form-section" className={S.formSection} data-scroll-section>
					{isSuccess ? (
						<div className={S.successContainer} data-scroll>
							<div ref={successPanelRef} className={S.successPanel}>
								<div className={S.successIconWrapper}>
									<CheckIcon />
								</div>
								<h2 className={S.successTitle}>APPLICATION RECEIVED</h2>
								<p className={S.successSubtext}>We will review your application and reach out soon.</p>
								<p className={S.successEmail}>ecell.detnm@bvucoep.edu.in</p>
								<Link to="/">
									<Button use="credits" text="back to home" />
								</Link>
							</div>
						</div>
					) : (
						<div className={S.formContainer}>
							{/* Left Column: Context & Progress Timeline */}
							<div className={S.formContext} data-scroll data-scroll-speed="0.2">
								<div className={S.stickyContext}>
									<div className={S.stepMeta}>
										<span className={S.stepNumber}>0{step + 1}</span>
										<span className={S.stepTotal}>/ 03</span>
									</div>
									<h2 className={S.formContextTitle}>
										{step === 0 && "Leader Info"}
										{step === 1 && "Startup Vision"}
										{step === 2 && "Submission"}
									</h2>
									<p className={S.formContextDesc}>
										{step === 0 && "Introduce yourself as the team lead. Provide your academic background, contact details, and professional profiles."}
										{step === 1 && "Describe your venture. Detail the problem you're solving, your solution, target market, USP, and business model."}
										{step === 2 && "Introduce the builders driving your startup forward and upload your pitch deck to finalize your application."}
									</p>

									<button className={S.clearFormBtn} onClick={handleClearForm}>
										<TrashIcon /> Clear Form
									</button>

									{/* Vertical Step Timeline */}
									<div className={S.verticalTimeline}>
										<div 
											className={S.timelineProgressLine} 
											style={{ height: step === 0 ? "0%" : step === 1 ? "50%" : "100%" }}
										/>
										<div className={S.timelineTrack} />
										
										<div className={`${S.timelineNode} ${step === 0 ? S.active : ""} ${step > 0 ? S.completed : ""}`} onClick={() => step > 0 && setStep(0)}>
											<div className={S.nodeCircle}>
												{step > 0 ? <CheckIcon /> : "1"}
											</div>
											<div className={S.nodeInfo}>
												<span className={S.nodeLabel}>STEP 01</span>
												<span className={S.nodeTitle}>Team Leader</span>
											</div>
										</div>
										
										<div className={`${S.timelineNode} ${step === 1 ? S.active : ""} ${step > 1 ? S.completed : ""}`} onClick={() => step > 1 ? setStep(1) : (step > 0 ? setStep(1) : undefined)}>
											<div className={S.nodeCircle}>
												{step > 1 ? <CheckIcon /> : "2"}
											</div>
											<div className={S.nodeInfo}>
												<span className={S.nodeLabel}>STEP 02</span>
												<span className={S.nodeTitle}>Startup Vision</span>
											</div>
										</div>
										
										<div className={`${S.timelineNode} ${step === 2 ? S.active : ""}`} onClick={() => step > 1 ? setStep(2) : undefined}>
											<div className={S.nodeCircle}>
												3
											</div>
											<div className={S.nodeInfo}>
												<span className={S.nodeLabel}>STEP 03</span>
												<span className={S.nodeTitle}>Submission</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Right Column: Inputs Form Panel */}
							<div ref={formFieldsRef} className={S.formPanel}>
								{submitting ? (
									<div className={S.loadingPanel}>
										<div className={S.spinner}>
											<div className={S.spinnerInner} />
										</div>
										<p className={S.loadingText}>Submitting Application...</p>
									</div>
								) : (
									<>
										{/* Step 0 - Team Leader */}
										{step === 0 && (
									<div className={S.formGrid}>
										<div className={`${S.inputGroup} ${S.fullWidth}`}>
											<label className={S.inputLabel}>Full Name</label>
											<input
												type="text"
												placeholder="Full name"
												className={S.inputField}
												value={formData.leaderName}
												onChange={(e) => handleInputChange("leaderName", e.target.value)}
											/>
											{errors.leaderName && <p className={S.errorText}>{errors.leaderName}</p>}
										</div>

										<div className={S.inputGroup}>
											<label className={S.inputLabel}>Email</label>
											<input
												type="email"
												placeholder="your@email.com"
												className={S.inputField}
												value={formData.leaderEmail}
												onChange={(e) => handleInputChange("leaderEmail", e.target.value)}
											/>
											{errors.leaderEmail && <p className={S.errorText}>{errors.leaderEmail}</p>}
										</div>

										<div className={S.inputGroup}>
											<label className={S.inputLabel}>Phone</label>
											<input
												type="tel"
												placeholder="10-digit number"
												className={S.inputField}
												value={formData.leaderPhone}
												onChange={(e) => handleInputChange("leaderPhone", e.target.value)}
											/>
											{errors.leaderPhone && <p className={S.errorText}>{errors.leaderPhone}</p>}
										</div>

										<div className={S.inputGroup}>
											<label className={S.inputLabel}>College</label>
											<input
												type="text"
												placeholder="Your college name"
												className={S.inputField}
												value={formData.leaderCollege}
												onChange={(e) => handleInputChange("leaderCollege", e.target.value)}
											/>
											{errors.leaderCollege && <p className={S.errorText}>{errors.leaderCollege}</p>}
										</div>

										<div className={S.inputGroup}>
											<label className={S.inputLabel}>Graduation Year</label>
											<Dropdown
												options={yearOptions}
												value={formData.leaderYear}
												onChange={(val) => handleInputChange("leaderYear", val)}
												placeholder="Select year"
												error={errors.leaderYear}
											/>
										</div>

										<div className={S.inputGroup}>
											<label className={S.inputLabel}>LinkedIn URL</label>
											<input
												type="url"
												placeholder="linkedin.com/in/yourprofile"
												className={S.inputField}
												value={formData.leaderLinkedin}
												onChange={(e) => handleInputChange("leaderLinkedin", e.target.value)}
											/>
											{errors.leaderLinkedin && <p className={S.errorText}>{errors.leaderLinkedin}</p>}
										</div>

										<div className={S.inputGroup}>
											<label className={S.inputLabel}>Role in Startup</label>
											<input
												type="text"
												placeholder="Founder, CEO, CTO"
												className={S.inputField}
												value={formData.leaderRole}
												onChange={(e) => handleInputChange("leaderRole", e.target.value)}
											/>
											{errors.leaderRole && <p className={S.errorText}>{errors.leaderRole}</p>}
										</div>
									</div>
								)}

								{/* Step 1 - Startup Details */}
								{step === 1 && (
									<div className={S.formGrid}>
										<div className={`${S.inputGroup} ${S.fullWidth}`}>
											<label className={S.inputLabel}>Startup Name</label>
											<input
												type="text"
												placeholder="Your startup name"
												className={S.inputField}
												value={formData.startupName}
												onChange={(e) => handleInputChange("startupName", e.target.value)}
											/>
											{errors.startupName && <p className={S.errorText}>{errors.startupName}</p>}
										</div>

										<div className={S.inputGroup}>
											<label className={S.inputLabel}>Stage</label>
											<Dropdown
												options={stageOptions}
												value={formData.stage}
												onChange={(val) => handleInputChange("stage", val)}
												placeholder="Select stage"
												error={errors.stage}
											/>
										</div>

										<div className={S.inputGroup}>
											<label className={S.inputLabel}>Industry</label>
											<Dropdown
												options={industryOptions}
												value={formData.industry}
												onChange={(val) => handleInputChange("industry", val)}
												placeholder="Select industry"
												error={errors.industry}
											/>
										</div>

										<div className={`${S.inputGroup} ${S.fullWidth}`}>
											<label className={S.inputLabel}>Problem Statement</label>
											<textarea
												rows={3}
												placeholder="What problem are you solving?"
												className={S.textareaField}
												value={formData.problemStatement}
												onChange={(e) => handleInputChange("problemStatement", e.target.value)}
											/>
											{errors.problemStatement && <p className={S.errorText}>{errors.problemStatement}</p>}
										</div>

										<div className={`${S.inputGroup} ${S.fullWidth}`}>
											<label className={S.inputLabel}>Solution</label>
											<textarea
												rows={3}
												placeholder="How does your product solve it?"
												className={S.textareaField}
												value={formData.solution}
												onChange={(e) => handleInputChange("solution", e.target.value)}
											/>
											{errors.solution && <p className={S.errorText}>{errors.solution}</p>}
										</div>

										<div className={`${S.inputGroup} ${S.fullWidth}`}>
											<label className={S.inputLabel}>Target Market</label>
											<textarea
												rows={2}
												placeholder="Who are your customers?"
												className={S.textareaField}
												value={formData.targetMarket}
												onChange={(e) => handleInputChange("targetMarket", e.target.value)}
											/>
											{errors.targetMarket && <p className={S.errorText}>{errors.targetMarket}</p>}
										</div>

										<div className={`${S.inputGroup} ${S.fullWidth}`}>
											<label className={S.inputLabel}>USP</label>
											<textarea
												rows={2}
												placeholder="What makes you different?"
												className={S.textareaField}
												value={formData.usp}
												onChange={(e) => handleInputChange("usp", e.target.value)}
											/>
											{errors.usp && <p className={S.errorText}>{errors.usp}</p>}
										</div>

										<div className={`${S.inputGroup} ${S.fullWidth}`}>
											<label className={S.inputLabel}>Business Model</label>
											<textarea
												rows={2}
												placeholder="How will you make money?"
												className={S.textareaField}
												value={formData.businessModel}
												onChange={(e) => handleInputChange("businessModel", e.target.value)}
											/>
											{errors.businessModel && <p className={S.errorText}>{errors.businessModel}</p>}
										</div>
									</div>
								)}

								{/* Step 2 - Team and Pitch Deck */}
								{step === 2 && (
									<div>
										{/* Leader Summary */}
										<label className={S.inputLabel} style={{ display: "block", marginBottom: "2.5vh" }}>Team Leader</label>
										<div className={S.leaderSummary}>
											<div className={S.summaryItem}>
												<span className={S.summaryLabel}>Name</span>
												<span className={S.summaryValue}>{formData.leaderName}</span>
											</div>
											<div className={S.summaryItem}>
												<span className={S.summaryLabel}>Email</span>
												<span className={S.summaryValue}>{formData.leaderEmail}</span>
											</div>
											<div className={S.summaryItem}>
												<span className={S.summaryLabel}>Phone</span>
												<span className={S.summaryValue}>{formData.leaderPhone}</span>
											</div>
											<div className={S.summaryItem}>
												<span className={S.summaryLabel}>College & Graduation</span>
												<span className={S.summaryValue}>{formData.leaderCollege} ({formData.leaderYear})</span>
											</div>
										</div>

										{/* Team Members List */}
										<label className={S.inputLabel} style={{ display: "block", marginBottom: "2.5vh" }}>Team Members</label>
										{teamMembers.map((member, index) => (
											<div key={index} className={S.teamMemberCard}>
												<div className={S.memberHeader}>
													<span className={S.memberTitle}>Member {index + 1}</span>
													{teamMembers.length > 1 && (
														<button className={S.removeBtn} onClick={() => removeTeamMember(index)}>
															<TrashIcon /> Remove
														</button>
													)}
												</div>

												<div className={S.formGrid}>
													<div className={S.inputGroup}>
														<label className={S.inputLabel}>Full Name</label>
														<input
															type="text"
															placeholder="Full name"
															className={S.inputField}
															value={member.name}
															onChange={(e) => handleMemberChange(index, "name", e.target.value)}
														/>
														{errors.teamMembers?.[index]?.name && <p className={S.errorText}>{errors.teamMembers[index].name}</p>}
													</div>

													<div className={S.inputGroup}>
														<label className={S.inputLabel}>Role</label>
														<input
															type="text"
															placeholder="Co-founder, CTO"
															className={S.inputField}
															value={member.role}
															onChange={(e) => handleMemberChange(index, "role", e.target.value)}
														/>
														{errors.teamMembers?.[index]?.role && <p className={S.errorText}>{errors.teamMembers[index].role}</p>}
													</div>

													<div className={S.inputGroup}>
														<label className={S.inputLabel}>LinkedIn URL</label>
														<input
															type="url"
															placeholder="linkedin.com/in/profile"
															className={S.inputField}
															value={member.linkedin}
															onChange={(e) => handleMemberChange(index, "linkedin", e.target.value)}
														/>
														{errors.teamMembers?.[index]?.linkedin && <p className={S.errorText}>{errors.teamMembers[index].linkedin}</p>}
													</div>

													<div className={S.inputGroup}>
														<label className={S.inputLabel}>College (Optional)</label>
														<input
															type="text"
															placeholder="College name"
															className={S.inputField}
															value={member.college}
															onChange={(e) => handleMemberChange(index, "college", e.target.value)}
														/>
													</div>

													<div className={`${S.inputGroup} ${S.fullWidth}`}>
														<label className={S.inputLabel}>Graduation Year (Optional)</label>
														<Dropdown
															options={yearOptions}
															value={member.year}
															onChange={(val) => handleMemberChange(index, "year", val)}
															placeholder="Select year"
														/>
													</div>
												</div>
											</div>
										))}

										<div style={{ marginBottom: "6vh" }}>
											<button className={S.secondaryBtn} onClick={addTeamMember}>
												+ Add Member
											</button>
										</div>

										{/* Pitch Deck */}
										<div className={S.inputGroup} style={{ marginBottom: "4vh" }}>
											<label className={S.inputLabel}>
												Pitch Deck <span style={{ color: "#898989", textTransform: "none", letterSpacing: "normal" }}>(Optional)</span>
											</label>

											<input
												type="file"
												ref={fileInputRef}
												accept="application/pdf"
												style={{ display: "none" }}
												onChange={handleFileChange}
											/>

											{pitchDeck ? (
												<div className={S.fileDetails}>
													<div className={S.fileInfo}>
														<span className={S.fileName}>{pitchDeck.name}</span>
														<span className={S.fileSize}>{(pitchDeck.size / (1024 * 1024)).toFixed(2)} MB</span>
													</div>
													<button className={S.removeBtn} onClick={removeFile}>
														Remove File
													</button>
												</div>
											) : (
												<div className={S.uploadZone} onClick={triggerUpload}>
													<div className={S.uploadIcon}>
														<UploadIcon />
													</div>
													<p className={S.uploadTitle}>Upload your pitch deck</p>
													<p className={S.uploadSubtitle}>PDF only · Max 10MB</p>
												</div>
											)}
											{pitchDeckError && <p className={S.errorText}>{pitchDeckError}</p>}
										</div>
									</div>
								)}

								{submitError && <p className={S.submitError}>{submitError}</p>}

								{/* Action Buttons */}
								<div style={{ display: "flex", gap: "2.5rem", justifyContent: "center", marginTop: "6vh", flexWrap: "wrap" }}>
									{step > 0 && (
										<div className={S.backButtonWrapper}>
											<Button
												use="credits"
												text="BACK"
												onClick={handleBack}
											/>
										</div>
									)}
									{step < 2 ? (
										<div className={S.nextButtonWrapper}>
											<Button
												use="credits"
												text="NEXT"
												onClick={handleNext}
											/>
										</div>
									) : (
										<div className={S.submitButtonWrapper}>
											<Button
												use="section-nine"
												text={submitting ? "SUBMITTING..." : "SUBMIT"}
												onClick={handleSubmit}
											/>
										</div>
									)}
								</div>
							</>
						)}
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Join;
