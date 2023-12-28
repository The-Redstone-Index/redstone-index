alter default PRIVILEGES revoke execute on FUNCTIONS from public;


/*
 * Moderator role
 * (supabase db reset does not remove roles for some reason)
 */
do $$
begin
    if not exists(
        select
            1
        from
            pg_roles
        where
            rolname = 'moderator') then
    create role moderator;
else
    drop role moderator;
    create role moderator;
end if;
end
$$;

grant authenticated to moderator;

grant moderator to authenticator;


/*
 * Administrator role
 * (supabase db reset does not remove roles for some reason)
 */
do $$
begin
    if not exists(
        select
            1
        from
            pg_roles
        where
            rolname = 'administrator') then
    create role administrator;
else
    drop role administrator;
    create role administrator;
end if;
end
$$;

grant moderator to administrator;

grant administrator to authenticator;


/*
create or replace function auth.is_member()
 returns boolean
 as $$
begin
 return false;
end;
$$
language plpgsql;

create or replace function auth.is_moderator_or_admin()
 returns boolean
 as $$
begin
 return auth.role() = 'administrator';
end;
$$
language plpgsql;

create or replace function auth.is_admin()
 returns boolean
 as $$
begin
 return auth.role() in('moderator', 'administrator');
end;
$$
language plpgsql;
 */
