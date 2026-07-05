export interface FormData {
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderCollege: string;
  leaderYear: string;
  leaderLinkedin: string;
  leaderRole: string;
  startupName: string;
  stage: string;
  industry: string;
  problemStatement: string;
  solution: string;
  targetMarket: string;
  usp: string;
  businessModel: string;
}

export interface TeamMember {
  name: string;
  role: string;
  linkedin: string;
  college: string;
  year: string;
}

export async function submitApplication(
  formData: FormData,
  teamMembers: TeamMember[],
  pitchDeck: File | null
): Promise<void> {
  const data = new globalThis.FormData();

  data.append('leaderName', formData.leaderName);
  data.append('leaderEmail', formData.leaderEmail);
  data.append('leaderPhone', formData.leaderPhone);
  data.append('leaderCollege', formData.leaderCollege);
  data.append('leaderYear', formData.leaderYear);
  data.append('leaderLinkedin', formData.leaderLinkedin);
  data.append('leaderRole', formData.leaderRole);
  data.append('startupName', formData.startupName);
  data.append('stage', formData.stage);
  data.append('industry', formData.industry);
  data.append('problemStatement', formData.problemStatement);
  data.append('solution', formData.solution);
  data.append('targetMarket', formData.targetMarket);
  data.append('usp', formData.usp);
  data.append('businessModel', formData.businessModel);

  const validMembers = teamMembers.filter(
    m => m.name.trim() && m.role.trim() && m.linkedin.trim()
  );
  data.append('teamMembers', JSON.stringify(validMembers));

  if (pitchDeck) {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(pitchDeck);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
    data.append('pitchDeck', base64);
  }

  const ENDPOINT = import.meta.env.VITE_SUBMIT_ENDPOINT;

  const response = await fetch(ENDPOINT, { method: 'POST', body: data });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const result = await response.json();

  if (result.status !== 'success') {
    throw new Error(result.message || 'Submission failed');
  }
}
