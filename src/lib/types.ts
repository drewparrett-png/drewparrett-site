export interface WorkFrontmatter {
  title: string;
  subtitle: string;
  role: string;
  timeframe: string;
  cover: string;
  featured: boolean;
  order: number;
}

export interface ProjectFrontmatter {
  title: string;
  description: string;
  cover: string;
  date: string;
  tags?: string[];
  featured: boolean;
  // Rich project page fields (optional — CallFrame works without these)
  parentWork?: string;
  parentWorkTitle?: string;
  externalUrl?: string;
  metrics?: Array<{ value: string; label: string }>;
  relatedProject?: string;
  relatedProjectTitle?: string;
}

export interface PhotographyFrontmatter {
  title: string;
  description: string;
  cover: string;
  date: string;
}

export interface AboutFrontmatter {
  title: string;
  photo?: string;
  resumeLink?: string;
}

export interface ContentItem<T> {
  slug: string;
  frontmatter: T;
  content: string;
}

export type FeaturedItem = {
  type: "work" | "project" | "photography";
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  cover: string;
  href: string;
};
