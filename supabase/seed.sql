/*
 * Dummy users
 */
insert into auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at)
    values ('00000000-0000-0000-0000-000000000000', 'c7a11191-7ef9-43dc-8c21-a07aeadf13db', 'authenticated', 'authenticated', 'markjunk669@gmail.com', '$2a$10$v9w29SuUX.42hVIBMTq2LOOoDIynDllmZehFELHcn1ezrUG9sY1hu', '2023-01-11 16:54:12.7991+00', null, '', null, '', null, '', '', null, '2023-01-11 16:54:12.801124+00', '{"provider": "email", "providers": ["email"]}', '{"initial_username":"SuperPlasma"}', null, '2023-01-11 16:54:12.796822+00', '2023-01-11 16:54:12.80197+00', null, null, '', '', null, '', 0, null, '', null);

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
 * Dummy Tags
 */
insert into public.tags(name, description, keywords)
    values ('Door', 'It is a door!', 'door moves blocks');

insert into public.tags(name, description, keywords, created_by, parent_id)
    values ('Piston trapdoor', 'Uses pistons to create an opening in the floor', 'trapdoor pistons door', 'c7a11191-7ef9-43dc-8c21-a07aeadf13db', 1);

-- Generate 200 dummy tags
insert into tags(name, description, keywords, created_by)
select
    '~Dummy Tag #' || generate_series,
    'This is the description for tag#' || generate_series,
    md5(random()::text),
(
        select
            id
        from
            public.users
        order by
            random()
        limit 1)
from
    generate_series(1, 200);
