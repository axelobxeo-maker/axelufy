/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VersionHistory {
  version: string;
  changelog: string;
  date: string;
}

export interface MirrorLink {
  name: string;
  url: string;
}

export interface Comment {
  name: string;
  text: string;
  timestamp: string;
}

export interface ModItem {
  id: string; // Dynamic ID
  name: string;
  tag: string; // Comma separated tags, e.g., "MLBB, GAME, SKIN"
  desc: string;
  url: string; // Base64 encoded or raw URL
  password?: string; // Base64 encoded or raw password
  image?: string;
  imageRatio?: string; // Tailwind aspect ratios, e.g., "aspect-video"
  views: number;
  likes: number;
  downloads: number; // Added
  comments?: Comment[];
  rating?: number; // Average rating 1-5
  ratingsCount?: number; // Total rating count
  verified?: boolean;
  premium?: boolean;
  exclusive?: boolean;
  changelog?: string;
  versionHistory?: VersionHistory[];
  mirrors?: MirrorLink[];
  isDraft?: boolean;
  publishDate?: string; // For scheduled publish (ISO string)
  brokenReportCount?: number;
  customButtons?: Array<{ label: string; url: string; iconType: string }>;
}

export interface CreditItem {
  platform: string;
  handle: string;
  url: string;
  color: string;
}

export interface PollingOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollingTopic {
  id: string;
  question: string;
  options: PollingOption[];
  totalVotes: number;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface PresetLink {
  label: string;
  url: string;
  iconType: "video" | "download" | "chat" | "key" | "globe";
}

export interface RequestMod {
  id: string;
  name: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  votes: number;
  date: string;
}

export interface VisitorStat {
  date: string;
  visitors: number;
  downloads: number;
  uploads: number;
}
