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
  // PART 1 — YOU
  {
    id: 'age',
    category: 'PART 1 — YOU',
    title: '1. How old are you?',
    subtitle: 'Age helps determine hormonal baseline and follicular metabolism.',
    options: [
      { text: '18–24', desc: 'Young adult baseline & active cell renewal phase' },
      { text: '25–34', desc: 'Peak career stress & early DHT sensitivity period' },
      { text: '35–44', desc: 'Hormonal shift & metabolism stabilization phase' },
      { text: '45–54', desc: 'Mature follicle care & scalp hydration phase' },
      { text: '55+', desc: 'Intense root nourishment & density retention focus' }
    ]
  },
  {
    id: 'gender',
    category: 'PART 1 — YOU',
    title: '2. How do you identify?',
    subtitle: 'Hormonal patterns and hair follicle sensitivity vary between genders.',
    options: [
      { text: 'Male', desc: 'Focus on hairline recession, crown thinning & DHT control' },
      { text: 'Female', desc: 'Focus on parting line, diffuse thinning & iron balance' },
      { text: 'Prefer not to say', desc: 'Comprehensive hair root & scalp wellness assessment' }
    ]
  },
  {
    id: 'primary_concern',
    category: 'PART 1 — YOU',
    title: '3. What is your primary hair concern?',
    subtitle: 'Select the primary issue affecting your confidence and scalp health.',
    options: [
      { text: 'Hair fall', desc: 'Excessive daily strand shedding in shower or comb' },
      { text: 'Hair thinning', desc: 'Reduced strand volume and scalp becoming visible' },
      { text: 'Hair breakage', desc: 'Strands snapping midway due to weak Keratin bonds' },
      { text: 'Dandruff', desc: 'Scalp flaking, itchiness or fungal imbalance' },
      { text: 'Dry/scalp dryness', desc: 'Lack of sebum nourishment leading to brittle roots' },
      { text: 'Oily scalp', desc: 'Excessive sebum blocking hair root micro-circulation' },
      { text: 'Slow-looking hair growth', desc: 'Hair stuck in prolonged dormant resting phase' },
      { text: 'Premature greying', desc: 'Early loss of melanin pigment at the hair root' },
      { text: 'Multiple concerns', desc: 'Combination of shedding, thinning & scalp imbalance' },
      { text: 'Other', desc: 'Specific scalp or hair texture issue' }
    ]
  },

  // PART 2 — YOUR HAIR
  {
    id: 'concern_duration',
    category: 'PART 2 — YOUR HAIR',
    title: '4. How long have you been experiencing your main hair concern?',
    subtitle: 'Chronicity determines follicle viability and restoration speed.',
    options: [
      { text: 'Less than 1 month', desc: 'Acute onset with maximum follicle reversal rate' },
      { text: '1–3 months', desc: 'Recent shedding phase (Telogen Effluvium window)' },
      { text: '3–6 months', desc: 'Sub-acute phase needing active root fortification' },
      { text: '6–12 months', desc: 'Progressive thinning phase requiring 3-Science care' },
      { text: 'More than 1 year', desc: 'Chronic pattern requiring intensive root reactivation' }
    ]
  },
  {
    id: 'hair_fall_severity',
    category: 'PART 2 — YOUR HAIR',
    title: '5. How would you describe your hair fall?',
    subtitle: 'Visual severity rating for daily hair loss volume.',
    options: [
      { text: 'Low', desc: 'Normal daily shedding (< 30 strands/day)' },
      { text: 'Mild', desc: 'Slightly noticeable in brush (30–50 strands/day)' },
      { text: 'Moderate', desc: 'Noticeable fall on pillows & shower (50–100 strands/day)' },
      { text: 'High', desc: 'Significant hair loss (100–150 strands/day)' },
      { text: 'Very High', desc: 'Alarming hair shedding (150+ strands/day)' }
    ]
  },
  {
    id: 'change_location',
    category: 'PART 2 — YOUR HAIR',
    title: '6. Where do you notice the most change?',
    subtitle: 'Pinpointing the exact zone helps map follicle dormancy.',
    options: [
      { text: 'Hairline', desc: 'Frontal border receding or thinning' },
      { text: 'Temples', desc: 'Recession at the M-shaped temple corners' },
      { text: 'Crown', desc: 'Thinning spot on top or back of head' },
      { text: 'Centre/parting', desc: 'Widening partition line when styled' },
      { text: 'Overall', desc: 'Diffuse density loss across the entire scalp' },
      { text: 'Patch-like area', desc: 'Localized round or oval bare patches' },
      { text: 'I’m not sure', desc: 'General reduction in hair mass' }
    ]
  },
  {
    id: 'scalp_visibility',
    category: 'PART 2 — YOUR HAIR',
    title: '7. Have you noticed your scalp becoming more visible?',
    subtitle: 'Evaluates hair follicle diameter and density per square cm.',
    options: [
      { text: 'No', desc: 'Scalp remains well covered under light' },
      { text: 'Slightly', desc: 'Scalp visible only under bright direct light' },
      { text: 'Sometimes', desc: 'Noticeable when hair is wet or tied back' },
      { text: 'Clearly', desc: 'Scalp clearly visible through dry hair' }
    ]
  },
  {
    id: 'hair_thickness',
    category: 'PART 2 — YOUR HAIR',
    title: '8. How would you describe your hair thickness?',
    subtitle: 'Individual hair shaft strand diameter.',
    options: [
      { text: 'Thick', desc: 'Coarse, heavy strands with strong natural body' },
      { text: 'Medium', desc: 'Standard density and normal shaft diameter' },
      { text: 'Fine', desc: 'Delicate strands prone to quick flattening' },
      { text: 'Very fine', desc: 'Ultra-thin wispy hair shafts requiring volume' },
      { text: 'Not sure', desc: 'Variable strand thickness' }
    ]
  },
  {
    id: 'hair_breakage',
    category: 'PART 2 — YOUR HAIR',
    title: '9. Does your hair break easily?',
    subtitle: 'Measures Keratin tensile strength and cortex health.',
    options: [
      { text: 'Rarely', desc: 'Strong hair shaft with good elasticity' },
      { text: 'Sometimes', desc: 'Occasional breakage at ends during combing' },
      { text: 'Frequently', desc: 'Regular mid-shaft snaps while styling' },
      { text: 'Very frequently', desc: 'Extreme brittleness and constant snapping' }
    ]
  },
  {
    id: 'hair_texture',
    category: 'PART 2 — YOUR HAIR',
    title: '10. How would you describe your hair texture?',
    subtitle: 'Cuticle integrity and natural oil distribution.',
    options: [
      { text: 'Smooth', desc: 'Silky, soft, with intact cuticle scales' },
      { text: 'Dry', desc: 'Lacks moisture and natural shine' },
      { text: 'Frizzy', desc: 'Porous strands reacting to humidity' },
      { text: 'Rough', desc: 'Coarse shaft with damaged outer cuticle' },
      { text: 'Oily', desc: 'Limp strands quickly coated in scalp oils' },
      { text: 'Combination', desc: 'Oily roots with dry/frizzy ends' }
    ]
  },

  // PART 3 — SCALP
  {
    id: 'scalp_type',
    category: 'PART 3 — SCALP',
    title: '11. How would you describe your scalp?',
    subtitle: 'Scalp microbiome and sebum secretion baseline.',
    options: [
      { text: '🌿 Balanced', desc: 'Optimal sebum barrier & healthy scalp flora' },
      { text: '🏜️ Dry', desc: 'Tight, dehydrated scalp needing lipid replenishment' },
      { text: '💧 Oily', desc: 'Excess sebum clogging follicle pores' },
      { text: '🌱 Sensitive', desc: 'Prone to redness, burning or product reactivity' }
    ]
  },
  {
    id: 'dandruff',
    category: 'PART 3 — SCALP',
    title: '12. Do you experience dandruff or visible flakes?',
    subtitle: 'Malassezia fungal yeast activity on scalp.',
    options: [
      { text: 'Never', desc: 'Clean, flake-free scalp environment' },
      { text: 'Occasionally', desc: 'Light seasonal flaking during weather shifts' },
      { text: 'Frequently', desc: 'Regular white or yellow flakes on shoulders' },
      { text: 'Almost always', desc: 'Persistent stubborn dandruff & scalp buildup' }
    ]
  },
  {
    id: 'scalp_itch',
    category: 'PART 3 — SCALP',
    title: '13. Does your scalp itch?',
    subtitle: 'Micro-inflammation indicator at root level.',
    options: [
      { text: 'Never', desc: 'No itchiness or scalp discomfort' },
      { text: 'Sometimes', desc: 'Mild itch when sweaty or overdue for wash' },
      { text: 'Often', desc: 'Frequent urge to scratch scalp' },
      { text: 'Almost always', desc: 'Constant severe itchiness and scalp irritation' }
    ]
  },
  {
    id: 'wash_frequency',
    category: 'PART 3 — SCALP',
    title: '14. How often do you wash your hair?',
    subtitle: 'Scalp cleansing cadence and follicle hygiene.',
    options: [
      { text: 'Daily', desc: 'Washing everyday to manage oil or sweat' },
      { text: 'Every 2 days', desc: 'Alternate day cleansing routine' },
      { text: '2–3 times a week', desc: 'Standard healthy washing frequency' },
      { text: 'Once a week', desc: 'Weekly cleansing regimen' },
      { text: 'Less than once a week', desc: 'Infrequent washing cycle' }
    ]
  },
  {
    id: 'hair_treatments',
    category: 'PART 3 — SCALP',
    title: '15. Which hair treatments do you regularly use?',
    subtitle: 'Chemical and thermal exposure on hair shafts.',
    options: [
      { text: 'Hair colouring', desc: 'Dyes, highlights, or bleach' },
      { text: 'Straightening', desc: 'Chemical relaxing or rebonding treatments' },
      { text: 'Smoothening', desc: 'Keratin, cysteine, or protein treatments' },
      { text: 'Perming', desc: 'Chemical curling or texturizing' },
      { text: 'Heat styling', desc: 'Blow dryers, flat irons, or curling rods' },
      { text: 'Hair styling products', desc: 'Waxes, gels, sprays, or pomades' },
      { text: 'None', desc: 'Natural untreated hair' }
    ]
  },

  // PART 4 — YOUR LIFESTYLE
  {
    id: 'sleep_hours',
    category: 'PART 4 — YOUR LIFESTYLE',
    title: '16. How many hours do you usually sleep?',
    subtitle: 'Melatonin and cellular repair during nocturnal rest cycle.',
    options: [
      { text: 'Less than 5 hours', desc: 'Severe sleep deficit impairing root renewal' },
      { text: '5–6', desc: 'Sub-optimal resting window' },
      { text: '6–7', desc: 'Moderate sleep cycle' },
      { text: '7–8', desc: 'Optimal restorative deep sleep duration' },
      { text: 'More than 8', desc: 'Extended recovery sleep window' }
    ]
  },
  {
    id: 'stress_level',
    category: 'PART 4 — YOUR LIFESTYLE',
    title: '17. How would you describe your current stress level?',
    subtitle: 'Cortisol hormone impact on premature hair shedding.',
    options: [
      { text: 'CALM', desc: 'Low stress, stable emotional state' },
      { text: 'MODERATE', desc: 'Normal work/routine pressure' },
      { text: 'HIGH', desc: 'Elevated stress affecting sleep & energy' },
      { text: 'VERY HIGH', desc: 'Extreme chronic stress levels triggering hair fall' }
    ]
  },
  {
    id: 'exercise_frequency',
    category: 'PART 4 — YOUR LIFESTYLE',
    title: '18. How often do you exercise?',
    subtitle: 'Physical activity boosts scalp capillary circulation.',
    options: [
      { text: 'Rarely', desc: 'Sedentary lifestyle with minimal workout' },
      { text: '1–2 days/week', desc: 'Light occasional physical activity' },
      { text: '3–4 days/week', desc: 'Moderate regular exercise routine' },
      { text: '5+ days/week', desc: 'Active athletic or daily workout regime' }
    ]
  },
  {
    id: 'water_intake',
    category: 'PART 4 — YOUR LIFESTYLE',
    title: '19. Approximately how much water do you drink daily?',
    subtitle: 'Cellular hydration for healthy hair follicle matrix.',
    options: [
      { text: 'Less than 1 L', desc: 'Severe dehydration impacting scalp elasticity' },
      { text: '1–1.5 L', desc: 'Low fluid intake' },
      { text: '1.5–2 L', desc: 'Moderate daily hydration' },
      { text: '2–3 L', desc: 'Optimal daily water intake' },
      { text: 'More than 3 L', desc: 'High hydration level' }
    ]
  },

  // PART 5 — NUTRITION
  {
    id: 'usual_diet',
    category: 'PART 5 — NUTRITION',
    title: '20. How would you describe your usual diet?',
    subtitle: 'Micronutrient baseline for Keratin synthesis.',
    options: [
      { text: 'Mostly home-cooked & balanced', desc: 'Nutrient-rich, wholesome balanced meals' },
      { text: 'Mostly home-cooked', desc: 'Standard homemade food routine' },
      { text: 'Mixed', desc: 'Combination of home meals & eating out' },
      { text: 'Mostly outside/processed food', desc: 'High intake of fried, fast, or refined foods' },
      { text: 'Irregular eating pattern', desc: 'Skipping meals or inconsistent dining times' }
    ]
  },
  {
    id: 'protein_intake',
    category: 'PART 5 — NUTRITION',
    title: '21. How often do you eat protein-rich foods?',
    subtitle: 'Protein (eggs, fish, meat, dairy, legumes, pulses) builds hair Keratin.',
    options: [
      { text: 'Daily', desc: 'High amino acid availability every day' },
      { text: '4–6 times/week', desc: 'Good regular protein consumption' },
      { text: '2–3 times/week', desc: 'Moderate protein intake' },
      { text: 'Occasionally', desc: 'Low protein intake' },
      { text: 'Rarely', desc: 'Deficient protein levels impacting hair building blocks' }
    ]
  },
  {
    id: 'veggies_intake',
    category: 'PART 5 — NUTRITION',
    title: '22. How often do you eat fruits and vegetables?',
    subtitle: 'Essential vitamins, Minerals & Antioxidants supply.',
    options: [
      { text: 'Daily', desc: 'Rich in vital micronutrients & Bio-flavonoids' },
      { text: 'Almost daily', desc: 'Regular fruit & vegetable intake' },
      { text: 'Several times a week', desc: 'Moderate intake' },
      { text: 'Occasionally', desc: 'Low intake of fresh greens' },
      { text: 'Rarely', desc: 'Minimal intake risking vitamin deficiencies' }
    ]
  },
  {
    id: 'weight_change',
    category: 'PART 5 — NUTRITION',
    title: '23. Have you recently experienced significant weight change?',
    subtitle: 'Metabolic shifts can trigger shock hair shedding (Telogen Effluvium).',
    options: [
      { text: 'No', desc: 'Stable weight baseline' },
      { text: 'Lost weight', desc: 'Recent rapid weight loss or crash dieting' },
      { text: 'Gained weight', desc: 'Noticeable weight gain or metabolic slowdown' },
      { text: 'I’m not sure', desc: 'Minor unmeasured weight fluctuation' },
      { text: 'Prefer not to say', desc: 'Undisclosed metabolic change' }
    ]
  },

  // PART 6 — GUT & DIGESTIVE WELLNESS
  {
    id: 'bloating',
    category: 'PART 6 — GUT & DIGESTIVE WELLNESS',
    title: '24. How often do you experience bloating?',
    subtitle: 'Wellness screening for gut fermentation & gas buildup.',
    options: [
      { text: 'Never', desc: 'Flat, comfortable stomach after eating' },
      { text: 'Occasionally', desc: 'Mild bloating after heavy or late meals' },
      { text: 'Frequently', desc: 'Regular abdominal tightness and gas' },
      { text: 'Almost daily', desc: 'Persistent gut discomfort & chronic bloating' }
    ]
  },
  {
    id: 'bowel_regularity',
    category: 'PART 6 — GUT & DIGESTIVE WELLNESS',
    title: '25. How regular is your digestion/bowel routine?',
    subtitle: 'Ayurvedic Ama waste elimination check.',
    options: [
      { text: 'Very regular', desc: 'Smooth, daily bowel clearance every morning' },
      { text: 'Mostly regular', desc: 'Normal digestion with rare sluggish days' },
      { text: 'Sometimes irregular', desc: 'Occasional constipation or loose motion' },
      { text: 'Frequently irregular', desc: 'Chronic bowel irregularity & toxic waste buildup' }
    ]
  },
  {
    id: 'acidity',
    category: 'PART 6 — GUT & DIGESTIVE WELLNESS',
    title: '26. How often do you experience acidity or heartburn?',
    subtitle: 'Pitta dosha internal heat indicator burning hair root nutrients.',
    options: [
      { text: 'Never', desc: 'No acid reflux or chest heat' },
      { text: 'Occasionally', desc: 'Acidity after spicy or oily food' },
      { text: 'Frequently', desc: 'Regular acid reflux & burning sensation' },
      { text: 'Almost daily', desc: 'Chronic hyper-acidity requiring anti-acids' }
    ]
  },
  {
    id: 'overall_digestion',
    category: 'PART 6 — GUT & DIGESTIVE WELLNESS',
    title: '27. How would you describe your overall digestion?',
    subtitle: 'Gut Agni (digestive fire) health assessment.',
    options: [
      { text: 'Very comfortable', desc: 'Optimal gut Agni absorbing maximum nutrients' },
      { text: 'Mostly comfortable', desc: 'Good digestive comfort overall' },
      { text: 'Sometimes uncomfortable', desc: 'Periodic indigestion or heaviness' },
      { text: 'Frequently uncomfortable', desc: 'Sluggish digestive fire & poor absorption' },
      { text: 'I’m not sure', desc: 'Variable digestive experience' }
    ]
  },

  // PART 7 — HAIR HISTORY
  {
    id: 'family_history',
    category: 'PART 7 — HAIR HISTORY',
    title: '28. Does significant hair thinning or hair loss run in your family?',
    subtitle: 'Genetic predisposition to 5-alpha reductase DHT activity.',
    options: [
      { text: 'Yes', desc: 'Family history on father, mother, or siblings side' },
      { text: 'No', desc: 'No family history of pattern baldness' },
      { text: 'Not sure', desc: 'Unknown family hair history' },
      { text: 'Prefer not to say', desc: 'Undisclosed genetic background' }
    ]
  },
  {
    id: 'lifestyle_change',
    category: 'PART 7 — HAIR HISTORY',
    title: '29. Have you recently experienced any major physical or lifestyle change?',
    subtitle: 'Triggers that push hair follicles into telogen resting phase.',
    options: [
      { text: 'Major illness or fever', desc: 'Recent high fever or viral infection' },
      { text: 'Surgery', desc: 'Recent medical operation or anesthesia' },
      { text: 'Major stress', desc: 'Significant emotional or professional shock' },
      { text: 'Significant diet change', desc: 'Transitioned to vegan, keto, or caloric deficit' },
      { text: 'Rapid weight change', desc: 'Sharp gain or loss in body weight' },
      { text: 'Pregnancy/postpartum', desc: 'Hormonal shift after childbirth' },
      { text: 'None', desc: 'No major health or lifestyle events' },
      { text: 'Prefer not to say', desc: 'Undisclosed history' }
    ]
  },
  {
    id: 'desired_result',
    category: 'PART 7 — HAIR HISTORY',
    title: '30. What result matters most to you?',
    subtitle: 'Your primary goal guides our trichologist prescription.',
    options: [
      { text: '🌱 Stronger-looking roots', desc: 'Fortify hair roots & reduce root breakage' },
      { text: '✨ Healthier-looking hair', desc: 'Improve shine, elasticity, & texture' },
      { text: '💧 Better scalp nourishment', desc: 'Hydrate scalp micro-environment' },
      { text: '🌿 Less visible hair fall', desc: 'Drastically reduce daily strand shedding' },
      { text: '💪 Fuller-looking hair', desc: 'Increase overall density & crown volume' },
      { text: '❄️ Better scalp comfort', desc: 'Soothe itch, redness & clear dandruff' },
      { text: '🌟 Overall hair wellness', desc: '360° holistic hair, gut & root restoration' }
    ]
  }
];
