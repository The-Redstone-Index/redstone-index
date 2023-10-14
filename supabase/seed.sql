insert into auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at)
    values ('00000000-0000-0000-0000-000000000000', 'c7a11191-7ef9-43dc-8c21-a07aeadf13db', 'authenticated', 'authenticated', 'markjunk669@gmail.com', '$2a$10$v9w29SuUX.42hVIBMTq2LOOoDIynDllmZehFELHcn1ezrUG9sY1hu', '2023-01-11 16:54:12.7991+00', null, '', null, '', null, '', '', null, '2023-01-11 16:54:12.801124+00', '{"provider": "email", "providers": ["email"]}', '{"initial_username":"SuperPlasma"}', null, '2023-01-11 16:54:12.796822+00', '2023-01-11 16:54:12.80197+00', null, null, '', '', null, '', 0, null, '', null);

select
    vault.create_secret('http://supabase_kong_redstone-index:8000', 'SUPABASE_URL');

select
    vault.create_secret('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU', 'SERVICE_KEY')
