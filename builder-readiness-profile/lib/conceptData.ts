import type { ReadinessTier } from './types';

export interface FakeBorrower {
  id: string;
  sampleName: string;
  loanPurpose: string;
  story: string;
  trustTier: ReadinessTier;
  requestedAmount: number;
  suggestedTerms: string;
  initialFundedAmount: number;
}

// All entries below are entirely fictional sample data for the Peer Trust
// Lending concept demo. No real people, requests, or funds.
export const FAKE_BORROWERS: FakeBorrower[] = [
  {
    id: 'sample-maria',
    sampleName: "Sample Profile: \"Maria R.\"",
    loanPurpose: 'Inventory for a weekend pop-up bakery',
    story:
      "Fictional scenario: Maria has run a pop-up bakery at her local farmers market for two seasons and wants to buy an oven that can handle bigger batches. Her plan is to repay the loan from the next four months of weekend sales, which have covered ingredient costs consistently so far.",
    trustTier: 'Ready to Pursue Funding',
    requestedAmount: 1200,
    suggestedTerms: '12 months, 0% interest (peer-funded)',
    initialFundedAmount: 480,
  },
  {
    id: 'sample-devon',
    sampleName: 'Sample Profile: "Devon T."',
    loanPurpose: 'Laptop for freelance video editing',
    story:
      "Fictional scenario: Devon has been editing videos for two small local businesses on a borrowed laptop that keeps crashing mid-render. He's requesting funds for a reliable machine and plans to repay from upcoming client invoices already scheduled over the next two months.",
    trustTier: 'Building Momentum',
    requestedAmount: 900,
    suggestedTerms: '8 months, 0% interest (peer-funded)',
    initialFundedAmount: 150,
  },
  {
    id: 'sample-priya',
    sampleName: 'Sample Profile: "Priya K."',
    loanPurpose: 'Booth fee and materials for a craft fair season',
    story:
      "Fictional scenario: Priya makes handmade jewelry and has sold out at two small local events. She's requesting funds to cover booth fees and materials for a full fall fair season, planning to repay from booth sales as each event wraps.",
    trustTier: 'Strong Track Record',
    requestedAmount: 650,
    suggestedTerms: '6 months, 0% interest (peer-funded)',
    initialFundedAmount: 610,
  },
  {
    id: 'sample-jordan',
    sampleName: 'Sample Profile: "Jordan A."',
    loanPurpose: 'Domain, hosting, and first month of ads for a tutoring site',
    story:
      "Fictional scenario: Jordan tutors math for classmates informally and wants to launch a small website to take bookings and payments more easily. This would be his first time charging formally, so his track record here is thinner than the other sample profiles.",
    trustTier: 'Just Starting',
    requestedAmount: 300,
    suggestedTerms: '4 months, 0% interest (peer-funded)',
    initialFundedAmount: 40,
  },
  {
    id: 'sample-elena',
    sampleName: 'Sample Profile: "Elena V."',
    loanPurpose: 'Bulk supplies for a school fundraiser candle business',
    story:
      "Fictional scenario: Elena started making and selling candles to fund her school's robotics club. She's requesting funds to buy wax and jars in bulk at a better price, planning to repay from a pre-order list she's already collected from teachers and classmates.",
    trustTier: 'Building Momentum',
    requestedAmount: 500,
    suggestedTerms: '5 months, 0% interest (peer-funded)',
    initialFundedAmount: 260,
  },
];
