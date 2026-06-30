// Pure client-safe utilities — no fs/path imports.
// Add each new course slug here when its content is published.

export const COURSE_NAMES: Record<string, string> = {
  // Existing fast-track courses
  'foundations-for-llm':           'Foundations for LLM',
  'bengali-llm':                   'Bengali LLM',
  'tabular-kaggle':                'Tabular Kaggle',

  // Full 20-course curriculum (PLAN.md build order)
  // Group: Foundations
  'python-for-data-work':          'Python for Data Work',
  'math-optimization':             'Math & Optimization',
  'probability-statistics':        'Probability & Statistics',

  // Group: Data
  'data-wrangling-eda':            'Data Wrangling & EDA',

  // Group: Core ML
  'classical-ml':                  'Classical Machine Learning',
  'time-series-forecasting':       'Time Series & Forecasting',

  // Group: Deep Learning
  'deep-learning-foundations':     'Deep Learning Foundations',
  'cnns-computer-vision':          'CNNs & Computer Vision',
  'sequence-transformers':         'Sequences & Transformers',
  'generative-models':             'Generative Models',
  'modern-architectures':          'Modern Architectures',
  'nlp-llms':                      'NLP & Large Language Models',

  // Group: Specialized
  'reinforcement-learning':        'Reinforcement Learning',
  'graph-ml':                      'Graph Machine Learning',
  'recommender-systems':           'Recommender Systems',
  'bayesian-ml':                   'Bayesian & Probabilistic ML',

  // Group: Applied / Prod
  'eval-tuning':                   'Evaluation, Tuning & Interpretability',
  'competition-ml':                'Applied / Competition ML',
  'system-design':                 'System Design & Architecture',
  'mlops':                         'MLOps & Productionization',
};

export function courseIdToName(id: string): string {
  return (
    COURSE_NAMES[id] ??
    id
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
}
