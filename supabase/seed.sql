/*
 * Dummy users
 */
-- Username: SuperPlasma
-- Email: markjunk669@gmail.com
-- P/W: FooBarBaz
insert into auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at)
    values ('00000000-0000-0000-0000-000000000000', 'c7a11191-7ef9-43dc-8c21-a07aeadf13db', 'authenticated', 'administrator', 'markjunk669@gmail.com', '$2a$10$v9w29SuUX.42hVIBMTq2LOOoDIynDllmZehFELHcn1ezrUG9sY1hu', '2023-01-11 16:54:12.7991+00', null, '', null, '', null, '', '', null, '2023-01-11 16:54:12.801124+00', '{"provider": "email", "providers": ["email"]}', '{"initial_username":"SuperPlasma"}', null, '2023-01-11 16:54:12.796822+00', '2023-01-11 16:54:12.80197+00', null, null, '', '', null, '', 0, null, '', null);

-- Username: _blazar_
-- Email: markjunk669+hello@gmail.com
-- P/W: asdasdasd
insert into auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at)
    values ('00000000-0000-0000-0000-000000000000', '294f5815-8923-4199-8c7d-1f97eff84565', 'authenticated', 'authenticated', 'markjunk669+hello@gmail.com', '$2a$10$nfGek5nkjitqW9mVaLagBez/q3Os9BCgtkVe/cNWMsMgcmbt3tus.', '2023-01-11 16:54:12.7991+00', null, '', null, '', null, '', '', null, '2023-01-11 16:54:12.801124+00', '{"provider": "email", "providers": ["email"]}', '{"initial_username":"_blazar_"}', null, '2023-01-11 16:54:12.796822+00', '2023-01-11 16:54:12.80197+00', null, null, '', '', null, '', 0, null, '', null);

-- Generate 200 dummy users
insert into auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at)
select
    '00000000-0000-0000-0000-000000000000'::uuid,
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'user' || generate_series || '@example.com',
    '$2a$10$v9w29SuUX.42hVIBMTq2LOOoDIynDllmZehFELHcn1ezrUG9sY1hu',
    '2023-01-11 16:54:12.7991+00',
    null,
    '',
    null,
    '',
    null,
    '',
    '',
    null,
    '2023-01-11 16:54:12.801124+00',
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    jsonb_build_object('initial_username', '~Dummy_User_' || generate_series),
    null,
    '2023-01-11 16:54:12.796822+00',
    '2023-01-11 16:54:12.80197+00',
    null,
    null,
    null,
    '',
    null,
    '',
    0,
    null,
    '',
    null
from
    generate_series(1, 200);


/*
 * Utils
 */
create schema dummy;

-- Get random user (UUID)
create or replace function dummy.get_random_user_id()
    returns uuid
    as $$
begin
    return(
        select
            id
        from
            public.users
        order by
            random()
        limit 1);
end;
$$
language plpgsql;

-- Get random choice (string)
create or replace function dummy.get_random_choice(variadic options varchar[])
    returns varchar
    as $$
begin
    return options[floor(random() * cardinality(options) + 1)];
end;
$$
language plpgsql;

-- Get random MC Version (integer)
create type dummy.minecraft_version as (
    version_text text,
    code integer,
    type TEXT
);

create or replace function dummy.get_random_mcversion_int(min_version int default 0, max_version int default 999999, releases_only boolean default false)
    returns integer
    as $$
declare
    versions CONSTANT dummy.minecraft_version[] := array[row ('1.20.4', 3700, 'release'), row ('1.20.4 Release Candidate 1', 3699, 'snapshot'), row ('1.20.3', 3698, 'release'), row ('1.20.3 Release Candidate 1', 3697, 'snapshot'), row ('1.20.3 Pre-Release 4', 3696, 'snapshot'), row ('1.20.3 Pre-Release 3', 3695, 'snapshot'), row ('1.20.3 Pre-Release 2', 3694, 'snapshot'), row ('1.20.3 Pre-Release 1', 3693, 'snapshot'), row ('23w46a', 3691, 'snapshot'), row ('23w45a', 3690, 'snapshot'), row ('23w44a', 3688, 'snapshot'), row ('23w43b', 3687, 'snapshot'), row ('23w43a', 3686, 'snapshot'), row ('23w42a', 3684, 'snapshot'), row ('23w41a', 3681, 'snapshot'), row ('23w40a', 3679, 'snapshot'), row ('1.20.2', 3578, 'release'), row ('1.20.2 Release Candidate 2', 3577, 'snapshot'), row ('1.20.2 Release Candidate 1', 3576, 'snapshot'), row ('1.20.2 Pre-Release 4', 3575, 'snapshot'), row ('1.20.2 Pre-Release 3', 3574, 'snapshot'), row ('1.20.2 Pre-release 2', 3573, 'snapshot'), row ('1.20.2 Pre-release 1', 3572, 'snapshot'), row ('23w35a', 3571, 'snapshot'), row ('23w33a', 3570, 'snapshot'), row ('23w32a', 3569, 'snapshot'), row ('23w31a', 3567, 'snapshot'), row ('1.20.1', 3465, 'release'), row ('1.20.1 Release Candidate 1', 3464, 'snapshot'), row ('1.20', 3463, 'release'), row ('1.20 Release Candidate 1', 3462, 'snapshot'), row ('1.20 Pre-release 7', 3461, 'snapshot'), row ('1.20 Pre-release 6', 3460, 'snapshot'), row ('1.20 Pre-release 5', 3458, 'snapshot'), row ('1.20 Pre-release 4', 3457, 'snapshot'), row ('1.20 Pre-release 3', 3456, 'snapshot'), row ('1.20 Pre-release 2', 3455, 'snapshot'), row ('1.20 Pre-release 1', 3454, 'snapshot'), row ('23w18a', 3453, 'snapshot'), row ('23w17a', 3452, 'snapshot'), row ('23w16a', 3449, 'snapshot'), row ('23w14a', 3445, 'snapshot'), row ('23w13a', 3443, 'snapshot'), row ('23w12a', 3442, 'snapshot'), row ('1.19.4', 3337, 'release'), row ('1.19.4 Release Candidate 3', 3336, 'snapshot'), row ('1.19.4 Release Candidate 2', 3335, 'snapshot'), row ('1.19.4 Release Candidate 1', 3334, 'snapshot'), row ('1.19.4 Pre-release 4', 3333, 'snapshot'), row ('1.19.4 Pre-release 3', 3332, 'snapshot'), row ('1.19.4 Pre-release 2', 3331, 'snapshot'), row ('1.19.4 Pre-release 1', 3330, 'snapshot'), row ('23w07a', 3329, 'snapshot'), row ('23w06a', 3326, 'snapshot'), row ('23w05a', 3323, 'snapshot'), row ('23w04a', 3321, 'snapshot'), row ('23w03a', 3320, 'snapshot'), row ('1.19.3', 3218, 'release'), row ('1.19.3 Release Candidate 3', 3217, 'snapshot'), row ('1.19.3 Release Candidate 2', 3216, 'snapshot'), row ('1.19.3 Release Candidate 1', 3215, 'snapshot'), row ('1.19.3 Pre-release 3', 3213, 'snapshot'), row ('1.19.3 Pre-release 2', 3212, 'snapshot'), row ('1.19.3 Pre-release 1', 3211, 'snapshot'), row ('22w46a', 3210, 'snapshot'), row ('22w45a', 3208, 'snapshot'), row ('22w44a', 3207, 'snapshot'), row ('22w43a', 3206, 'snapshot'), row ('22w42a', 3205, 'snapshot'), row ('1.19.2', 3120, 'release'), row ('1.19.2 Release Candidate 2', 3119, 'snapshot'), row ('1.19.2 Release Candidate 1', 3118, 'snapshot'), row ('1.19.1', 3117, 'release'), row ('1.19.1 Release Candidate 3', 3116, 'snapshot'), row ('1.19.1 Release Candidate 2', 3115, 'snapshot'), row ('1.19.1 Pre-release 6', 3114, 'snapshot'), row ('1.19.1 Pre-release 5', 3113, 'snapshot'), row ('1.19.1 Pre-release 4', 3112, 'snapshot'), row ('1.19.1 Pre-release 3', 3111, 'snapshot'), row ('1.19.1 Pre-release 2', 3110, 'snapshot'), row ('1.19.1 Release Candidate 1', 3109, 'snapshot'), row ('1.19.1 Pre-release 1', 3107, 'snapshot'), row ('22w24a', 3106, 'snapshot'), row ('1.19', 3105, 'release'), row ('1.19 Release Candidate 2', 3104, 'snapshot'), row ('1.19 Release Candidate 1', 3103, 'snapshot'), row ('1.19 Pre-release 5', 3102, 'snapshot'), row ('1.19 Pre-release 4', 3101, 'snapshot'), row ('1.19 Pre-release 3', 3100, 'snapshot'), row ('1.19 Pre-release 2', 3099, 'snapshot'), row ('1.19 Pre-release 1', 3098, 'snapshot'), row ('22w19a', 3096, 'snapshot'), row ('22w18a', 3095, 'snapshot'), row ('22w17a', 3093, 'snapshot'), row ('22w16b', 3092, 'snapshot'), row ('22w16a', 3091, 'snapshot'), row ('22w15a', 3089, 'snapshot'), row ('22w14a', 3088, 'snapshot'), row ('22w13a', 3085, 'snapshot'), row ('22w12a', 3082, 'snapshot'), row ('22w11a', 3080, 'snapshot'), row ('1.18.2', 2975, 'release'), row ('1.18.2 Release Candidate 1', 2974, 'snapshot'), row ('1.18.2 Pre-release 3', 2973, 'snapshot'), row ('1.18.2 Pre-release 2', 2972, 'snapshot'), row ('1.18.2 Pre-release 1', 2971, 'snapshot'), row ('22w07a', 2969, 'snapshot'), row ('22w06a', 2968, 'snapshot'), row ('22w05a', 2967, 'snapshot'), row ('22w03a', 2966, 'snapshot'), row ('1.18.1', 2865, 'release'), row ('1.18.1 Release Candidate 3', 2864, 'snapshot'), row ('1.18.1 Release Candidate 2', 2863, 'snapshot'), row ('1.18.1 Release Candidate 1', 2862, 'snapshot'), row ('1.18.1 Pre-release 1', 2861, 'snapshot'), row ('1.18', 2860, 'release'), row ('1.18 Release Candidate 4', 2859, 'snapshot'), row ('1.18 Release Candidate 3', 2858, 'snapshot'), row ('1.18 Release Candidate 2', 2857, 'snapshot'), row ('1.18 Release Candidate 1', 2856, 'snapshot'), row ('1.18 Pre-release 8', 2855, 'snapshot'), row ('1.18 Pre-release 7', 2854, 'snapshot'), row ('1.18 Pre-release 6', 2853, 'snapshot'), row ('1.18 Pre-release 5', 2851, 'snapshot'), row ('1.18 Pre-release 4', 2850, 'snapshot'), row ('1.18 Pre-release 3', 2849, 'snapshot'), row ('1.18 Pre-release 2', 2848, 'snapshot'), row ('1.18 Pre-release 1', 2847, 'snapshot'), row ('21w44a', 2845, 'snapshot'), row ('21w43a', 2844, 'snapshot'), row ('21w42a', 2840, 'snapshot'), row ('21w41a', 2839, 'snapshot'), row ('21w40a', 2838, 'snapshot'), row ('21w39a', 2836, 'snapshot'), row ('21w38a', 2835, 'snapshot'), row ('21w37a', 2834, 'snapshot'), row ('1.17.1', 2730, 'release'), row ('1.17.1 Release Candidate 2', 2729, 'snapshot'), row ('1.17.1 Release Candidate 1', 2728, 'snapshot'), row ('1.17.1 Pre-release 3', 2727, 'snapshot'), row ('1.17.1 Pre-release 2', 2726, 'snapshot'), row ('1.17.1 Pre-release 1', 2725, 'snapshot'), row ('1.17', 2724, 'release'), row ('1.17 Release Candidate 2', 2723, 'snapshot'), row ('1.17 Release Candidate 1', 2722, 'snapshot'), row ('1.17 Pre-release 5', 2721, 'snapshot'), row ('1.17 Pre-release 4', 2720, 'snapshot'), row ('1.17 Pre-release 3', 2719, 'snapshot'), row ('1.17 Pre-release 2', 2718, 'snapshot'), row ('1.17 Pre-release 1', 2716, 'snapshot'), row ('21w20a', 2715, 'snapshot'), row ('21w19a', 2714, 'snapshot'), row ('21w18a', 2713, 'snapshot'), row ('21w17a', 2712, 'snapshot'), row ('21w16a', 2711, 'snapshot'), row ('21w15a', 2709, 'snapshot'), row ('21w14a', 2706, 'snapshot'), row ('21w13a', 2705, 'snapshot'), row ('21w11a', 2703, 'snapshot'), row ('21w10a', 2699, 'snapshot'), row ('21w08b', 2698, 'snapshot'), row ('21w08a', 2697, 'snapshot'), row ('21w07a', 2695, 'snapshot'), row ('21w06a', 2694, 'snapshot'), row ('21w05b', 2692, 'snapshot'), row ('21w05a', 2690, 'snapshot'), row ('21w03a', 2689, 'snapshot'), row ('20w51a', 2687, 'snapshot'), row ('20w49a', 2685, 'snapshot'), row ('20w48a', 2683, 'snapshot'), row ('20w46a', 2682, 'snapshot'), row ('20w45a', 2681, 'snapshot'), row ('1.16.5', 2586, 'release'), row ('1.16.5 Release Candidate 1', 2585, 'snapshot'), row ('1.16.4', 2584, 'release'), row ('1.16.4 Release Candidate 1', 2583, 'snapshot'), row ('1.16.4 Pre-release 2', 2582, 'snapshot'), row ('1.16.4 Pre-release 1', 2581, 'snapshot'), row ('1.16.3', 2580, 'release'), row ('1.16.3 Release Candidate 1', 2579, 'snapshot'), row ('1.16.2', 2578, 'release'), row ('1.16.2 Release Candidate 2', 2577, 'snapshot'), row ('1.16.2 Release Candidate 1', 2576, 'snapshot'), row ('1.16.2 Pre-release 3', 2575, 'snapshot'), row ('1.16.2 Pre-release 2', 2574, 'snapshot'), row ('1.16.2 Pre-release 1', 2573, 'snapshot'), row ('20w30a', 2572, 'snapshot'), row ('20w29a', 2571, 'snapshot'), row ('20w28a', 2570, 'snapshot'), row ('20w27a', 2569, 'snapshot'), row ('1.16.1', 2567, 'release'), row ('1.16', 2566, 'release'), row ('1.16 Release Candidate 1', 2565, 'snapshot'), row ('1.16 Pre-release 8', 2564, 'snapshot'), row ('1.16 Pre-release 7', 2563, 'snapshot'), row ('1.16 Pre-release 6', 2562, 'snapshot'), row ('1.16 Pre-release 5', 2561, 'snapshot'), row ('1.16 Pre-release 4', 2560, 'snapshot'), row ('1.16 Pre-release 3', 2559, 'snapshot'), row ('1.16 Pre-release 2', 2557, 'snapshot'), row ('1.16 Pre-release 1', 2556, 'snapshot'), row ('20w22a', 2555, 'snapshot'), row ('20w21a', 2554, 'snapshot'), row ('20w20b', 2537, 'snapshot'), row ('20w20a', 2536, 'snapshot'), row ('20w19a', 2534, 'snapshot'), row ('20w18a', 2532, 'snapshot'), row ('20w17a', 2529, 'snapshot'), row ('20w16a', 2526, 'snapshot'), row ('20w15a', 2525, 'snapshot'), row ('20w14a', 2524, 'snapshot'), row ('20w13b', 2521, 'snapshot'), row ('20w13a', 2520, 'snapshot'), row ('20w12a', 2515, 'snapshot'), row ('20w11a', 2513, 'snapshot'), row ('20w10a', 2512, 'snapshot'), row ('20w09a', 2510, 'snapshot'), row ('20w08a', 2507, 'snapshot'), row ('20w07a', 2506, 'snapshot'), row ('Snapshot 20w06a', 2504, 'snapshot'), row ('1.15.2', 2230, 'release'), row ('1.15.2 Pre-release 2', 2229, 'snapshot'), row ('1.15.2 Pre-Release 1', 2228, 'snapshot'), row ('1.15.1', 2227, 'release'), row ('1.15.1 Pre-release 1', 2226, 'snapshot'), row ('1.15', 2225, 'release'), row ('1.15 Pre-release 7', 2224, 'snapshot'), row ('1.15 Pre-release 6', 2223, 'snapshot'), row ('1.15 Pre-release 5', 2222, 'snapshot'), row ('1.15 Pre-release 4', 2221, 'snapshot'), row ('1.15 Pre-release 3', 2220, 'snapshot'), row ('1.15 Pre-Release 2', 2219, 'snapshot'), row ('1.15 Pre-release 1', 2218, 'snapshot'), row ('19w46b', 2217, 'snapshot'), row ('19w46a', 2216, 'snapshot'), row ('19w45b', 2215, 'snapshot'), row ('19w45a', 2214, 'snapshot'), row ('19w44a', 2213, 'snapshot'), row ('19w42a', 2212, 'snapshot'), row ('19w41a', 2210, 'snapshot'), row ('19w40a', 2208, 'snapshot'), row ('19w39a', 2207, 'snapshot'), row ('19w38b', 2206, 'snapshot'), row ('19w38a', 2205, 'snapshot'), row ('19w37a', 2204, 'snapshot'), row ('19w36a', 2203, 'snapshot'), row ('19w35a', 2201, 'snapshot'), row ('19w34a', 2200, 'snapshot'), row ('1.14.4', 1976, 'release'), row ('1.14.4 Pre-Release 7', 1975, 'snapshot'), row ('1.14.4 Pre-Release 6', 1974, 'snapshot'), row ('1.14.4 Pre-Release 5', 1973, 'snapshot'), row ('1.14.4 Pre-Release 4', 1972, 'snapshot'), row ('1.14.4 Pre-Release 3', 1971, 'snapshot'), row ('1.14.4 Pre-Release 2', 1970, 'snapshot'), row ('1.14.4 Pre-Release 1', 1969, 'snapshot'), row ('1.14.3', 1968, 'release'), row ('1.14.3 Pre-Release 4', 1967, 'snapshot'), row ('1.14.3 Pre-Release 3', 1966, 'snapshot'), row ('1.14.3 Pre-Release 2', 1965, 'snapshot'), row ('1.14.3 Pre-Release 1', 1964, 'snapshot'), row ('1.14.2', 1963, 'release'), row ('1.14.2 Pre-Release 4', 1962, 'snapshot'), row ('1.14.2 Pre-Release 3', 1960, 'snapshot'), row ('1.14.2 Pre-Release 2', 1959, 'snapshot'), row ('1.14.2 Pre-Release 1', 1958, 'snapshot'), row ('1.14.1', 1957, 'release'), row ('1.14.1 Pre-Release 2', 1956, 'snapshot'), row ('1.14.1 Pre-Release 1', 1955, 'snapshot'), row ('1.14', 1952, 'release')];
    version_count int := ARRAY_LENGTH(versions, 1);
    selected_version int;
begin
    if RANDOM() < 0.25 then
        return null;
    else
        if releases_only then
            -- Filter for release versions
            selected_version := FLOOR(RANDOM() * version_count) + 1;
            WHILE versions[selected_version].type <> 'release' loop
                selected_version := FLOOR(RANDOM() * version_count) + 1;
            end loop;
        else
            -- Return any version
            selected_version := FLOOR(RANDOM() * version_count) + 1;
        end if;
        return versions[selected_version].code;
    end if;
end;
$$
language plpgsql;

-- Get random size (integer[])
create or replace function dummy.generate_random_size_dimensions(variance integer default 4)
    returns integer[]
    as $$
declare
    -- Generate a random number between 4 and 33
    base integer := FLOOR(RANDOM() * 33) + 4;
    x integer := base + FLOOR(RANDOM() * variance * 2) - variance;
    y integer := base + FLOOR(RANDOM() * variance * 2) - variance;
    z integer := base + FLOOR(RANDOM() * variance * 2) - variance;
begin
    x := GREATEST(x, 1);
    y := GREATEST(y, 1);
    z := GREATEST(z, 1);
    return array[x, y, z];
end;
$$
language plpgsql;

-- Get random blocks ({string:integer})
create or replace function dummy.generate_random_blocks()
    returns jsonb
    as $$
declare
    blocks jsonb := JSONB_BUILD_OBJECT('redstone_torch', case when RANDOM() < 0.7 then
            CEILING(RANDOM() * 10)
    else
        0
        end, 'redstone_wire', case when true then
            CEILING(RANDOM() * 10)
    else
        0
        end, 'redstone_lamp', case when RANDOM() < 0.3 then
            CEILING(RANDOM() * 10)
    else
        0
        end, 'redstone_block', case when RANDOM() < 0.2 then
            CEILING(RANDOM() * 10)
    else
        0
        end, 'glass', case when RANDOM() < 0.3 then
            CEILING(RANDOM() * 10)
    else
        0
        end, 'white_wool', case when RANDOM() < 0.8 then
            CEILING(RANDOM() * 10)
    else
        0
        end, 'piston', case when RANDOM() < 0.6 then
            CEILING(RANDOM() * 10)
    else
        0
        end, 'dispenser', case when RANDOM() < 0.4 then
            CEILING(RANDOM() * 10)
    else
        0
        end, 'sticky_piston', case when RANDOM() < 0.4 then
            CEILING(RANDOM() * 10)
    else
        0
        end, 'slime_block', case when RANDOM() < 0.2 then
            CEILING(RANDOM() * 10)
    else
        0
        end, 'black_wool', case when RANDOM() < 0.2 then
            CEILING(RANDOM() * 10)
    else
        0
        end, 'repeater', case when RANDOM() < 0.2 then
            CEILING(RANDOM() * 10)
    else
        0
        end, 'comparator', case when RANDOM() < 0.1 then
            CEILING(RANDOM() * 10)
    else
        0
        end, 'obsidian', case when RANDOM() < 0.1 then
            CEILING(RANDOM() * 10)
    else
        0
        end);
    non_zero_blocks jsonb;
begin
    select
        JSONB_OBJECT_AGG(key, value) into non_zero_blocks
    from (
        select
            *
        from
            JSONB_EACH_TEXT(blocks)
        where
            value::int <> '0') as s;
    return non_zero_blocks;
end;
$$
language plpgsql;

-- Get random timestamp
create or replace function dummy.generate_random_timestamp(start_date timestamptz default current_timestamp - interval '1 year', end_date timestamptz default current_timestamp)
    returns timestamptz
    as $$
declare
    random_seconds double precision;
    random_interval interval;
    random_timestamp timestamptz;
begin
    -- Calculate the range in seconds
    random_seconds := EXTRACT(EPOCH from (end_date - start_date)) * random();
    -- Generate a random interval
    random_interval := random_seconds * interval '1 second';
    -- Calculate the random timestamp
    random_timestamp := start_date + random_interval;
    return random_timestamp;
end;
$$
language plpgsql;


/*
 * Dummy data related to things submitted to the platform.
 * (Must be inside a code block in order to use utility functions)
 */
do $$
begin
    if false then
        return;
    end if;

    /*
     * Dummy Tags
     */
    insert into public.tags(name, description, keywords, recommended)
        values('Door', 'It is a door!', 'door moves blocks', true);
    insert into public.tags(name, description, keywords, created_by, parent_id, recommended)
        values('Piston trapdoor', 'Uses pistons to create an opening in the floor', 'trapdoor pistons door', 'c7a11191-7ef9-43dc-8c21-a07aeadf13db', 1, true);
    -- Generate 200 dummy tags
    insert into tags(name, description, keywords, created_by)
    select
        '~ Dummy Tag #' || generate_series,
        'This is the description for tag#' || generate_series,
        md5(random()::text),
        dummy.get_random_user_id()
    from
        generate_series(1, 200);

    /*
     * Dummy Specifications
     */
    insert into public.specifications(name, description, keywords, unit)
        values('Opening time', 'Time taken for a door to open in game ticks.', 'door moves blocks open', 'Game ticks');
    insert into public.specifications(name, description, keywords, unit)
        values('Initial delay', 'Time taken between activating the machine, until it starts operating.', 'delay time', 'Game ticks');
    insert into public.specifications(name, description, keywords, unit)
        values('Items per minute', 'Number of any arbitrary items yielded per minute.', 'items production yeild', 'Items per minute');
    -- Generate 200 dummy specifications
    insert into public.specifications(name, description, keywords, unit, created_by)
    select
        '~ Dummy Spec #' || generate_series,
        'This is the description for spec#' || generate_series,
        md5(random()::text),
        dummy.get_random_choice(null, 'Items per minute', 'Blocks per minute', 'Iterations per minute', 'Game ticks'),
        dummy.get_random_user_id()
    from
        generate_series(1, 200);

    /*
     * Dummy Schematics
     */
    insert into public.schematics(user_id, object_path)
        values('c7a11191-7ef9-43dc-8c21-a07aeadf13db', 'dummy_object_path.nbt');
    insert into public.schematics(user_id, object_path)
        values('c7a11191-7ef9-43dc-8c21-a07aeadf13db', 'dummy_object_path.nbt');
    insert into public.schematics(user_id, object_path)
        values('c7a11191-7ef9-43dc-8c21-a07aeadf13db', 'dummy_object_path.nbt');
    insert into public.schematics(user_id, object_path)
        values('c7a11191-7ef9-43dc-8c21-a07aeadf13db', 'dummy_object_path.nbt');
    -- Generate 300 dummy schematics
    insert into public.schematics(user_id, object_path)
    select
        dummy.get_random_user_id(),
        'dummy_object_path.nbt'
    from
        generate_series(3, 300);

    /*
     * Dummy Builds
     */
    insert into public.builds(id, user_id, works_in_version, breaks_in_version, title, description, tags, specifications, size_dimensions, block_counts, schematic_hash)
        values(1, 'c7a11191-7ef9-43dc-8c21-a07aeadf13db', dummy.get_random_mcversion_int(0, 2714, true), dummy.get_random_mcversion_int(2714, 999999, true), 'Super 1 Build', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', '{1,2,3}'::integer[], '{"1":5,"2":10,"3":15}'::jsonb, '{3,3,3}'::integer[], '{"redstone_wire":5,"redstone_lamp":10,"white_wool":15}'::jsonb, 'abc');
    insert into public.builds(id, user_id, works_in_version, title, description, tags, specifications, size_dimensions, block_counts, schematic_hash, created_at)
        values(2, 'c7a11191-7ef9-43dc-8c21-a07aeadf13db', dummy.get_random_mcversion_int(0, 2714, true), 'Mega 2 Build', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', '{1}'::integer[], '{"1":10}'::jsonb, '{7,7,7}'::integer[], '{"redstone_wire":5,"piston":10,"white_wool":15}'::jsonb, 'abc', dummy.generate_random_timestamp());
    insert into public.builds(id, user_id, tested_in_version, title, description, tags, specifications, size_dimensions, block_counts, schematic_hash, created_at)
        values(3, 'c7a11191-7ef9-43dc-8c21-a07aeadf13db', dummy.get_random_mcversion_int(2000, 3000), 'Uber 3 Build', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', '{2,3}'::integer[], '{"2":20,"3":20}'::jsonb, '{17,17,17}'::integer[], '{"redstone_wire":5,"redstone_torch":10,"dispenser":10,"yellow_wool":15}'::jsonb, 'abc', dummy.generate_random_timestamp());
    -- Generate 150 dummy builds
    insert into public.builds(id, user_id, works_in_version, breaks_in_version, tested_in_version, title, description, size_dimensions, block_counts, schematic_hash, created_at)
    select
        generate_series,
(
            select
                user_id
            from
                schematics
            where
                id = generate_series)::uuid,
        dummy.get_random_mcversion_int(0, 2714, true),
        dummy.get_random_mcversion_int(2714, 999999, true),
        dummy.get_random_mcversion_int(2000, 3000),
        '~ Dummy Build #' || generate_series,
        'Dummy Build Description...',
        dummy.generate_random_size_dimensions(),
        dummy.generate_random_blocks(),
        'abc',
        dummy.generate_random_timestamp()
    from
        generate_series(4, 150);

    /*
     * Dummy Build Likes
     */
    --  Distribute 80 (or less) likes between the first 15 builds
    insert into build_likes(user_id, build_id)
    select distinct
        dummy.get_random_user_id(),
        build_id
    from(
        select
            floor(random() * 12) + 1 as build_id
        from
            generate_series(1, 100)) as random_build_ids;

    /*
     * Dummy Notifications
     */
    insert into user_notifications(user_id, message, icon, link, created_at)
    select
        u.id,
        'Notification message ' || generate_series,
        dummy.get_random_choice('far fa-comment', 'fas fa-reply', 'fas fa-thumbs-up'),
        '/users/' || u.numeric_id,
        now() - interval '1 day' * generate_series
    from
        public.users u
    cross join generate_series(1, 3);

    /*
     * Dummy Comments
     */
    insert into public.comments(build_id, user_id, content)
        values (1, 'c7a11191-7ef9-43dc-8c21-a07aeadf13db', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate rutrum velit, et vulputate leo tristique in.

Vestibulum elementum enim dolor, sed ullamcorper erat lacinia eu. Quisque vel tellus eget orci condimentum accumsan vel vitae dui. Suspendisse gravida, est vel porta hendrerit, nisi metus semper nisl, eu condimentum ipsum lorem eget dolor. Duis ut turpis a ante posuere vehicula ut sed odio. Duis pulvinar facilisis risus sit amet placerat. Etiam hendrerit quis augue ut elementum.

Vivamus ut arcu ut lorem venenatis molestie quis vitae ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.');
    insert into public.comments(build_id, user_id, content, replying_to)
        values (1, '294f5815-8923-4199-8c7d-1f97eff84565', 'Curabitur aliquam felis nec quam accumsan accumsan.

Proin pretium vehicula dictum. Vestibulum eu tempus orci.

Fusce id nibh non dolor ullamcorper sagittis. Morbi auctor magna eros, et sodales ligula suscipit quis. Sed libero arcu, malesuada et arcu eu, facilisis ultricies turpis. Nulla quis mattis felis. Vivamus sollicitudin faucibus hendrerit. Nullam mi purus, congue a arcu sed, lacinia viverra nisl.', 1);
    insert into public.comments(build_id, user_id, content, replying_to)
        values (1, 'c7a11191-7ef9-43dc-8c21-a07aeadf13db', 'Aliquam id eros at nisl commodo tristique. Nunc tellus quam, luctus ut tellus vitae, ultricies condimentum diam. In consequat non ipsum et varius. Vestibulum ac magna vel velit laoreet sodales ac id justo.

Mauris quis rhoncus mauris.', 2);

    /*
     * Dummy User Reports
     */
    insert into user_reports(reporter_user_id, reported_user_id, link, topic, reason)
    select
        dummy.get_random_user_id(),
        dummy.get_random_user_id(),
        '/',
        '~Dummy User Report',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vulputate rutrum velit, et vulputate leo tristique in.'
    from
        generate_series(1, 70);

    /*
     * Initialize materialized views
     */
    refresh materialized view trending_builds_view;
    refresh materialized view recent_builds_view;
    -- Refresh every minute while in dev
    perform
        cron.schedule('* * * * *', 'REFRESH MATERIALIZED VIEW trending_builds_view;');
    perform
        cron.schedule('* * * * *', 'REFRESH MATERIALIZED VIEW recent_builds_view;');
end
$$;
