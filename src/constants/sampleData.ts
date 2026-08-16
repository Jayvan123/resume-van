import { ResumeData } from '@/types/resume.types';

export const sampleResume: ResumeData = {
  personal: {
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary:
      'Results-driven Product Manager with 6+ years of experience in SaaS and B2B products. Led cross-functional teams to deliver 3 major product launches, driving 40% revenue growth. Expert in agile methodologies, user research, and go-to-market strategy.',
  },
  experience: [
    {
      id: 'exp-1',
      company: 'TechFlow Inc.',
      role: 'Senior Product Manager',
      dates: 'Jan 2021 - Present',
      description:
        '• Led product strategy for flagship platform serving 2M+ users\n' +
        '• Increased user engagement by 35% through feature optimization\n' +
        '• Managed roadmap and prioritized 100+ feature requests',
    },
    {
      id: 'exp-2',
      company: 'CloudSync Solutions',
      role: 'Product Manager',
      dates: 'Jun 2018 - Dec 2020',
      description:
        '• Launched 3 new products generating $5M annual revenue\n' +
        '• Conducted 200+ user interviews to inform product decisions\n' +
        '• Improved customer retention by 25% through UX improvements',
    },
  ],
  education: [
    {
      id: 'edu-1',
      school: 'Stanford University',
      degree: 'MBA, Product Management',
      dates: '2016 - 2018',
    },
    {
      id: 'edu-2',
      school: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      dates: '2012 - 2016',
    },
  ],
  skills: [
    'Product Strategy',
    'Agile / Scrum',
    'User Research',
    'Data Analysis',
    'SQL',
    'Figma',
    'JIRA',
  ],
  certifications: [
    'Certified Scrum Product Owner (CSPO)',
    'Google UX Design Certificate',
  ],
};
