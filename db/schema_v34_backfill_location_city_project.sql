-- Backfill demo branch city/project metadata for employee allowed-location filtering.
-- Additive/data-fix only: no deletes and no table rebuilds.

UPDATE public.locations
SET city = CASE
  WHEN name ILIKE '%New York%' THEN 'New York'
  WHEN name ILIKE '%Chicago%' THEN 'Chicago'
  WHEN name ILIKE '%Dallas%' THEN 'Dallas'
  WHEN name ILIKE '%Atlanta%' THEN 'Atlanta'
  WHEN name ILIKE '%Denver%' THEN 'Denver'
  WHEN name ILIKE '%Seattle%' THEN 'Seattle'
  WHEN name ILIKE '%Los Angeles%' THEN 'Los Angeles'
  ELSE city
END
WHERE city IS NULL OR btrim(city) = '';

WITH classified_projects AS (
  SELECT
    l.id AS location_id,
    company.id AS project_id,
    company.name AS project_name
  FROM public.locations l
  JOIN LATERAL (
    SELECT sc.id, sc.name
    FROM public.sales_companies sc
    WHERE sc.organization_id = l.org_id
      AND sc.is_active = true
      AND (
        ((l.name ILIKE '%Acme Retail%' OR l.name ILIKE '%acme%') AND (sc.code = 'ACME' OR sc.slug = 'acme-retail'))
        OR ((l.name ILIKE '%Northstar Services%' OR l.name ILIKE '%northstar%') AND (sc.code = 'NORTH' OR sc.slug = 'northstar-services'))
        OR ((l.name ILIKE '%Vertex Distribution%' OR l.name ILIKE '%vertex%') AND (sc.code = 'VERTEX' OR sc.slug = 'vertex-distribution'))
        OR ((l.name ILIKE '%Atlas Support%' OR l.name ILIKE '%atlas%') AND (sc.code = 'ATLAS' OR sc.slug = 'atlas-support'))
        OR ((l.name ILIKE '%Summit Field Ops%' OR l.name ILIKE '%summit%') AND (sc.code = 'SUMMIT' OR sc.slug = 'summit-field-ops'))
        OR ((l.name ILIKE '%Nova Digital%' OR l.name ILIKE '%nova%') AND (sc.code = 'NOVA' OR sc.slug = 'nova-digital'))
        OR ((l.name ILIKE '%Horizon Logistics%' OR l.name ILIKE '%horizon%') AND (sc.code = 'HORIZON' OR sc.slug = 'horizon-logistics'))
      )
    ORDER BY sc.created_at ASC, sc.id ASC
    LIMIT 1
  ) company ON true
)
UPDATE public.locations l
SET
  project_id = COALESCE(l.project_id, classified_projects.project_id),
  project_name = COALESCE(NULLIF(btrim(l.project_name), ''), classified_projects.project_name)
FROM classified_projects
WHERE l.id = classified_projects.location_id
  AND (
    l.project_id IS NULL
    OR l.project_name IS NULL
    OR btrim(l.project_name) = ''
  );
