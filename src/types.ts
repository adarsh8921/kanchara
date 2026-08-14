import React from 'react';

export interface Product {
  id: string;
  product_id?: string | number;
  name: string;
  category: 'kits' | 'serums' | 'ayurveda' | 'nutrition';
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  badge: string;
  desc: string;
  iconComponent?: React.ReactNode;
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
    category: 'BIOMETRICS',
    title: 'Who is this clinical diagnostic assessment for?',
    subtitle: 'Hormonal patterns and hair follicle sensitivity vary significantly between genders.',
    options: [
      { text: '👨 Male', desc: 'Focus on hairline recession, crown thinning & DHT sensitivity' },
      { text: '👩 Female', desc: 'Focus on central parting line, diffuse loss & iron/hormonal balance' }
    ]
  },
  {
    id: 'concern',
    category: 'SCALP ANALYSIS',
    title: 'What is your primary hair loss pattern or concern?',
    subtitle: 'Identifying the exact pattern helps map follicle dormancy stages.',
    options: [
      { text: 'Widening Scalp Partition / Density Loss', desc: 'Noticeable scalp visibility under lighting' },
      { text: 'Receding Hairline & M-Shaped Temples', desc: 'Frontal hairline moving backward' },
      { text: 'Excessive Shedding During Comb / Shower', desc: 'More than 100+ strands falling daily' },
      { text: 'Patchy Loss / Sudden Spot Baldness', desc: 'Isolated localized circular bare patches' }
    ]
  },
  {
    id: 'duration',
    category: 'CHRONICITY',
    title: 'How long have you been experiencing active hair loss?',
    subtitle: 'Determines follicle viability and potential for complete hair restoration.',
    options: [
      { text: 'Early Stage (< 6 Months)', desc: '98% Follicle Reversibility potential' },
      { text: 'Moderate (6 Months to 2 Years)', desc: '92% Follicle Reversibility potential' },
      { text: 'Advanced (2 Years to 5 Years)', desc: '84% Follicle Reversibility potential' },
      { text: 'Long Term (> 5 Years)', desc: 'Requires high-potency multi-science system' }
    ]
  },
  {
    id: 'scalp_type',
    category: 'SCALP MICROBIOME',
    title: 'How would you describe your scalp environment & health?',
    subtitle: 'Sebum buildup and inflammation block topical absorption.',
    options: [
      { text: 'Oily & Sebum Heavy', desc: 'Greasy scalp requiring frequent washing & detox' },
      { text: 'Dry & Flaky / Dandruff', desc: 'Itchy scalp with visible white or yellow flakes' },
      { text: 'Sensitive / Redness', desc: 'Scalp tenderness or frequent heat bumps' },
      { text: 'Normal & Balanced', desc: 'No major scalp oiliness or irritation' }
    ]
  },
  {
    id: 'genetics',
    category: 'GENETIC DHT SUSCEPTIBILITY',
    title: 'Is there a family history of hair loss or premature thinning?',
    subtitle: 'Genetics dictate 5-alpha reductase enzyme activity levels in the scalp.',
    options: [
      { text: 'Father or Paternal Relatives', desc: 'Strong genetic DHT sensitivity pattern' },
      { text: 'Mother or Maternal Relatives', desc: 'Maternal thinning gene inheritance' },
      { text: 'Both Sides of Family', desc: 'High genetic predisposition requiring early DHT control' },
      { text: 'No Family History', desc: 'Likely lifestyle, nutritional, or stress induced' }
    ]
  },
  {
    id: 'digestion',
    category: 'AYURVEDIC GUT METABOLISM',
    title: 'How is your daily digestion, acidity, or metabolic health?',
    subtitle: 'Ayurveda proves gut Ama toxins impair hair root nutrient absorption.',
    options: [
      { text: 'Frequent Acidity / Body Heat (Pitta Dosha)', desc: 'Internal heat burning hair root nutrients' },
      { text: 'Bloating & Irritable Digestion', desc: 'Poor micronutrient breakdown & absorption' },
      { text: 'Constipation / Sluggish Metabolism', desc: 'Ama metabolic waste accumulation' },
      { text: 'Good Digestion & Gut Health', desc: 'Balanced digestive fire (Agni)' }
    ]
  },
  {
    id: 'lifestyle',
    category: 'LIFESTYLE & STRESS',
    title: 'What are your average daily stress and sleep levels?',
    subtitle: 'Cortisol spikes trigger telogen effluvium and premature follicle shutdown.',
    options: [
      { text: 'High Stress & Irregular Sleep (< 6 hrs)', desc: 'Elevated cortisol levels damaging hair roots' },
      { text: 'Moderate Work Stress / Variable Sleep', desc: 'Occasional stress spikes' },
      { text: 'Low Stress & Sound 7-8 hrs Sleep', desc: 'Optimal recovery state' }
    ]
  }
];
