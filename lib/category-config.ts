export interface SubcategoryConfig {
  label: string;
  slug: string;
}

export const categorySubcategories = {
  "property-preservation": {
    label: "Property Preservation Services",
    children: [
      { label: "Securing & Boarding", slug: "securing-boarding" },
      { label: "Debris & Trash-Outs", slug: "debris-trash-outs" },
      { label: "Yard & Maintenance", slug: "yard-maintenance" },
      { label: "Cleaning & Restoration", slug: "cleaning-restoration" },
      { label: "Repairs & Rehab", slug: "repairs-rehab" },
    ],
  },
  "field-inspections": {
    label: "Field Inspections",
    children: [
      { label: "Occupancy Inspections", slug: "occupancy-inspections" },
      { label: "Inspection Types", slug: "inspection-types" },
      { label: "Inspection Pay & Tech", slug: "inspection-pay-tech" },
    ],
  },
  "field-service-companies": {
    label: "Field Service Companies",
    children: [
      {
        label: "National & Regional Companies",
        slug: "national-regional-companies",
      },
      { label: "Company Moves", slug: "company-moves" },
      { label: "Technology & Platforms", slug: "technology-platforms" },
    ],
  },
  "contractors-vendors": {
    label: "Contractors & Vendors",
    children: [
      { label: "Vendor Business", slug: "vendor-business" },
      { label: "Jobs & Careers", slug: "jobs-careers" },
      { label: "Training & Startup", slug: "training-startup" },
    ],
  },
  "foreclosure-reo": {
    label: "Foreclosure & REO",
    children: [
      { label: "Foreclosure News", slug: "foreclosure-news" },
      { label: "REO & Bank-Owned", slug: "reo-bank-owned" },
      { label: "Vacant Properties", slug: "vacant-properties" },
    ],
  },
  "compliance-pricing": {
    label: "Compliance & Pricing",
    children: [
      { label: "Investor Guidelines", slug: "investor-guidelines" },
      { label: "HUD & FHA Rules", slug: "hud-fha-rules" },
      { label: "Pricing & Allowables", slug: "pricing-allowables" },
      { label: "State & Local Rules", slug: "state-local-rules" },
    ],
  },
  "disaster-field-alerts": {
    label: "Disaster & Field Alerts",
    children: [
      { label: "Disaster Events", slug: "disaster-events" },
      { label: "Disaster Response", slug: "disaster-response" },
    ],
  },
} as const;

export type CategoryWithSubcategories = keyof typeof categorySubcategories;

export function getSubcategoriesForParent(
  parentSlug: string
): readonly SubcategoryConfig[] {
  return (
    categorySubcategories[parentSlug as CategoryWithSubcategories]?.children ??
    []
  );
}

export function getSubcategory(parentSlug: string, childSlug: string) {
  return getSubcategoriesForParent(parentSlug).find(
    (item) => item.slug === childSlug
  );
}

export const allCategorySubcategories = Object.entries(
  categorySubcategories
).flatMap(([parentSlug, parent]) =>
  parent.children.map((child) => ({
    parentSlug,
    parentLabel: parent.label,
    ...child,
  }))
);
