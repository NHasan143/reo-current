import type {
  Article,
  Author,
  Category,
  MostReadItem,
  NavItem,
  Newsletter,
  Tag,
  Testimonial,
} from "./types";

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const categories: Record<string, Category> = {
  "property-preservation": {
    slug: "property-preservation",
    name: "Property Preservation Services",
    description:
      "Securing, maintenance, winterization, and grass-cut coverage across the national portfolio.",
  },
  "field-inspections": {
    slug: "field-inspections",
    name: "Field Inspections",
    description:
      "Occupancy checks, insurance loss inspections, and QC standards in the field.",
  },
  "field-service-companies": {
    slug: "field-service-companies",
    name: "Field Service Companies",
    description:
      "National and regional order mills, coverage networks, and company news.",
  },
  "contractors-vendors": {
    slug: "contractors-vendors",
    name: "Contractors & Vendors",
    description:
      "Boots-on-the-ground crews: work orders, chargebacks, payments, and vendor advocacy.",
  },
  "foreclosure-reo": {
    slug: "foreclosure-reo",
    name: "Foreclosure & REO",
    description:
      "Default timelines, conveyance, REO asset management, and disposition trends.",
  },
  "compliance-pricing": {
    slug: "compliance-pricing",
    name: "Compliance & Pricing",
    description:
      "HUD, FHA, VA, and GSE guidelines, allowable schedules, and pricing updates.",
  },
  "disaster-field-alerts": {
    slug: "disaster-field-alerts",
    name: "Disaster & Field Alerts",
    description:
      "Storm response, FEMA declarations, and emergency work-order surges.",
  },
  mortgage: {
    slug: "mortgage",
    name: "Mortgage",
    description:
      "Servicing, delinquency data, and market forces shaping default volumes.",
  },
};

// ---------------------------------------------------------------------------
// Authors
// ---------------------------------------------------------------------------

export const authors: Record<string, Author> = {
  "sarah-mitchell": {
    slug: "sarah-mitchell",
    name: "Sarah Mitchell",
    role: "Senior Compliance Reporter",
    bio: "Sarah covers regulatory and pricing developments across the default servicing industry, from HUD allowable schedules to GSE conveyance standards. She has reported on property preservation for more than a decade.",
    initials: "SM",
    beat: "Compliance Watch",
    beats: [
      "Compliance & Pricing",
      "HUD",
      "Allowables",
      "Conveyance",
      "GSE Policy",
      "Licensing",
    ],
    social: {
      email: "sarah.mitchell@reocurrent.com",
      twitter: "smitchell_reo",
      linkedin: "sarah-mitchell-reo",
    },
    stats: [
      { value: "312", label: "Articles" },
      { value: "11 yrs", label: "On the beat" },
      { value: "4.8K", label: "Followers" },
    ],
  },
  "james-chen": {
    slug: "james-chen",
    name: "James Chen",
    role: "Contractor & Vendor Reporter",
    bio: "James reports on the vendor economy — order mills, subcontractor pay, and the field companies that keep the work moving.",
    initials: "JC",
    beat: "The Field Report",
    stats: [
      { value: "184", label: "Articles" },
      { value: "6", label: "Years on beat" },
      { value: "2.7K", label: "Followers" },
    ],
  },
  "david-thompson": {
    slug: "david-thompson",
    name: "David Thompson",
    role: "Field Inspections Reporter",
    bio: "David covers inspections, conveyance condition, and the data behind property-preservation quality control.",
    initials: "DT",
    stats: [
      { value: "146", label: "Articles" },
      { value: "5", label: "Years on beat" },
      { value: "1.9K", label: "Followers" },
    ],
  },
  "robert-kim": {
    slug: "robert-kim",
    name: "Robert Kim",
    role: "Preservation Reporter",
    bio: "Robert tracks preservation pricing, chargebacks, and the tooling reshaping field documentation.",
    initials: "RK",
    stats: [
      { value: "121", label: "Articles" },
      { value: "4", label: "Years on beat" },
      { value: "1.4K", label: "Followers" },
    ],
  },
  "maria-rodriguez": {
    slug: "maria-rodriguez",
    name: "Maria Rodriguez",
    role: "Foreclosure & REO Reporter",
    bio: "Maria reports on foreclosure timelines, REO disposition, and GSE property-management policy.",
    initials: "MR",
    stats: [
      { value: "158", label: "Articles" },
      { value: "7", label: "Years on beat" },
      { value: "2.3K", label: "Followers" },
    ],
  },
  "lisa-wu": {
    slug: "lisa-wu",
    name: "Lisa Wu",
    role: "Field Reporter",
    bio: "Lisa covers inspection demand, disaster response, and the regional field networks on the front line.",
    initials: "LW",
    stats: [
      { value: "97", label: "Articles" },
      { value: "3", label: "Years on beat" },
      { value: "980", label: "Followers" },
    ],
  },
  "wire-staff": {
    slug: "wire-staff",
    name: "Wire Staff",
    role: "REO Current Newsroom",
    bio: "Reporting from the REO Current newsroom.",
    initials: "WS",
    stats: [
      { value: "540", label: "Articles" },
      { value: "—", label: "Newsroom" },
      { value: "8.1K", label: "Followers" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

export const tags: Record<string, Tag> = {
  "compliance-pricing": {
    slug: "compliance-pricing",
    name: "Compliance & Pricing",
    description:
      "Regulatory change, investor guidelines, and the pricing that governs default-servicing work.",
    articleCount: 176,
  },
  hud: {
    slug: "hud",
    name: "HUD",
    description:
      "Coverage of the U.S. Department of Housing and Urban Development — allowable schedules, P260, conveyance, and FHA servicing policy.",
    articleCount: 148,
  },
  allowables: {
    slug: "allowables",
    name: "Allowables",
    description:
      "The maximum reimbursable amounts investors and insurers will pay for preservation line items.",
    articleCount: 92,
  },
  "default-servicing": {
    slug: "default-servicing",
    name: "Default Servicing",
    description:
      "The end-to-end business of servicing delinquent and defaulted mortgages.",
    articleCount: 210,
  },
  conveyance: {
    slug: "conveyance",
    name: "Conveyance",
    description:
      "Transferring title of insured properties to HUD and the condition standards that govern it.",
    articleCount: 64,
  },
  chargebacks: {
    slug: "chargebacks",
    name: "Chargebacks",
    description: "Denied and reversed reimbursements on completed work orders.",
    articleCount: 47,
  },
  gse: {
    slug: "gse",
    name: "GSE",
    description: "Fannie Mae, Freddie Mac, and FHFA policy.",
    articleCount: 133,
  },
};

// ---------------------------------------------------------------------------
// Newsletters
// ---------------------------------------------------------------------------

export const newsletters: Newsletter[] = [
  {
    slug: "morning-wire",
    name: "The Morning Wire",
    description: "Top stories",
    cadence: "Daily · 7 AM",
  },
  {
    slug: "compliance-watch",
    name: "Compliance Watch",
    description: "Rules & pricing",
    cadence: "Weekly · Mon",
  },
  {
    slug: "field-alerts",
    name: "Field Alerts",
    description: "Breaking",
    cadence: "As needed",
  },
  {
    slug: "reo-weekly",
    name: "REO Weekly",
    description: "Market & data",
    cadence: "Weekly · Fri",
  },
];

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------
// The lead article carries a full HTML body; the rest are list-weight entries
// (headline, excerpt, byline) — exactly what the templates render.

const hudBody = `
<p>The Department of Housing and Urban Development on Thursday issued its final rule overhauling the property preservation allowable fee schedule, capping a two-year review process that drew thousands of comments from field service companies, contractors, and mortgage servicers.</p>
<p>The revision raises base allowables across nearly every line item — from initial secures and lock changes to grass cuts and debris removal — marking the first broad increase in almost a decade. It also restructures how over-allowable approvals are requested and introduces a tiered system that adjusts pricing by region.</p>
<h2>What changes for vendors</h2>
<p>Industry stakeholders say the change will have immediate operational impact across the national vendor network, with regional field service companies expected to adjust work-order pricing and inspection scheduling within the current quarter.</p>
<blockquote>This is the most significant shift we've seen in several cycles. Vendors who prepare now will be in a far stronger position when the guidance takes full effect.</blockquote>
<p>The regional tiers, which divide the country into four cost bands, are intended to better reflect labor and disposal costs that vary widely between rural and metropolitan markets. Analysts note the approach mirrors long-standing requests from vendor advocacy groups.</p>
<h2>Implementation timeline</h2>
<p>The final rule takes effect October 1, giving servicers and their vendor networks roughly 75 days to update systems, retrain field crews, and revise bid templates. REO Current will continue to track the development and publish compliance guidance as agencies release implementation details.</p>
`.trim();

export const articles: Article[] = [
  {
    slug: "hud-finalizes-property-preservation-allowable-fee-schedule",
    title:
      "HUD Finalizes Sweeping Overhaul of Property Preservation Allowable Fee Schedule",
    excerpt:
      "The long-awaited revision raises base allowables for the first time in nearly a decade, restructures over-allowable approvals, and introduces regional pricing tiers that could reshape vendor economics nationwide.",
    body: hudBody,
    category: categories["compliance-pricing"],
    tags: [
      tags["compliance-pricing"],
      tags.hud,
      tags.allowables,
      tags["default-servicing"],
    ],
    author: authors["sarah-mitchell"],
    date: "2026-07-17T06:00:00Z",
    displayDate: "July 17, 2026",
    relativeDate: "2 hours ago",
    readMinutes: 6,
    featuredImageCaption:
      "HUD headquarters in Washington, D.C. The final rule takes effect October 1. (REO Current)",
  },
  {
    slug: "national-order-mill-vendor-exodus-60-day-payment-terms",
    title: "National Order Mill Faces Vendor Exodus Over 60-Day Payment Terms",
    excerpt:
      "Regional crews say extended payment cycles are unsustainable amid rising fuel and dump-fee costs.",
    category: categories["contractors-vendors"],
    tags: [tags["default-servicing"]],
    author: authors["james-chen"],
    date: "2026-07-17T04:00:00Z",
    displayDate: "July 17, 2026",
    relativeDate: "4 hours ago",
    readMinutes: 4,
  },
  {
    slug: "occupancy-inspection-volumes-climb-delinquencies",
    title: "Occupancy Inspection Volumes Climb 18% as Delinquencies Tick Up",
    excerpt:
      "Q2 data shows the first sustained rise in inspection orders since 2023.",
    category: categories["field-inspections"],
    tags: [tags["default-servicing"]],
    author: authors["maria-rodriguez"],
    date: "2026-07-17T00:00:00Z",
    displayDate: "July 16, 2026",
    relativeDate: "7 hours ago",
    readMinutes: 3,
  },
  {
    slug: "gulf-coast-vendors-brace-hurricane-season-surge",
    title: "Gulf Coast Vendors Brace for Active Hurricane Season Surge",
    excerpt:
      "FEMA pre-positioning and servicer disaster protocols are already in motion.",
    category: categories["disaster-field-alerts"],
    tags: [tags["default-servicing"]],
    author: authors["david-thompson"],
    date: "2026-07-16T21:00:00Z",
    displayDate: "July 16, 2026",
    relativeDate: "10 hours ago",
    readMinutes: 4,
  },
  {
    slug: "fha-extends-deadline-conveyance-photo-standards",
    title: "FHA Extends Deadline for Updated Conveyance Photo Standards",
    excerpt:
      "Servicers gain an additional 45 days to bring documentation into compliance with the revised checklist.",
    category: categories["foreclosure-reo"],
    tags: [tags.conveyance, tags.hud],
    author: authors["maria-rodriguez"],
    date: "2026-07-17T02:00:00Z",
    displayDate: "July 17, 2026",
    relativeDate: "5 hours ago",
    readMinutes: 3,
  },
  {
    slug: "regional-field-companies-q2-order-volume-rebound",
    title: "Regional Field Companies Report Q2 Order Volume Rebound",
    excerpt:
      "Coverage networks in the Midwest and Southeast post the strongest quarter since 2023.",
    category: categories["field-service-companies"],
    tags: [tags["default-servicing"]],
    author: authors["james-chen"],
    date: "2026-07-17T01:00:00Z",
    displayDate: "July 17, 2026",
    relativeDate: "6 hours ago",
    readMinutes: 3,
  },

  // Property Preservation Services
  {
    slug: "winterization-deadlines-move-up-northern-zones",
    title: "Winterization Deadlines Move Up Two Weeks in Northern Zones",
    excerpt:
      "Servicers move deadlines up two weeks, citing early-freeze losses recorded last season.",
    category: categories["property-preservation"],
    tags: [tags["default-servicing"]],
    author: authors["lisa-wu"],
    date: "2026-07-16T12:00:00Z",
    displayDate: "July 16, 2026",
    readMinutes: 3,
  },
  {
    slug: "debris-removal-pricing-disputes-q2-chargebacks",
    title: "Debris Removal Pricing Disputes Spike in Q2 Chargebacks",
    excerpt:
      "Cubic-yard measurement disagreements drove a sharp rise in denied debris invoices last quarter.",
    category: categories["property-preservation"],
    tags: [tags.chargebacks, tags.allowables],
    author: authors["robert-kim"],
    date: "2026-07-15T12:00:00Z",
    displayDate: "July 15, 2026",
    readMinutes: 4,
  },
  {
    slug: "photo-documentation-ai-tools-order-mills",
    title: "Photo Documentation AI Tools Gain Traction With Order Mills",
    excerpt:
      "Automated photo-tagging and completeness checks are moving from pilot to production at several national vendors.",
    category: categories["property-preservation"],
    tags: [tags["default-servicing"]],
    author: authors["sarah-mitchell"],
    date: "2026-07-14T12:00:00Z",
    displayDate: "July 14, 2026",
    readMinutes: 5,
  },

  // Foreclosure & REO
  {
    slug: "judicial-backlogs-foreclosure-timeline-past-900-days",
    title:
      "Judicial State Backlogs Push Average Foreclosure Timeline Past 900 Days",
    excerpt:
      "Court backlogs in judicial foreclosure states have pushed average completion timelines to record lengths, extending preservation coverage periods.",
    category: categories["foreclosure-reo"],
    tags: [tags["default-servicing"]],
    author: authors["james-chen"],
    date: "2026-07-16T09:00:00Z",
    displayDate: "July 16, 2026",
    readMinutes: 4,
  },
  {
    slug: "reo-asset-managers-repair-and-market-strategy",
    title: "REO Asset Managers Shift to Repair-and-Market Strategy",
    excerpt:
      "Facing thin inventory, more asset managers are funding light rehabs before listing rather than selling as-is.",
    category: categories["foreclosure-reo"],
    tags: [tags["default-servicing"]],
    author: authors["maria-rodriguez"],
    date: "2026-07-15T09:00:00Z",
    displayDate: "July 15, 2026",
    readMinutes: 5,
  },
  {
    slug: "conveyance-condition-rejections-two-year-high",
    title: "Conveyance Condition Rejections Hit Two-Year High",
    excerpt:
      "Tighter HUD condition reviews are sending more conveyed properties back to servicers for rework.",
    category: categories["foreclosure-reo"],
    tags: [tags.conveyance, tags.hud],
    author: authors["david-thompson"],
    date: "2026-07-13T09:00:00Z",
    displayDate: "July 13, 2026",
    readMinutes: 4,
  },

  // Field Inspections
  {
    slug: "insurance-loss-inspection-demand-doubles-hail-corridor",
    title: "Insurance Loss Inspection Demand Doubles in Hail Corridor",
    excerpt:
      "A punishing spring storm season has doubled loss-inspection orders across the central hail corridor.",
    category: categories["field-inspections"],
    tags: [tags["default-servicing"]],
    author: authors["lisa-wu"],
    date: "2026-07-16T08:00:00Z",
    displayDate: "July 16, 2026",
    readMinutes: 3,
  },
  {
    slug: "gps-stamped-photos-become-universal-requirement",
    title: "GPS-Stamped Photos Become Universal Requirement",
    excerpt:
      "The last major holdouts among national servicers now mandate geotagged photo evidence on every visit.",
    category: categories["field-inspections"],
    tags: [tags["default-servicing"]],
    author: authors["robert-kim"],
    date: "2026-07-14T08:00:00Z",
    displayDate: "July 14, 2026",
    readMinutes: 4,
  },
  {
    slug: "inspector-pay-rates-2026-regional-survey",
    title: "Inspector Pay Rates: 2026 Regional Survey Results",
    excerpt:
      "Our annual survey maps per-visit inspector pay across every U.S. region and property type.",
    category: categories["field-inspections"],
    tags: [tags["default-servicing"]],
    author: authors["wire-staff"],
    date: "2026-07-12T08:00:00Z",
    displayDate: "July 12, 2026",
    readMinutes: 7,
  },

  // Mortgage
  {
    slug: "serious-delinquency-rate-edges-up-june",
    title: "Serious Delinquency Rate Edges Up to 1.4% in June",
    excerpt:
      "Early-stage delinquencies ticked higher for a second straight month, hinting at rising default volume ahead.",
    category: categories.mortgage,
    tags: [tags.gse, tags["default-servicing"]],
    author: authors["sarah-mitchell"],
    date: "2026-07-16T07:00:00Z",
    displayDate: "July 16, 2026",
    readMinutes: 3,
  },
  {
    slug: "servicers-expand-in-house-preservation-oversight",
    title: "Servicers Expand In-House Preservation Oversight Teams",
    excerpt:
      "More servicers are building internal QC teams to police vendor work rather than relying solely on order mills.",
    category: categories.mortgage,
    tags: [tags["default-servicing"]],
    author: authors["james-chen"],
    date: "2026-07-14T07:00:00Z",
    displayDate: "July 14, 2026",
    readMinutes: 5,
  },
  {
    slug: "fhfa-signals-review-gse-property-management-contracts",
    title: "FHFA Signals Review of GSE Property Management Contracts",
    excerpt:
      "The regulator opened a review of how Fannie Mae and Freddie Mac contract out REO property management.",
    category: categories.mortgage,
    tags: [tags.gse, tags.hud],
    author: authors["maria-rodriguez"],
    date: "2026-07-13T07:00:00Z",
    displayDate: "July 13, 2026",
    readMinutes: 4,
  },
];

// ---------------------------------------------------------------------------
// Homepage furniture
// ---------------------------------------------------------------------------

export const mostRead: MostReadItem[] = [
  {
    rank: 1,
    title: "Fannie Mae updates conveyance condition standards effective September 1",
    href: "/category/foreclosure-reo",
  },
  {
    rank: 2,
    title: "REO inventory rises for third consecutive month nationwide",
    href: "/category/foreclosure-reo",
  },
  {
    rank: 3,
    title: "New chargeback dispute portal launches for FHA properties",
    href: "/category/compliance-pricing",
  },
  {
    rank: 4,
    title: "GPS-stamped photos become universal requirement on all inspections",
    href: "/article/gps-stamped-photos-become-universal-requirement",
  },
  {
    rank: 5,
    title: "Serious delinquency rate edges up to 1.4% in June",
    href: "/article/serious-delinquency-rate-edges-up-june",
  },
];

export const testimonial: Testimonial = {
  quote:
    "The Morning Wire is the first thing I read. It's the only source that actually understands the field side of this business.",
  name: "Carlos Mendez",
  title: "Owner, Sunbelt Field Services",
};

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export const primaryNav: NavItem[] = [
  { label: "Property Preservation Services", href: "/category/property-preservation" },
  { label: "Field Inspections", href: "/category/field-inspections" },
  { label: "Field Service Companies", href: "/category/field-service-companies" },
  { label: "Contractors & Vendors", href: "/category/contractors-vendors" },
  { label: "Foreclosure & REO", href: "/category/foreclosure-reo" },
  { label: "Compliance & Pricing", href: "/category/compliance-pricing" },
  { label: "Disaster & Field Alerts", href: "/category/disaster-field-alerts" },
  { label: "Mortgage", href: "/category/mortgage" },
];

export const footerSections: NavItem[] = [
  { label: "Property Preservation", href: "/category/property-preservation" },
  { label: "Field Inspections", href: "/category/field-inspections" },
  { label: "Foreclosure & REO", href: "/category/foreclosure-reo" },
  { label: "Mortgage", href: "/category/mortgage" },
];

export const popularTags: Tag[] = [
  tags.hud,
  tags.allowables,
  tags["default-servicing"],
  tags.conveyance,
  tags.chargebacks,
  tags.gse,
];

// ---------------------------------------------------------------------------
// Homepage furniture
// ---------------------------------------------------------------------------
// The lead grid groups stories semantically (not by date), so the left rail and
// the two secondary cards under the lead are pinned explicitly — matching the
// design source exactly.

export const homepageSecondarySlugs: string[] = [
  "fha-extends-deadline-conveyance-photo-standards",
  "regional-field-companies-q2-order-volume-rebound",
];
