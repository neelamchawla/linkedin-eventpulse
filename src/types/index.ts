export type NavTab = 'attendee-generator' | 'organizer-dashboard' | 'content-analytics';

export type TonePersona = 'professional' | 'grateful' | 'takeaways' | 'storyteller';

export type PostDepth = 'short' | 'standard' | 'deep';

export interface MediaAttachment {
  id: string;
  name: string;
  size: string;
  category: string;
  url: string;
  altText: string;
}

export interface LivePost {
  id: string;
  author: string;
  role: string;
  initials: string;
  timeAgo: string;
  content: string;
  status: 'shared' | 'scheduled';
  scheduledTime?: string;
  tagsCount: number;
  tags: string[];
  likes: number;
  comments: number;
  reposts: number;
  imageUrl?: string;
  isCustom?: boolean;
}

export interface EngagementChampion {
  rank: number;
  name: string;
  role: string;
  postsCount: number;
  impressions: string;
}

export interface EventConfig {
  id: string;
  designation: string;
  hostOrg: string;
  timeframe: string;
  venue: string;
  hashtags: string[];
  linkedinOrg: string;
  officialHandle: string;
  resourceUrl: string;
  masterDirective: string;
  lastSyncedText: string;
}

export interface ScheduledQueueItem {
  id: string;
  content: string;
  date: string;
  time: string;
  tags: string[];
  status: 'queued' | 'published';
}

export interface LinkedInAccount {
  connected: boolean;
  name: string;
  headline?: string;
  profileUrl: string;
  vanityName: string;
  pictureUrl?: string;
  personUrn?: string;
  connectedAt?: string;
  hasOAuthToken?: boolean;
}
