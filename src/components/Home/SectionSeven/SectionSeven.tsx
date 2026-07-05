import React, { useState } from "react";
import { createPortal } from "react-dom";
import Marquee from "react-fast-marquee";
import S from "./SectionSeven.module.scss";

type SectionSevenProps = {
	windowWidth: number;
};

const mentors = [
	{
		name: "Dr. John Doe",
		email: "john.doe@example.com",
		phone: "+91 9876543210",
		days: "Mon, Wed, Fri",
		grants: "₹5,000,000",
		description: "Expert in Fintech and scaling startups from 0 to 1.",
	},
	{
		name: "Jane Smith",
		email: "jane.smith@example.com",
		phone: "+91 9123456789",
		days: "Tue, Thu",
		grants: "₹2,500,000",
		description: "Marketing guru with 15+ years experience in global brands.",
	},
	{
		name: "Rajiv Kumar",
		email: "rajiv.kumar@example.com",
		phone: "+91 9988776655",
		days: "Sat, Sun",
		grants: "₹10,000,000",
		description: "Angel investor and tech pioneer specializing in AI/ML.",
	},
	{
		name: "Dr. Emily Chen",
		email: "emily.chen@example.com",
		phone: "+91 9777555333",
		days: "Wed, Fri",
		grants: "₹7,500,000",
		description: "Product strategist focusing on clean energy and sustainability.",
	}
];

const SectionSeven: React.FC<SectionSevenProps> = ({ windowWidth }) => {
	const [activeRow, setActiveRow] = useState<number | null>(null);
	const [selectedMentor, setSelectedMentor] = useState<any>(null);

	return (
		<section data-scroll-section>
			<div className={S.section}>
				<div className={S.marqueeSection}>
					<Marquee
						pauseOnHover
						gradient={false}
						className={S.marquee}
						speed={windowWidth > 1024 ? 15 : 80}
					>
						<p className={S.marqueeText}>Our Mentors</p>
						<p className={S.marqueeText}>Our Mentors</p>
						<p className={S.marqueeText}>Our Mentors</p>
						<p className={S.marqueeText}>Our Mentors</p>
					</Marquee>
				</div>
				<div className={S.main}>
					<div className={S.header}>
						<p className={S.largeText}>Meet Our Mentors</p>
						<p className={S.smallText}>
							Connect with experienced industry leaders who are ready to guide you, offer grants, and help you build the next big thing.
						</p>
					</div>

					<div className={S.list}>
						{mentors.map((mentor, idx) => (
							<div
								key={idx}
								className={S.row}
								onMouseEnter={() => setActiveRow(idx)}
								onMouseLeave={() => setActiveRow(null)}
								onClick={() => setSelectedMentor(mentor)}
							>
								<div className={S.rowHeader}>
									<p className={S.eventName}>{mentor.name}</p>
									<p className={S.eventMeta}>
										AVAILABLE: {mentor.days}
									</p>
									<p className={S.eventLocation}>GRANTS: {mentor.grants}</p>
								</div>
								<div
									className={`${S.rowBody} ${
										activeRow === idx ? S.rowBodyActive : ""
									}`}
								>
									<p className={S.description}>{mentor.description}</p>
									<span className={S.clickPrompt}>Click for more details</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{selectedMentor && createPortal(
					<div className={S.modalOverlay} onClick={() => setSelectedMentor(null)}>
						<div className={S.modalContent} onClick={(e) => e.stopPropagation()}>
							<button className={S.closeButton} onClick={() => setSelectedMentor(null)}>&times;</button>
							<h3 className={S.modalName}>{selectedMentor.name}</h3>
							<p className={S.modalDesc}>{selectedMentor.description}</p>
							
							<div className={S.modalDetails}>
								<div className={S.detailRow}>
									<span className={S.detailLabel}>Email:</span>
									<span className={S.detailValue}>{selectedMentor.email}</span>
								</div>
								<div className={S.detailRow}>
									<span className={S.detailLabel}>Phone:</span>
									<span className={S.detailValue}>{selectedMentor.phone}</span>
								</div>
								<div className={S.detailRow}>
									<span className={S.detailLabel}>Available Days:</span>
									<span className={S.detailValue}>{selectedMentor.days}</span>
								</div>
								<div className={S.detailRow}>
									<span className={S.detailLabel}>Grants:</span>
									<span className={S.detailValue}>{selectedMentor.grants}</span>
								</div>
							</div>
						</div>
					</div>,
					document.body
				)}
			</div>
		</section>
	);
};
export default SectionSeven;
