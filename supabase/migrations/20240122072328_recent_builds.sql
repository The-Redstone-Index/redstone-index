/*
 * Recent Builds Materialized View
 */
create materialized view recent_builds_view as
select
    b.*,
    to_jsonb(u.*) as author,
    to_jsonb(s.*) as schematic
from
    builds b
    join users u on b.user_id = u.id
    join schematics s on b.id = s.id
where
    b.created_at > current_date - interval '1 year'
order by
    created_at desc,
    likes_count desc,
    title asc
limit 20;


/*
 * Use cron to update the materialized view every 10 minutes
 */
select
    cron.schedule('*/10 * * * *', 'REFRESH MATERIALIZED VIEW recent_builds_view;');
