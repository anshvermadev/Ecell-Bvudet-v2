import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import gsap from 'gsap';
import splitting from 'splitting';
import LocomotiveScroll from 'locomotive-scroll';
import S from './MentorOnboarding.module.scss';
import Nav from '../../components/Nav/Nav';
import Button from '../../components/Button/Button';
import { PageProps } from '../page.types';
import { submitMentor, MentorFormData } from '../../utils/submitMentor';
import { FaUpload, FaCheck, FaArrowRight } from 'react-icons/fa6';

const industryOptions = [
  "Fintech", "EdTech", "AI / ML", "D2C", "SaaS", 
  "Healthcare", "Manufacturing", "Media", "Other"
];

const expertiseOptions = [
  "Fundraising", "Marketing", "Product", "Legal / Compliance",
  "Tech / Product Dev", "Operations", "HR", "Branding",
  "Sales", "GTM Strategy", "Other"
];

const stageOptions = [
  "Idea Stage", "MVP", "Early Revenue", "Scaling"
];

const MentorOnboarding: React.FC<PageProps> = ({
  appLoaded,
  preloaded,
  navOnClick,
  windowWidth,
  setAppLoaded,
}) => {
  const scrollRef = useRef(null);
  const [scroll, setScroll] = useState<any>();
  const [formData, setFormData] = useState<MentorFormData>(() => {
    const saved = localStorage.getItem('mentorFormData');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: '', email: '', phone: '', linkedin: '', designation: '', company: '', location: '',
      experience: '', industry: '', expertise: '', pastExperience: '', achievements: '',
      mode: '', availability: '', timeCommitment: '', startupCount: '', startupStage: '',
      whyMentor: '', pastMentorship: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('mentorFormData', JSON.stringify(formData));
  }, [formData]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Image Cropping State
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25
  });
  const [completedCropBase64, setCompletedCropBase64] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navRef = useRef(null);

  useEffect(() => {
    if (preloaded) {
      setAppLoaded(true);
    }
  }, [preloaded]);

  useEffect(() => {
    if (preloaded && !scroll) {
      setScroll(
        new LocomotiveScroll({
          smooth: true,
          el: scrollRef.current,
          tablet: { smooth: true },
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
      const delay = windowWidth && windowWidth <= 1024 ? 0.8 : 0.5;
      setTimeout(() => {
        scroll.start();
        setAppLoaded(true);
      }, !appLoaded ? 0 : delay);
    }
    return () => scroll && scroll.destroy();
  }, [scroll, preloaded, windowWidth, appLoaded, setAppLoaded]);

  useEffect(() => {
    if (preloaded && scrollRef.current) {
      splitting({ by: "words", target: "#mentor-page .split-text" });
      const delay = appLoaded ? 2.5 : 0;
      const scope = gsap.utils.selector(scrollRef.current);
      gsap.set(scope(".hidden-init"), { visibility: "visible" });

      gsap.from(scope(".split-text .word, .whitespace"), {
        delay: 0.25 + delay,
        duration: 1.5,
        opacity: 0,
        yPercent: 100,
        stagger: 0.05,
        ease: "power3.out",
      });
      gsap.to(scope(`.${S.animateOpacity}`), {
        delay: 1 + delay,
        duration: 1.25,
        opacity: 1,
        stagger: 0.05,
        ease: "power2.out",
      });
    }
  }, [preloaded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxMulti = (field: 'expertise' | 'industry', value: string) => {
    const current = formData[field] ? formData[field].split(', ') : [];
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter(v => v !== value).join(', ') });
    } else {
      setFormData({ ...formData, [field]: [...current, value].join(', ') });
    }
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
        setIsCropModalOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const generateCroppedImage = useCallback(() => {
    if (!imgRef.current || !crop.width || !crop.height) return;
    const canvas = document.createElement('canvas');
    const image = imgRef.current;
    
    // Calculate scaling because image might be displayed smaller than original
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      setCompletedCropBase64(canvas.toDataURL('image/jpeg'));
      setIsCropModalOpen(false);
    }
  }, [crop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completedCropBase64) {
      setErrorMsg('Please upload and crop your profile photo.');
      setSubmitStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMsg('');

    try {
      await submitMentor(formData, completedCropBase64);
      setSubmitStatus('success');
      localStorage.removeItem('mentorFormData');
    } catch (err: any) {
      setSubmitStatus('error');
      setErrorMsg(err.message || 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvalid = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stop native HTML5 popup since LocomotiveScroll breaks it
    const form = e.currentTarget;
    const allInvalids = Array.from(form.querySelectorAll(':invalid')) as HTMLElement[];
    
    // Highlight all invalid fields with a red warning
    allInvalids.forEach(invalidEl => {
      const group = invalidEl.closest(`.${S.inputGroup}`) || invalidEl.closest(`.${S.radioGroup}`) || invalidEl.closest(`.${S.fileUploadSection}`);
      if (group) {
        group.classList.add(S.hasError);
        
        const clearError = () => {
          group.classList.remove(S.hasError);
          invalidEl.removeEventListener('input', clearError);
          invalidEl.removeEventListener('change', clearError);
        };
        invalidEl.addEventListener('input', clearError);
        invalidEl.addEventListener('change', clearError);
      }
    });

    // Only trigger scroll and error for the first invalid element to avoid multiple calls
    if (allInvalids.length > 0 && e.target === allInvalids[0]) {
      const firstInvalid = allInvalids[0] as HTMLElement;
      
      // Find the closest wrapper to scroll to for better context
      const group = firstInvalid.closest(`.${S.inputGroup}`) || firstInvalid.closest(`.${S.radioGroup}`) || firstInvalid;
      
      if (scroll) {
        scroll.scrollTo(group, { offset: -150, duration: 800 });
      }
      
      setErrorMsg('Please fill out all required fields marked in red.');
      setSubmitStatus('error');
    }
  };

	useEffect(() => {
		if (submitStatus === 'success') {
			const tl = gsap.timeline();
			tl.to('.success-container', { opacity: 1, duration: 0.5 })
			  .to('.success-icon', { scale: 1, ease: 'back.out(1.5)', duration: 0.6 })
			  .to('.success-title', { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
			  .to('.success-text', { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
			
			if (scroll) {
				setTimeout(() => scroll.update(), 100);
			}
		}
	}, [submitStatus, scroll]);  return (
    <div id="mentor-page" ref={scrollRef}>
      <Nav ref={navRef} onClick={navOnClick} />
      <section className={S.section} data-scroll-section>
        <div id="mentor-hero" className={S.hero}>
          <h1 className={`${S.headline} split-text hidden-init`}>MENTOR NETWORK</h1>
          <p className={`${S.subtitle} split-text hidden-init`}>Join the Ecosystem</p>
          <p className={`${S.description} ${S.animateOpacity} hidden-init`}>
            Thank you for supporting student entrepreneurs. Please fill in your details below to join our exclusive mentor network.
          </p>
          {submitStatus !== 'success' && (
            <div 
              className={`${S.scrollArrowContainer} ${S.animateOpacity} hidden-init`} 
              style={{ marginTop: '8vh', cursor: 'pointer' }}
              onClick={() => {
                if (scroll) {
                  scroll.scrollTo(document.querySelector(`form`), { duration: 800, offset: -100 });
                }
              }}
            >
              <FaArrowRight />
            </div>
          )}
        </div>

        {submitStatus === 'success' ? (
          <div className={`${S.formSection} success-container`} style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0, textAlign: 'center' }}>
             <div className="success-icon" style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ff4040', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', transform: 'scale(0)' }}>
                <FaCheck size={40} color="#fff" />
             </div>
             <h2 className="success-title" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#fff', opacity: 0, transform: 'translateY(20px)' }}>Thank You!</h2>
             <p className="success-text" style={{ fontSize: '1.2rem', color: '#ddd', opacity: 0, transform: 'translateY(20px)' }}>Your mentor application has been successfully submitted.<br/>We will be in touch shortly.</p>
          </div>
        ) : (
        <form onSubmit={handleSubmit} onInvalid={handleInvalid} className={S.formSection}>
          <div className={S.formContainer}>
            {/* Context Sidebar */}
            <div className={S.formContext}>
              <div className={S.stickyContext}>
                <div className={S.stepMeta}>
                  <span className={S.stepNumber}>01</span>
                  <span className={S.stepTotal}>/ 04</span>
                </div>
                <h3 className={S.formContextTitle}>Basic Details</h3>
              </div>
            </div>

            <div className={S.formGrid}>
              <div className={S.inputGroup}>
                <label className={S.inputLabel}>Full Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder=" " className={S.inputField} />
              </div>
              <div className={S.inputGroup}>
                <label className={S.inputLabel}>Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder=" " className={S.inputField} />
              </div>
              <div className={S.inputGroup}>
                <label className={S.inputLabel}>Phone Number (WhatsApp) *</label>
                <input required type="tel" pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number" name="phone" value={formData.phone} onChange={handleChange} placeholder=" " className={S.inputField} />
              </div>
              <div className={S.inputGroup}>
                <label className={S.inputLabel}>LinkedIn Profile URL *</label>
                <input required type="url" pattern="https://.*linkedin.com/.*" title="Must be a valid LinkedIn URL starting with https://www.linkedin.com/" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder=" " className={S.inputField} />
              </div>
              <div className={S.inputGroup}>
                <label className={S.inputLabel}>Current Designation / Job Title *</label>
                <input required type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder=" " className={S.inputField} />
              </div>
              <div className={S.inputGroup}>
                <label className={S.inputLabel}>Organization / Company Name *</label>
                <input required type="text" name="company" value={formData.company} onChange={handleChange} placeholder=" " className={S.inputField} />
              </div>
              <div className={`${S.inputGroup} ${S.fullWidth}`}>
                <label className={S.inputLabel}>City / Location *</label>
                <input required type="text" name="location" value={formData.location} onChange={handleChange} placeholder=" " className={S.inputField} />
              </div>
            </div>
          </div>

          <div className={S.formContainer} style={{ marginTop: '8vh' }}>
            <div className={S.formContext}>
              <div className={S.stickyContext}>
                <div className={S.stepMeta}>
                  <span className={S.stepNumber}>02</span>
                  <span className={S.stepTotal}>/ 04</span>
                </div>
                <h3 className={S.formContextTitle}>Professional Background</h3>
              </div>
            </div>

            <div className={S.formGrid}>
              <div className={`${S.inputGroup} ${S.fullWidth}`}>
                <label className={S.inputLabel}>Total Years of Experience *</label>
                <input required type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder=" " className={S.inputField} />
              </div>

              <div className={`${S.radioGroup} ${S.fullWidth}`}>
                <label className={S.groupLabel}>Industry / Domain * (Select all that apply)</label>
                <div className={S.radioGrid}>
                  {industryOptions.map(ind => (
                    <label key={ind} className={S.checkboxOption}>
                      <input 
                        type="checkbox" 
                        checked={formData.industry.includes(ind)} 
                        onChange={() => handleCheckboxMulti('industry', ind)} 
                      />
                      <span className={S.checkboxCustom}><FaCheck className={S.checkIcon}/></span>
                      {ind}
                    </label>
                  ))}
                </div>
              </div>

              <div className={`${S.radioGroup} ${S.fullWidth}`}>
                <label className={S.groupLabel}>Areas of Expertise (Select all that apply) *</label>
                <div className={S.radioGrid}>
                  {expertiseOptions.map(exp => (
                    <label key={exp} className={S.checkboxOption}>
                      <input 
                        type="checkbox" 
                        checked={formData.expertise.includes(exp)} 
                        onChange={() => handleCheckboxMulti('expertise', exp)} 
                      />
                      <span className={S.checkboxCustom}><FaCheck className={S.checkIcon}/></span>
                      {exp}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className={`${S.inputGroup} ${S.fullWidth}`}>
                <label className={S.inputLabel}>Past Startup / Entrepreneurial Experience (if any)</label>
                <textarea name="pastExperience" value={formData.pastExperience} onChange={handleChange} placeholder=" " className={S.textareaField} rows={3} />
              </div>
              
              <div className={`${S.inputGroup} ${S.fullWidth}`}>
                <label className={S.inputLabel}>Notable Achievements / Brief Bio</label>
                <textarea name="achievements" value={formData.achievements} onChange={handleChange} placeholder=" " className={S.textareaField} rows={3} />
              </div>
            </div>
          </div>

          <div className={S.formContainer} style={{ marginTop: '8vh' }}>
            <div className={S.formContext}>
              <div className={S.stickyContext}>
                <div className={S.stepMeta}>
                  <span className={S.stepNumber}>03</span>
                  <span className={S.stepTotal}>/ 04</span>
                </div>
                <h3 className={S.formContextTitle}>Mentorship Preferences</h3>
              </div>
            </div>

            <div className={S.formGrid}>
              <div className={`${S.radioGroup} ${S.fullWidth}`}>
                <label className={S.groupLabel}>Preferred Mode *</label>
                <div className={S.radioGrid}>
                  {['Online', 'Offline', 'Hybrid'].map(mode => (
                    <label key={mode} className={S.radioOption}>
                      <input type="radio" name="mode" value={mode} onChange={handleChange} required />
                      <span className={S.radioCustom}></span>
                      {mode}
                    </label>
                  ))}
                </div>
              </div>

              <div className={`${S.radioGroup} ${S.fullWidth}`}>
                <label className={S.groupLabel}>Availability *</label>
                <div className={S.radioGrid}>
                  {['Weekdays', 'Weekends', 'Both'].map(avail => (
                    <label key={avail} className={S.radioOption}>
                      <input type="radio" name="availability" value={avail} onChange={handleChange} required />
                      <span className={S.radioCustom}></span>
                      {avail}
                    </label>
                  ))}
                </div>
              </div>

              <div className={`${S.inputGroup} ${S.fullWidth}`}>
                <label className={S.inputLabel}>Time Commitment (hours/week) *</label>
                <select required name="timeCommitment" value={formData.timeCommitment} onChange={handleChange} className={S.inputField} style={{ background: 'transparent', color: formData.timeCommitment ? '#fff' : '#888' }}>
                  <option value="" disabled>Select hours per week</option>
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                  <option value="3 hours">3 hours</option>
                  <option value="4 hours">4 hours</option>
                  <option value="5+ hours">5+ hours</option>
                </select>
              </div>

              <div className={`${S.radioGroup} ${S.fullWidth}`}>
                <label className={S.groupLabel}>Number of Startups / Teams Willing to Mentor *</label>
                <div className={S.radioGrid}>
                  {['1', '2-3', 'More than 3'].map(cnt => (
                    <label key={cnt} className={S.radioOption}>
                      <input type="radio" name="startupCount" value={cnt} onChange={handleChange} required />
                      <span className={S.radioCustom}></span>
                      {cnt}
                    </label>
                  ))}
                </div>
              </div>

              <div className={`${S.radioGroup} ${S.fullWidth}`}>
                <label className={S.groupLabel}>Preferred Stage of Startups *</label>
                <div className={S.radioGrid}>
                  {stageOptions.map(stage => (
                    <label key={stage} className={S.radioOption}>
                      <input type="radio" name="startupStage" value={stage} onChange={handleChange} required />
                      <span className={S.radioCustom}></span>
                      {stage}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={S.formContainer} style={{ marginTop: '8vh' }}>
            <div className={S.formContext}>
              <div className={S.stickyContext}>
                <div className={S.stepMeta}>
                  <span className={S.stepNumber}>04</span>
                  <span className={S.stepTotal}>/ 04</span>
                </div>
                <h3 className={S.formContextTitle}>Additional Information</h3>
              </div>
            </div>

            <div className={S.formGrid}>
              <div className={`${S.inputGroup} ${S.fullWidth}`}>
                <label className={S.inputLabel}>Why do you want to mentor with us? *</label>
                <textarea required name="whyMentor" value={formData.whyMentor} onChange={handleChange} placeholder=" " className={S.textareaField} rows={3} />
              </div>
              <div className={`${S.inputGroup} ${S.fullWidth}`}>
                <label className={S.inputLabel}>Any past mentorship experience?</label>
                <textarea name="pastMentorship" value={formData.pastMentorship} onChange={handleChange} placeholder=" " className={S.textareaField} rows={3} />
              </div>

              {/* Profile Photo Upload */}
              <div className={`${S.fileUploadSection} ${S.fullWidth}`}>
                <label className={S.groupLabel}>Profile Photo (Crop enabled) *</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={onSelectFile} 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                />
                
                {!completedCropBase64 ? (
                  <div className={S.uploadArea} onClick={() => fileInputRef.current?.click()}>
                    <FaUpload className={S.uploadIcon} />
                    <p>Click to upload photo</p>
                  </div>
                ) : (
                  <div className={S.uploadArea} style={{ borderColor: '#ff4040' }}>
                    <img src={completedCropBase64} alt="Cropped preview" style={{ maxHeight: '150px', margin: '1rem 0' }} />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="button" onClick={() => fileInputRef.current?.click()} className={S.addButton}>Change Photo</button>
                      <button type="button" onClick={() => setCompletedCropBase64(null)} className={S.removeButton}>Remove</button>
                    </div>
                  </div>
                )}
              </div>

              <div className={`${S.radioGroup} ${S.fullWidth}`} style={{ marginTop: '2rem' }}>
                <label className={S.checkboxOption}>
                  <input type="checkbox" required />
                  <span className={S.checkboxCustom}><FaCheck className={S.checkIcon}/></span>
                  <span style={{color: '#ddd', fontSize: '0.9rem'}}>I consent to E-Cell storing and using the above information for mentor-matching purposes. *</span>
                </label>
              </div>
            </div>
          </div>
          
          {submitStatus === 'error' && (
            <div className={S.errorMsg} style={{ color: 'red', marginTop: '2rem', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <div className={S.submitSection} style={{ opacity: isSubmitting ? 0.7 : 1, pointerEvents: isSubmitting ? 'none' : 'auto', display: 'flex', justifyContent: 'center', marginTop: '10vh' }}>
            <button type="submit" disabled={isSubmitting} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
               {isSubmitting ? (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff', fontSize: '1.2rem', padding: '1rem 2rem', background: '#333', borderRadius: '30px' }}>
                   <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                   Saving Data...
                 </div>
               ) : (
                 <Button use="credits" text="SUBMIT APPLICATION" />
               )}
            </button>
          </div>
        </form>
        )}
      </section>

      {/* Image Cropping Modal */}
      {isCropModalOpen && (
        <div className={S.cropModal}>
          <h2 style={{ marginBottom: '1rem', color: '#fff' }}>Crop Profile Photo</h2>
          <div className={S.cropContainer}>
            <ReactCrop 
              crop={crop} 
              onChange={c => setCrop(c)}
              aspect={1}
              ruleOfThirds
            >
              <img ref={imgRef} src={imgSrc} alt="Crop me" style={{ maxWidth: '100%', maxHeight: '60vh' }} />
            </ReactCrop>
          </div>
          <div className={S.cropActions}>
            <button onClick={() => setIsCropModalOpen(false)} style={{ padding: '0.5rem 1rem', background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}>Cancel</button>
            <button onClick={generateCroppedImage} style={{ padding: '0.5rem 1rem', background: '#ff4040', color: '#fff', border: 'none', cursor: 'pointer' }}>Apply Crop</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorOnboarding;
