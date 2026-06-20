import { demoCityOptions } from "@/lib/hr-options";
import type { SalesCompany } from "@/lib/services/sales";

function normalizeText(value: unknown) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getRecordText(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

export function inferLocationCity(location: Record<string, unknown>) {
  const explicitCity = getRecordText(location, "city");
  if (explicitCity) return explicitCity;

  const normalizedName = normalizeText(location.name);
  return demoCityOptions.find((city) => normalizedName.includes(normalizeText(city))) || "";
}

export function getSalesCompanyAliases(company?: SalesCompany | null) {
  if (!company) return [];
  const hints = [company.name, company.slug, company.code].filter(Boolean).map(String);
  const key = normalizeText(`${company.code || ""} ${company.slug || ""} ${company.name || ""}`);
  if (key.includes("acme")) hints.push("acme", "acme retail");
  if (key.includes("north")) hints.push("northstar", "northstar services");
  if (key.includes("vertex")) hints.push("vertex", "vertex distribution");
  if (key.includes("atlas")) hints.push("atlas", "atlas support");
  if (key.includes("summit")) hints.push("summit", "summit field ops");
  if (key.includes("nova")) hints.push("nova", "nova digital");
  if (key.includes("horizon")) hints.push("horizon", "horizon logistics");

  return Array.from(new Set(hints.map(normalizeText).filter(Boolean)));
}

export function locationMatchesCompany(location: Record<string, unknown>, company?: SalesCompany | null) {
  if (!company) return true;
  const locationProjectId = getRecordText(location, "project_id");
  if (locationProjectId && locationProjectId === company.id) return true;

  const relation = location.project as Record<string, unknown> | null | undefined;
  if (relation && getRecordText(relation, "id") === company.id) return true;

  const aliases = getSalesCompanyAliases(company);
  if (aliases.length === 0) return true;

  const projectText = normalizeText([
    location.project_name,
    relation?.name,
    relation?.slug,
    relation?.code,
    location.name,
  ].filter(Boolean).join(" "));

  return aliases.some((alias) => projectText.includes(alias));
}
