/*
 * Extra Schematics table
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

create policy "Build owner can add extra build schematics." on build_extra_schematics
    for insert to authenticated
        with check (auth.uid() =(
            select
                user_id
            from
                public.builds
            where
                id = build_extra_schematics.build_id));

create policy "Build owner can delete extra build schematics." on build_extra_schematics
    for delete to authenticated
        using (auth.uid() =(
            select
                user_id
            from
                public.builds
            where
                id = build_extra_schematics.build_id));

revoke update on table build_extra_schematics from authenticated;
