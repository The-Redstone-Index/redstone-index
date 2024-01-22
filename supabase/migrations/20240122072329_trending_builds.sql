/*
 * Function - Calculate Trending Score.
 *
 * Calculation:
 *
 * trending_score = popularity * recency
 * popularity = likes ^ likes_weight
 * recency = e ^ -(time_weight * time)
 *
 * "likes_weight"
 * Higher likes_weight = each like causes exponentially higher ranking
 *   e.g. at  1.5, a 50% increase in likes causes 80% increase in trending score
 *
 * "time_weight"
 * Lower time_weight = takes longer for ranking to decay based
 *   e.g. at 0.005 it takes around 140 days to half the trending score
 *
 * "time"
 * In days (fractional) since published.
 */
create or replace function calculate_build_trending_score(likes_count integer, created_at timestamptz)
    returns float
    as $$
declare
    likes_weight float := 1.5;
    time_weight float := 0.005;
    time_difference float;
    popularity float;
    recency float;
begin
    -- Popularity
    popularity := power(likes_count, likes_weight);
    -- Recency
    time_difference := EXTRACT(EPOCH from (current_timestamp - created_at)) /(3600 * 24);
    recency := exp(- time_weight * time_difference);
    -- Trending Score
    return popularity * recency;
end;
$$
language plpgsql
security definer;


/*
 * Trending Builds Materialized View
 */
create materialized view trending_builds_view as
select
    b.*,
    to_jsonb(u.*) as author,
    to_jsonb(s.*) as schematic,
    calculate_build_trending_score(b.likes_count, b.created_at) as trending_score
from
    builds b
    join users u on b.user_id = u.id
    join schematics s on b.id = s.id
where
    b.likes_count > 0
    and b.created_at > current_date - interval '1 year'
order by
    trending_score desc,
    likes_count desc,
    title asc
limit 20;


/*
 * Use cron to update the materialized view every 12 hours
 * 0 0 * * *
 */
select
    cron.schedule('0 */12 * * *', 'REFRESH MATERIALIZED VIEW trending_builds_view;');
