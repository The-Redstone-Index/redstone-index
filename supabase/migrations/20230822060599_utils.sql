/*
 * Enable extensions
 */
create extension http;

select
    pg_reload_conf();


/*
 * Get Secret helper function
 */
create or replace function get_secret(name text)
    returns text
    language SQL
    immutable
    security definer
    as $$
    select
        decrypted_secret
    from
        vault.decrypted_secrets s
    where
        s.name = $1;
$$;


/*
 * Delete Storage Object helper function
 */
create or replace function delete_storage_object(bucket text, object text, out status int, out content text)
    returns record
    language 'plpgsql'
    security definer
    as $$
declare
    project_url text := get_secret('SUPABASE_URL');
    service_role_key text := get_secret('SERVICE_KEY');
    --  full access needed
    url text := project_url || '/storage/v1/object/' || bucket || '/' || object;
begin
    select
        into status,
        content result.status::int,
        result.content::text
    from
        extensions.http(('DELETE', url, array[extensions.http_header('authorization', 'Bearer ' || service_role_key)], null, null)::extensions.http_request) as result;
end;
$$;
