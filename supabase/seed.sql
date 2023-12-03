/*
 * Dummy users
 */
insert into auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at)
    values ('00000000-0000-0000-0000-000000000000', 'c7a11191-7ef9-43dc-8c21-a07aeadf13db', 'authenticated', 'administrator', 'markjunk669@gmail.com', '$2a$10$v9w29SuUX.42hVIBMTq2LOOoDIynDllmZehFELHcn1ezrUG9sY1hu', '2023-01-11 16:54:12.7991+00', null, '', null, '', null, '', '', null, '2023-01-11 16:54:12.801124+00', '{"provider": "email", "providers": ["email"]}', '{"initial_username":"SuperPlasma"}', null, '2023-01-11 16:54:12.796822+00', '2023-01-11 16:54:12.80197+00', null, null, '', '', null, '', 0, null, '', null);

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

create or replace function dummy.get_random_choice(variadic options varchar[])
    returns varchar
    as $$
begin
    return options[floor(random() * cardinality(options) + 1)];
end;
$$
language plpgsql;

create or replace function dummy.get_random_mcversion_int()
    returns bigint
    as $$
declare
    millions int := floor(random() * 30) + 1;
    thousands int := floor(random() * 21);
    units int := floor(random() * 6);
begin
    return (millions * 1000000) +(thousands * 1000) + units;
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
    insert into tags(name, description, keywords, created_by, recommended)
    select
        '~ Dummy Tag #' || generate_series,
        'This is the description for tag#' || generate_series,
        md5(random()::text),
        dummy.get_random_user_id(),
        generate_series > 180
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
        dummy.get_random_choice('None', 'Items per minute', 'Blocks per minute', 'Iterations per minute', 'Game ticks'),
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
    insert into public.builds(id, user_id, works_in_version_int, breaks_in_version_int, title, description, tags, specifications)
        values(1, 'c7a11191-7ef9-43dc-8c21-a07aeadf13db', 1019004, 1020001, 'Super 1 Build', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', '{1,2,3}'::integer[], '{"1":5,"2":10,"3":15}'::jsonb);
    insert into public.builds(id, user_id, works_in_version_int, breaks_in_version_int, title, description, tags, specifications)
        values(2, 'c7a11191-7ef9-43dc-8c21-a07aeadf13db', 1018001, null, 'Mega 2 Build', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', '{1}'::integer[], '{"1":10}'::jsonb);
    insert into public.builds(id, user_id, works_in_version_int, breaks_in_version_int, title, description, tags, specifications)
        values(3, 'c7a11191-7ef9-43dc-8c21-a07aeadf13db', null, null, 'Uber 3 Build', 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', '{2,3}'::integer[], '{"2":20,"3":20}'::jsonb);
    -- Generate 150 dummy builds
    insert into public.builds(id, user_id, works_in_version_int, breaks_in_version_int, title, description)
    select
        generate_series,
(
            select
                user_id
            from
                schematics
            where
                id = generate_series)::uuid,
        dummy.get_random_mcversion_int(),
        dummy.get_random_mcversion_int(),
        '~ Dummy Build #' || generate_series,
        'Dummy Build Description...'
    from
        generate_series(4, 150);
end
$$;
