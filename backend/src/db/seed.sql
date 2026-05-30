INSERT INTO users (username, email, password_hash, role)
VALUES (
    'admin',
    'admin@devjudge.local',
    '$2b$10$jYpBz73QETQxg85VwnkieuXX/THWgwZoFHPPlwXn6az1rx83xY0oO',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO challenges (
    title,
    slug,
    description,
    difficulty,
    starter_code,
    is_published,
    created_by
)
VALUES (
    'Sum Two Numbers',
    'sum-two-numbers',
    'Given two numbers, return their sum.',
    'easy',
    'function solve(a, b) {
    // Write your code here
    }
    
    module.exports = solve;',
    true,
    (SELECT id FROM users WHERE email = 'admin@devjudge.local')
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    difficulty = EXCLUDED.difficulty,
    starter_code = EXCLUDED.starter_code,
    is_published = EXCLUDED.is_published;

DELETE from test_cases
WHERE challenge_id = (
    SELECT id FROM challenges WHERE slug = 'sum-two-numbers'
);

INSERT INTO test_cases (
    challenge_id,
    input,
    expected_output,
    is_hidden,
    sort_order
)
VALUES
(
    (SELECT id FROM challenges WHERE slug = 'sum-two-numbers'),
    '1 2',
    '3',
    false,
    1
),
(
    (SELECT id FROM challenges WHERE slug = 'sum-two-numbers'),
    '10 15',
    '25',
    false,
    2
),
(
    (SELECT id FROM challenges WHERE slug = 'sum-two-numbers'),
    '-5 12',
    '7',
    false,
    3
);
