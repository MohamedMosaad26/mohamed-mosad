/**
 * Typed portfolio content.
 *
 * These types intentionally mirror the database schema (see lib/db/schema.ts once
 * wired to Neon/Drizzle). Until the DB is connected, the exported constants below
 * act as seed data and the single source of truth for the public site.
 */

export type ProjectCategory = 'Machine Learning' | 'Data Science' | 'Deep Learning' | 'AI'

export type Metric = {
  label: string
  value: string
}

export type Project = {
  id: string
  title: string
  slug: string
  description: string
  longDescription: string | null
  category: ProjectCategory
  technologies: string[]
  githubUrl: string | null
  liveUrl: string | null
  imageUrl: string | null
  featured: boolean
  metrics: Metric[]
  highlights: string[]
  /** Rich sections for the project detail page. Editable later via admin. */
  details: {
    problemStatement?: string
    dataset?: string
    dataPreprocessing?: string
    eda?: string
    featureEngineering?: string
    models?: string
    modelComparison?: string
    evaluationMetrics?: string
    results?: string
    businessInsights?: string
  }
  createdAt: string
  updatedAt: string
}

export type SkillCategory = {
  id: string
  name: string
  skills: string[]
  order: number
}

export type Certificate = {
  id: string
  name: string
  issuer: string
  date: string | null
  status: 'Completed' | 'In Progress'
  url: string | null
  imageUrl: string | null
  description: string | null
}

export type Experience = {
  id: string
  title: string
  organization: string
  type: 'Internship' | 'Job' | 'Training' | 'Competition' | 'Activity' | 'Education'
  location: string | null
  startDate: string
  endDate: string | null
  description: string
  order: number
}

export type Profile = {
  name: string
  title: string
  bio: string
  longBio: string
  location: string
  email: string
  githubUrl: string
  linkedinUrl: string
  cvUrl: string
  imageUrl: string
  education: {
    degree: string
    field: string
    school: string
    year: string
    gpa: string
  }
}

export const profile: Profile = {
  name: 'Mohamed Mosad Mohamed',
  title: 'Machine Learning Engineer & Data Scientist',
  bio: 'I build intelligent solutions using Machine Learning, Data, and Software Engineering.',
  longBio:
    'Driven and results-oriented Machine Learning Engineer student with hands-on experience building end-to-end ML pipelines, performing exploratory data analysis, and developing predictive models. I work across the full data lifecycle — from cleaning and feature engineering to model training, evaluation, and turning results into clear, actionable insight.',
  location: 'Port Said, Egypt',
  email: 'mm6408682@gmail.com',
  githubUrl: 'https://github.com/MohamedMosaad26',
  linkedinUrl: 'https://www.linkedin.com/in/mohamed-mosad-mohamed-0731ab299/',
  cvUrl: '#',
  imageUrl: '/mohamed-profile.jpeg',
  education: {
    degree: 'B.Sc. Management Technology and Information Systems (MITS)',
    field: 'Information Technology Management',
    school: 'Port Said University',
    year: '3rd Year',
    gpa: '3.56 / 4.0',
  },
}

export const skillCategories: SkillCategory[] = [
  { id: 'sc-1', name: 'Programming', skills: ['Python', 'SQL'], order: 1 },
  {
    id: 'sc-2',
    name: 'Python Ecosystem',
    skills: ['Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Seaborn'],
    order: 2,
  },
  {
    id: 'sc-3',
    name: 'Machine Learning',
    skills: [
      'Supervised Learning',
      'Unsupervised Learning',
      'Model Evaluation',
      'Cross Validation',
      'Hyperparameter Tuning',
    ],
    order: 3,
  },
  {
    id: 'sc-4',
    name: 'Deep Learning',
    skills: ['Neural Networks', 'Model Architecture', 'Training', 'Optimization'],
    order: 4,
  },
  {
    id: 'sc-5',
    name: 'Data Science',
    skills: [
      'EDA',
      'Feature Engineering',
      'Data Cleaning',
      'Data Preprocessing',
      'Data Transformation',
    ],
    order: 5,
  },
  {
    id: 'sc-6',
    name: 'Statistics',
    skills: [
      'Probability',
      'Probability Distributions',
      'Hypothesis Testing',
      'Descriptive Statistics',
      'Inferential Statistics',
    ],
    order: 6,
  },
  {
    id: 'sc-7',
    name: 'AI',
    skills: ['AI Agents', 'Agentic AI', 'Generative AI', 'Tool Use', 'Multi-step AI Pipelines'],
    order: 7,
  },
]

export const projects: Project[] = [
  {
    id: 'p-1',
    title: 'COVID-19 Infection Prediction Model',
    slug: 'covid-19-infection-prediction',
    category: 'Machine Learning',
    description:
      'Engineered and trained a supervised ML model on 50,000+ epidemiological records to forecast COVID-19 infection case trajectories.',
    longDescription:
      'A supervised regression project forecasting COVID-19 infection case trajectories from large-scale epidemiological data, spanning a complete preprocessing pipeline, model comparison, and visual analysis.',
    technologies: ['Python', 'Scikit-learn', 'Pandas', 'EDA'],
    githubUrl: null,
    liveUrl: null,
    imageUrl: '/projects/covid-prediction.png',
    featured: true,
    metrics: [
      { label: 'Records', value: '50,000+' },
      { label: 'Variables', value: '15+' },
      { label: 'Visualizations', value: '8+' },
    ],
    highlights: [
      '50,000+ epidemiological records',
      '15+ variables',
      'Compared Linear Regression, Random Forest, and Gradient Boosting',
      'Built a full preprocessing pipeline',
      'Created 8+ visualizations',
    ],
    details: {
      problemStatement:
        'Forecast COVID-19 infection case trajectories from historical epidemiological indicators to support planning.',
      dataset: '50,000+ epidemiological records spanning 15+ variables.',
      models: 'Linear Regression, Random Forest, and Gradient Boosting were trained and compared.',
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'p-2',
    title: 'Customer Churn Prediction Model',
    slug: 'customer-churn-prediction',
    category: 'Machine Learning',
    description:
      'Developed a binary classification model to identify customers at risk of churn before potential revenue loss.',
    longDescription:
      'An end-to-end binary classification project that identifies at-risk customers using engineered behavioral and transactional features, model comparison, and cross-validated tuning.',
    technologies: ['Python', 'Pandas', 'Scikit-learn', 'Logistic Regression', 'Random Forest', 'XGBoost'],
    githubUrl: 'https://github.com/MohamedMosaad26/customer-churn',
    liveUrl: null,
    imageUrl: '/projects/churn-prediction.png',
    featured: true,
    metrics: [
      { label: 'Records', value: '10,000+' },
      { label: 'Features', value: '12' },
      { label: 'Classifiers', value: '3' },
    ],
    highlights: [
      '10,000+ customer records',
      '12 engineered behavioral and transactional features',
      'Compared 3 classifiers',
      '5-fold cross-validation',
      'Hyperparameter tuning',
      'Identified key churn drivers',
    ],
    details: {
      problemStatement:
        'Identify customers at risk of churning before revenue is lost, enabling proactive retention.',
      dataset: '10,000+ customer records with behavioral and transactional signals.',
      featureEngineering: '12 engineered behavioral and transactional features.',
      models: 'Logistic Regression, Random Forest, and XGBoost were compared.',
      modelComparison: 'Three classifiers evaluated with 5-fold cross-validation and hyperparameter tuning.',
      businessInsights: 'Surfaced the key drivers of churn to guide retention strategy.',
    },
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
]

export const certificates: Certificate[] = [
  {
    id: 'c-1',
    name: 'Google AI Professional Certificate',
    issuer: 'Google / Coursera',
    date: null,
    status: 'Completed',
    url: null,
    imageUrl: null,
    description: null,
  },
  {
    id: 'c-2',
    name: 'Getting Started with Data',
    issuer: 'IBM / Credly',
    date: null,
    status: 'Completed',
    url: null,
    imageUrl: null,
    description: null,
  },
  {
    id: 'c-3',
    name: 'AI for Beginners',
    issuer: 'HP LIFE',
    date: null,
    status: 'Completed',
    url: null,
    imageUrl: null,
    description: null,
  },
  {
    id: 'c-4',
    name: 'Python for Data Science, AI & Development',
    issuer: 'IBM / Coursera',
    date: null,
    status: 'Completed',
    url: null,
    imageUrl: null,
    description: null,
  },
  {
    id: 'c-5',
    name: 'Data Science & AI Masters 2026 – From Python to Generative AI',
    issuer: 'Udemy',
    date: null,
    status: 'In Progress',
    url: null,
    imageUrl: null,
    description: null,
  },
]

export const experiences: Experience[] = [
  {
    id: 'e-1',
    title: 'B.Sc. Management Technology and Information Systems (MITS)',
    organization: 'Port Said University',
    type: 'Education',
    location: 'Port Said, Egypt',
    startDate: '3rd Year',
    endDate: null,
    description:
      'Major in Information Technology Management. Current GPA 3.56 / 4.0, focusing on data, analytics, and applied machine learning.',
    order: 1,
  },
  {
    id: 'e-2',
    title: 'Egyptian Collegiate Programming Contest (ECPC)',
    organization: 'ACPC / ICPC',
    type: 'Competition',
    location: 'Egypt',
    startDate: 'Participant',
    endDate: null,
    description:
      'Participated in the Egyptian Collegiate Programming Contest, sharpening algorithmic problem-solving and teamwork under time pressure.',
    order: 2,
  },
]

export const projectCategories: (ProjectCategory | 'All')[] = [
  'All',
  'Machine Learning',
  'Data Science',
  'Deep Learning',
  'AI',
]

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
]
