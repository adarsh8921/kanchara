import React from 'react';

export interface Product {
  id: string;
  name: string;
  category: 'kits' | 'serums' | 'ayurveda' | 'nutrition';
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  badge: string;
  desc: string;
  iconComponent: React.ReactNode;
}

export const stageData: Record<number, { title: string; desc: string; rev: string; plan: string }> = {
  1: {
    title: 'Stage 1: Subtle Hair Density Loss',
    desc: 'Slight reduction in hair volume near crown and forehead with early hair shaft weakening.',
    rev: '98% Reversibility',
    plan: 'KANCHARA Root Fortifier & Vitality Kit'
  },
  2: {
    title: 'Stage 2: M-Shaped Receding Hairline & Crown Thinning',
    desc: 'Visible recession at the temples or widening scalp partition under direct overhead light.',
    rev: '92% Reversibility',
    plan: 'KANCHARA 3-Science Hair Regrowth System'
  },
  3: {
    title: 'Stage 3: Deep Recession & Visible Scalp Gaps',
    desc: 'Noticeable thinning across vertex with dormant hair follicles requiring active bloodflow revival.',
    rev: '84% Reversibility',
    plan: 'KANCHARA Intense Follicle Reactivation Plan'
  },
  4: {
    title: 'Stage 4: Advanced Pattern Loss',
    desc: 'Connected thinning between crown and hairline. Requires high-potency dermatological & Ayurvedic focus.',
    rev: '72% Reversibility',
    plan: 'KANCHARA Maximum Support Prescription'
  },
  5: {
    title: 'Stage 5: Extensive Hair Loss',
    desc: 'Significant follicle dormancy requiring comprehensive internal metabolic restoration and intensive topicals.',
    rev: '58% Reversibility',
    plan: 'KANCHARA Advanced Root Rescue System'
  }
};

export const quizQuestions = [
  {
    id: 'gender',
    title: 'Who is this hair assessment for?',
    options: ['👨 Male (Hairline, Crown & Density)', '👩 Female (Parting Line & Thinning)']
  },
  {
    id: 'concern',
    title: 'What is your primary hair concern right now?',
    options: ['Widening scalp partition / Thinning', 'Receding hairline & temple loss', 'Excessive hair fall during wash/comb', 'Patchy / Sudden hair loss spot']
  },
  {
    id: 'duration',
    title: 'How long have you been observing hair fall?',
    options: ['Recent (< 6 months)', '6 months to 2 years', '2 years to 5 years', 'Long term (> 5 years)']
  },
  {
    id: 'lifestyle',
    title: 'Do you regularly face high stress, poor sleep, or digestive issues?',
    options: ['Yes, severe stress or gut issues', 'Moderate stress / Occasional digestion', 'No, healthy sleep & digestion']
  }
];
