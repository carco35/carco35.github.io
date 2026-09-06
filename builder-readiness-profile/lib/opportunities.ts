import type { Opportunity } from './types';

export const OPPORTUNITIES: Opportunity[] = [
  {
    slug: 'kiva-us',
    name: 'Kiva U.S.',
    link: 'https://www.kiva.org',
    description:
      "0% interest microloans up to $15,000. Uses 'social underwriting' — endorsements from people who trust you — instead of a credit score check.",
    eligibility:
      'Must be 18 or older. Not currently in bankruptcy or foreclosure. Business must be legal at the federal level. No minimum credit score required.',
    checklist: [
      'Be 18+',
      'Describe your business/venture clearly',
      'Recruit an initial group of supporters (friends/family) to kickstart lender interest',
      'Show a repayment plan',
    ],
  },
  {
    slug: 'nfte-youth-entrepreneurship-challenge',
    name: 'NFTE Youth Entrepreneurship Challenge',
    link: 'https://www.nfte.com',
    description:
      "Real seed funding (typically $250–$1,500+, sometimes more through partner programs), judged by real investors and entrepreneurs. Tied to NFTE's entrepreneurship courses, offered through many schools and community/afterschool programs.",
    eligibility:
      'Typically requires enrollment in an NFTE course or program (school or community-based). Competition tracks span roughly ages 13-22 depending on the specific challenge level.',
    checklist: [
      'Enroll in or complete an NFTE course if not already',
      'Prepare a business plan / venture concept',
      'Prepare a pitch presentation',
      'Check with a local NFTE program for current deadlines',
    ],
  },
  {
    slug: 'diamond-challenge',
    name: 'Diamond Challenge',
    link: 'https://diamondchallenge.org',
    description:
      'High school entrepreneurship competition run by Horn Entrepreneurship at the University of Delaware. Over $100,000 in total prizes across Business Innovation and Social Innovation tracks.',
    note: 'Prize amounts and deadlines shift by year — confirm current details on the official site before applying.',
    eligibility:
      'High school students ages 14-18 at the submission deadline. Teams of 2-4 students, plus one required adult advisor (age 21+).',
    checklist: [
      'Form a team of 2-4 eligible students',
      'Recruit an adult advisor (21+)',
      'Choose a track: Business or Social Innovation',
      'Prepare a written concept',
      'Prepare a short video pitch',
    ],
  },
  {
    slug: 'score',
    name: 'SCORE',
    link: 'https://www.score.org',
    description:
      'Free, one-on-one mentorship from experienced business volunteers, backed by the U.S. Small Business Administration. Not a funding source — useful for guidance before applying elsewhere.',
    eligibility: 'No stated age minimum. Open to anyone starting or growing a business.',
    checklist: [
      'Sign up for a free mentor match on score.org',
      'Prepare a short description of your business/idea to share with your mentor',
    ],
  },
];

export function getOpportunity(slug: string): Opportunity | undefined {
  return OPPORTUNITIES.find((o) => o.slug === slug);
}
