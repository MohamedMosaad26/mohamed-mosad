-- ==============================================================================
-- SUPABASE DATABASE SCHEMA FOR MOHAMED MOSAD PORTFOLIO
-- Paste this entire SQL script into your Supabase SQL Editor and click 'RUN'.
-- ==============================================================================

-- 1. Enable UUID Extension (usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLE DEFINITIONS
-- ==============================================================================

-- 1. Profile Info (Personal details, hero text, links, and education)
CREATE TABLE IF NOT EXISTS public.profile_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT 'Mohamed Mosad Mohamed',
    title TEXT NOT NULL DEFAULT 'Machine Learning Engineer & Data Scientist',
    bio TEXT NOT NULL DEFAULT 'I build intelligent solutions using Machine Learning, Data, and Software Engineering.',
    long_bio TEXT NOT NULL DEFAULT 'Driven and results-oriented Machine Learning Engineer student with hands-on experience building end-to-end ML pipelines, performing exploratory data analysis, and developing predictive models.',
    location TEXT NOT NULL DEFAULT 'Port Said, Egypt',
    email TEXT NOT NULL DEFAULT 'mm6408682@gmail.com',
    github_url TEXT NOT NULL DEFAULT 'https://github.com/MohamedMosaad26',
    linkedin_url TEXT NOT NULL DEFAULT 'https://www.linkedin.com/in/mohamed-mosad-mohamed-0731ab299/',
    cv_url TEXT NOT NULL DEFAULT '#',
    image_url TEXT NOT NULL DEFAULT '/mohamed-profile.jpeg',
    education_degree TEXT NOT NULL DEFAULT 'B.Sc. Management Technology and Information Systems (MITS)',
    education_field TEXT NOT NULL DEFAULT 'Information Technology Management',
    education_school TEXT NOT NULL DEFAULT 'Port Said University',
    education_year TEXT NOT NULL DEFAULT '3rd Year',
    education_gpa TEXT NOT NULL DEFAULT '3.56 / 4.0',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY DEFAULT ('p-' || substr(md5(random()::text), 1, 8)),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    technologies TEXT[] DEFAULT '{}',
    github_url TEXT,
    live_url TEXT,
    image_url TEXT,
    featured BOOLEAN DEFAULT false,
    metrics JSONB DEFAULT '[]'::jsonb,
    highlights TEXT[] DEFAULT '{}',
    details JSONB DEFAULT '{}'::jsonb,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Skill Categories Table
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id TEXT PRIMARY KEY DEFAULT ('sc-' || substr(md5(random()::text), 1, 8)),
    name TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    order_num INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Experiences Table (Education, Contests, Jobs, Internships)
CREATE TABLE IF NOT EXISTS public.experiences (
    id TEXT PRIMARY KEY DEFAULT ('e-' || substr(md5(random()::text), 1, 8)),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    type TEXT NOT NULL,
    location TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT,
    description TEXT NOT NULL,
    order_num INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Certifications Table
CREATE TABLE IF NOT EXISTS public.certifications (
    id TEXT PRIMARY KEY DEFAULT ('c-' || substr(md5(random()::text), 1, 8)),
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date TEXT,
    status TEXT DEFAULT 'Completed',
    url TEXT,
    image_url TEXT,
    description TEXT,
    order_num INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY DEFAULT ('a-' || substr(md5(random()::text), 1, 8)),
    title TEXT NOT NULL,
    organization TEXT,
    date TEXT,
    description TEXT NOT NULL,
    order_num INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Contact Messages Table (Inbox from website contact form)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profile_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access for Portfolio Tables
DROP POLICY IF EXISTS "Public can view profile" ON public.profile_info;
CREATE POLICY "Public can view profile" ON public.profile_info FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view skills" ON public.skill_categories;
CREATE POLICY "Public can view skills" ON public.skill_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view experiences" ON public.experiences;
CREATE POLICY "Public can view experiences" ON public.experiences FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view certifications" ON public.certifications;
CREATE POLICY "Public can view certifications" ON public.certifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view achievements" ON public.achievements;
CREATE POLICY "Public can view achievements" ON public.achievements FOR SELECT USING (true);

-- 2. Public Can Insert Messages (Contact Form)
DROP POLICY IF EXISTS "Public can send messages" ON public.messages;
CREATE POLICY "Public can send messages" ON public.messages FOR INSERT WITH CHECK (true);

-- 3. Authenticated Admin Full Access (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Admin full access profile" ON public.profile_info;
CREATE POLICY "Admin full access profile" ON public.profile_info FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access projects" ON public.projects;
CREATE POLICY "Admin full access projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access skills" ON public.skill_categories;
CREATE POLICY "Admin full access skills" ON public.skill_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access experiences" ON public.experiences;
CREATE POLICY "Admin full access experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access certifications" ON public.certifications;
CREATE POLICY "Admin full access certifications" ON public.certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access achievements" ON public.achievements;
CREATE POLICY "Admin full access achievements" ON public.achievements FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access messages" ON public.messages;
CREATE POLICY "Admin full access messages" ON public.messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- (Pre-populates your database with Mohamed's current portfolio data)
-- ==============================================================================

-- 1. Seed Profile Info
DELETE FROM public.profile_info;
INSERT INTO public.profile_info (
    name, title, bio, long_bio, location, email, github_url, linkedin_url, cv_url, image_url,
    education_degree, education_field, education_school, education_year, education_gpa
) VALUES (
    'Mohamed Mosad Mohamed',
    'Machine Learning Engineer & Data Scientist',
    'I build intelligent solutions using Machine Learning, Data, and Software Engineering.',
    'Driven and results-oriented Machine Learning Engineer student with hands-on experience building end-to-end ML pipelines, performing exploratory data analysis, and developing predictive models. I work across the full data lifecycle — from cleaning and feature engineering to model training, evaluation, and turning results into clear, actionable insight.',
    'Port Said, Egypt',
    'mm6408682@gmail.com',
    'https://github.com/MohamedMosaad26',
    'https://www.linkedin.com/in/mohamed-mosad-mohamed-0731ab299/',
    '#',
    '/mohamed-profile.jpeg',
    'B.Sc. Management Technology and Information Systems (MITS)',
    'Information Technology Management',
    'Port Said University',
    '3rd Year',
    '3.56 / 4.0'
);

-- 2. Seed Skill Categories
DELETE FROM public.skill_categories;
INSERT INTO public.skill_categories (id, name, skills, order_num) VALUES
('sc-1', 'Programming', ARRAY['Python', 'SQL'], 1),
('sc-2', 'Python Ecosystem', ARRAY['Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Seaborn'], 2),
('sc-3', 'Machine Learning', ARRAY['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Cross Validation', 'Hyperparameter Tuning'], 3),
('sc-4', 'Deep Learning', ARRAY['Neural Networks', 'Model Architecture', 'Training', 'Optimization'], 4),
('sc-5', 'Data Science', ARRAY['EDA', 'Feature Engineering', 'Data Cleaning', 'Data Preprocessing', 'Data Transformation'], 5),
('sc-6', 'Statistics', ARRAY['Probability', 'Probability Distributions', 'Hypothesis Testing', 'Descriptive Statistics', 'Inferential Statistics'], 6),
('sc-7', 'AI', ARRAY['AI Agents', 'Agentic AI', 'Generative AI', 'Tool Use', 'Multi-step AI Pipelines'], 7);

-- 3. Seed Projects
DELETE FROM public.projects;
INSERT INTO public.projects (
    id, title, slug, category, description, long_description,
    technologies, github_url, live_url, image_url, featured,
    metrics, highlights, details, display_order
) VALUES
(
    'p-1',
    'COVID-19 Infection Prediction Model',
    'covid-19-infection-prediction',
    'Machine Learning',
    'Engineered and trained a supervised ML model on 50,000+ epidemiological records to forecast COVID-19 infection case trajectories.',
    'A supervised regression project forecasting COVID-19 infection case trajectories from large-scale epidemiological data, spanning a complete preprocessing pipeline, model comparison, and visual analysis.',
    ARRAY['Python', 'Scikit-learn', 'Pandas', 'EDA'],
    NULL,
    NULL,
    '/projects/covid-prediction.png',
    true,
    '[{"label":"Records","value":"50,000+"},{"label":"Variables","value":"15+"},{"label":"Visualizations","value":"8+"}]'::jsonb,
    ARRAY['50,000+ epidemiological records', '15+ variables', 'Compared Linear Regression, Random Forest, and Gradient Boosting', 'Built a full preprocessing pipeline', 'Created 8+ visualizations'],
    '{"problemStatement":"Forecast COVID-19 infection case trajectories from historical epidemiological indicators to support planning.","dataset":"50,000+ epidemiological records spanning 15+ variables.","models":"Linear Regression, Random Forest, and Gradient Boosting were trained and compared."}'::jsonb,
    1
),
(
    'p-2',
    'Customer Churn Prediction Model',
    'customer-churn-prediction',
    'Machine Learning',
    'Developed a binary classification model to identify customers at risk of churn before potential revenue loss.',
    'An end-to-end binary classification project that identifies at-risk customers using engineered behavioral and transactional features, model comparison, and cross-validated tuning.',
    ARRAY['Python', 'Pandas', 'Scikit-learn', 'Logistic Regression', 'Random Forest', 'XGBoost'],
    'https://github.com/MohamedMosaad26/customer-churn',
    NULL,
    '/projects/churn-prediction.png',
    true,
    '[{"label":"Records","value":"10,000+"},{"label":"Features","value":"12"},{"label":"Classifiers","value":"3"}]'::jsonb,
    ARRAY['10,000+ customer records', '12 engineered behavioral and transactional features', 'Compared 3 classifiers', '5-fold cross-validation', 'Hyperparameter tuning', 'Identified key churn drivers'],
    '{"problemStatement":"Identify customers at risk of churning before revenue is lost, enabling proactive retention.","dataset":"10,000+ customer records with behavioral and transactional signals.","featureEngineering":"12 engineered behavioral and transactional features.","models":"Logistic Regression, Random Forest, and XGBoost were compared.","modelComparison":"Three classifiers evaluated with 5-fold cross-validation and hyperparameter tuning.","businessInsights":"Surfaced the key drivers of churn to guide retention strategy."}'::jsonb,
    2
);

-- 4. Seed Experiences
DELETE FROM public.experiences;
INSERT INTO public.experiences (id, title, organization, type, location, start_date, end_date, description, order_num) VALUES
(
    'e-1',
    'B.Sc. Management Technology and Information Systems (MITS)',
    'Port Said University',
    'Education',
    'Port Said, Egypt',
    '3rd Year',
    NULL,
    'Major in Information Technology Management. Current GPA 3.56 / 4.0, focusing on data, analytics, and applied machine learning.',
    1
),
(
    'e-2',
    'Egyptian Collegiate Programming Contest (ECPC)',
    'ACPC / ICPC',
    'Competition',
    'Egypt',
    'Participant',
    NULL,
    'Participated in the Egyptian Collegiate Programming Contest, sharpening algorithmic problem-solving and teamwork under time pressure.',
    2
);

-- 5. Seed Certifications
DELETE FROM public.certifications;
INSERT INTO public.certifications (id, name, issuer, date, status, url, image_url, description, order_num) VALUES
('c-1', 'Google AI Professional Certificate', 'Google / Coursera', NULL, 'Completed', NULL, NULL, NULL, 1),
('c-2', 'Getting Started with Data', 'IBM / Credly', NULL, 'Completed', NULL, NULL, NULL, 2),
('c-3', 'AI for Beginners', 'HP LIFE', NULL, 'Completed', NULL, NULL, NULL, 3),
('c-4', 'Python for Data Science, AI & Development', 'IBM / Coursera', NULL, 'Completed', NULL, NULL, NULL, 4),
('c-5', 'Data Science & AI Masters 2026 – From Python to Generative AI', 'Udemy', NULL, 'In Progress', NULL, NULL, NULL, 5);

-- ==============================================================================
-- DONE! Your Supabase database is ready to use.
-- ==============================================================================
