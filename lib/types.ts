// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------
// The domain shapes the whole UI is typed against. lib/data.ts maps Payload CMS
// documents onto these, so pages/components never depend on the CMS directly.

export interface Category {
  slug: string;
  name: string;
  description?: string;
}

export interface Tag {
  slug: string;
  name: string;
  description?: string;
  articleCount?: number;
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  /** Initials used for the avatar fallback (e.g. "SM"). */
  initials: string;
  avatarUrl?: string;
  /** Named newsletter attached to this author's beat (e.g. "Compliance Watch"). */
  beat?: string;
  /** Topic beats shown as chips on the author page. */
  beats?: string[];
  social?: {
    email?: string;
    twitter?: string;
    linkedin?: string;
  };
  stats?: Stat[];
}

export interface Stat {
  label: string;
  value: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  /** Rich-text body — a Payload/Lexical editor state, rendered with <RichText>. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  category: Category;
  subcategory?: string;
  tags: Tag[];
  author: Author;
  /** ISO date string. */
  date: string;
  /** Human display date, e.g. "July 17, 2026". */
  displayDate: string;
  /** Relative label used on the homepage, e.g. "2 hours ago". */
  relativeDate?: string;
  readMinutes?: number;
  featuredImageUrl?: string;
  featuredImageCaption?: string;
  seo?: SEOFields;
}

export interface Newsletter {
  slug: string;
  name: string;
  description: string;
  cadence: string;
  /** Rich-text newsletter body — a Payload/Lexical editor state. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  seo?: SEOFields;
}

export interface SEOFields {
  metaDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChildItem[];
  recentPosts?: NavPost[];
}

export interface NavChildItem {
  label: string;
  href: string;
}

export interface NavPost {
  slug: string;
  title: string;
  displayDate: string;
  featuredImageUrl?: string;
}

/** Item in the sidebar "Most Read" ranked list. */
export interface MostReadItem {
  rank: number;
  title: string;
  href: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
}
