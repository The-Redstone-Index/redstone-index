/*
 * Extra Schematics table (read purpose only)
 */
create table build_extra_schematics(
    build_id integer references public.builds on delete cascade not null,
    schematic_id integer references public.schematics on delete cascade not null,
    primary key (build_id, schematic_id)
);

alter table build_extra_schematics enable row level security;

create policy "Anyone can view extra build schematics." on build_extra_schematics
    for select
        using (true);


/*
 * Synchronize the build_tags table based on builds.tags
 */
create or replace function update_build_extra_schematics()
    returns trigger
    as $$
begin
    -- Delete existing build_extra_schematics for the given build_id
    delete from build_extra_schematics
    where build_id = new.id;
    -- Insert new build_extra_schematics based on the updated tags array
    insert into build_extra_schematics(build_id, schematic_id)
    select
        new.id,
        unnest(new.extra_schematics);
    return NEW;
end;
$$
security definer
language plpgsql;

create trigger sync_build_extra_schematics_after_change
    after insert or update or delete on public.builds for each row
    execute function update_build_extra_schematics();
