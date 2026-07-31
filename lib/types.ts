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
  commentCount?: number;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  date: string;
  text: string;
}

export interface Newsletter {
  slug: string;
  name: string;
  description: string;
  cadence: string;
}

export interface NavItem {
  label: string;
  href: string;
}

/** Item in the sidebar "Most Read" ranked list. */
export interface MostReadItem {
  rank: number;
  title: string;
  href: string;
}

/** Item in the homepage "Latest" wire (timestamped). */
export interface LatestItem {
  time: string;
  title: string;
  href: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

export interface Alert {
  label: string;
  text: string;
  href: string;
}
