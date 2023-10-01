alter default PRIVILEGES revoke execute on FUNCTIONS from public;


/*
 * Moderator role
 * (supabse db reset does not remove roles for some reason)
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
 * (supabse db reset does not remove roles for some reason)
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
 * Ban user function
 */
create or replace function public.ban_user(user_id uuid, until_date timestamptz)
    returns text
    as $$
declare
    is_administrator boolean;
    is_moderator boolean;
begin
    -- Double-check user role
    if not auth.role() in ('moderator', 'administrator') then
        raise exception 'User should not have permission to ban user!.';
    end if;
    -- Ban user
    update
        auth.users
    set
        banned_until = until_date
    where
        id = user_id;
    end;
$$
language plpgsql;

revoke execute on function public.ban_user from anon;

revoke execute on function public.ban_user from authenticated;

grant execute on function public.ban_user to moderator;


/*
 * Change user role function
 */
create or replace function public.set_role(user_id uuid, new_role text)
    returns text
    as $$
begin
    -- Double-check user role
    if auth.role() <> 'administrator' then
        raise exception 'User should not have permission to change user role.';
    end if;
    -- Change user role (will update on next sign-in)
    update
        auth.users
    set
        role = new_role
    where
        id = user_id;
end;
$$
language plpgsql;

revoke execute on function public.set_role from anon;

revoke execute on function public.set_role from authenticated;

grant execute on function public.set_role to administrator;
