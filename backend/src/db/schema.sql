CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'))
);

CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(120) NOT NULL,
    slug VARCHAR(140) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    topic VARCHAR(80) NOT NULL DEFAULT 'general',
    language VARCHAR(30) NOT NULL DEFAULT 'javascript',
    starter_code TEXT NOT NULL,
    function_name VARCHAR(80) NOT NULL DEFAULT 'solve',
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT challenges_difficulty_check CHECK (difficulty IN ('easy', 'medium', 'hard')),
    CONSTRAINT challenges_language_check CHECK (language IN ('javascript', 'typescript', 'sql'))
);

CREATE TABLE IF NOT EXISTS test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    input_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    expected_ouput_json JSONB NULL DEFAULT '{}'::jsonb,
    is_hidden BOOLEAN NOT NULL DEFAULT true,
    comparetor VARCHAR(40) NOT NULL DEFAULT 'exact',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

    CONSTRAINT test_cases_comparator_check CHECK (
        comparator IN (
            'exact',
            'array_exact',
            'array_unordered',
            'number_tolerance'
        )
    )
);

CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    language VARCHAR(30) NOT NULL DEFAULT 'javascript',
    source_code TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    score INTEGER NOT NULL DEFAULT 0,
    passed_tests INTEGER NOT NULL DEFAULT 0,
    total_tests INTEGER NOT NULL DEFAULT 0,
    output TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT submissions_status_check CHECK (
        status in (
            'pending',
            'running',
            'accepted',
            'wrong_answer',
            'runtime_error',
            'time_limit_error',
            'compilation_error'
        )
    ),

    CONSTRAINT submissions_score_check CHECK (score >= 0 AND score <= 100)
);

CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    best_score INTEGER NOT NULL DEFAULT 0,
    solved BOOLEAN NOT NULL DEFAULT false,
    attempts INTEGER NOT NULL DEFAULT 0,
    last_submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_progress_unique_user_challenge UNIQUE (user_id, challenge_id),
    CONSTRAINT user_progress_best_score_check CHECK (best_score >= 0 AND best_score <= 100)
);

ALTER TABLE challenges
ADD COLUMN IF NOT EXISTS topic VARCHAR(80) NOT NULL DEFAULT 'general';

ALTER TABLE challenges
ADD COLUMN IF NOT EXISTS language VARCHAR(30) NOT NULL DEFAULT 'javascript';

ALTER TABLE challenges
ADD COLUMN IF NOT EXISTS function_name VARCHAR(80) NOT NULL DEFAULT 'solve';

ALTER TABLE challenges
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE challenges
SET language = 'javascript'
WHERE language = 'javascrpt';

ALTER TABLE challenges
DROP CONSTRAINT IF EXISTS challenges_language_check;

ALTER TABLE challenges
ADD CONSTRAINT challenges_language_check
CHECK (language IN ('javascript', 'typescript', 'sql'));

ALTER TABLE test_cases
ADD COLUMN IF NOT EXISTS input_json JSONB;

ALTER TABLE test_cases
ADD COLUMN IF NOT EXISTS expected_output_json JSONB;

UPDATE test_cases
SET input_json = COALESCE(input_json, to_jsonb(input))
WHERE input_json IS NULL AND input IS NOT NULL;

UPDATE test_cases
SET expected_output_json = COALESCE(expected_output_json, to_jsonb(expected_output))
WHERE expected_output_json IS NULL AND expected_output IS NOT NULL;

ALTER TABLE test_cases
ALTER COLUMN input_json SET DEFAULT '{}'::jsonb;

ALTER TABLE test_cases
ALTER COLUMN expected_output_json SET DEFAULT '{}'::jsonb;

ALTER TABLE test_cases
ALTER COLUMN input_json SET NOT NULL;

ALTER TABLE test_cases
ALTER COLUMN expected_output_json SET NOT NULL;

ALTER TABLE test_cases
ADD COLUMN IF NOT EXISTS comparator VARCHAR(40) NOT NULL DEFAULT 'exact';

ALTER TABLE test_cases
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE test_cases
ALTER COLUMN input DROP NOT NULL;

ALTER TABLE test_cases
ALTER COLUMN expected_output DROP NOT NULL;

ALTER TABLE test_cases
DROP CONSTRAINT IF EXISTS test_cases_comparator_check;

ALTER TABLE test_cases
ADD CONSTRAINT test_cases_comparator_check
CHECK (
    comparator IN (
        'exact',
        'array_exact',
        'array_unordered',
        'number_tolerance'
    )
);

CREATE INDEX IF NOT EXISTS idx_challenges_slug ON challenges(slug);
CREATE INDEX IF NOT EXISTS idx_challenges_is_published ON challenges(is_published);
CREATE INDEX IF NOT EXISTS idx_challenges_topic ON challenges(topic);
CREATE INDEX IF NOT EXISTS idx_challenges_language ON challenges(language);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON challenges(difficulty); 
CREATE INDEX IF NOT EXISTS idx_tests_cases_challenge_id ON test_cases(challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);