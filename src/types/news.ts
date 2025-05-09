// News list response
export interface NewsListResponse {
  storyList: (NewsStory | NewsAd)[];
  lastUpdatedTime: string;
  appIndex: {
    seoTitle: string;
    webURL: string;
  };
}

export interface NewsStory {
  story: {
    id: number;
    hline: string;
    intro: string;
    pubTime: string;
    source: string;
    storyType: string;
    imageId: number;
    seoHeadline: string;
    context: string;
    coverImage: {
      id: string;
      caption: string;
      source: string;
    };
    isFeatured?: boolean;
    entitlements: Record<string, any>;
    adsType: Record<string, any>;
    planId?: number;
  };
}

export interface NewsAd {
  ad: {
    name: string;
    layout: string;
    position: number;
  };
}

// News detail response
export interface NewsDetailResponse {
  id: number;
  context: string;
  headline: string;
  publishTime: string;
  coverImage: {
    id: string;
    caption: string;
    source: string;
  };
  content: NewsContent[];
  format?: NewsFormat[];
  authors: NewsAuthor[];
  tags: NewsTag[];
  appIndex: {
    seoTitle: string;
    webURL: string;
  };
  storyType: string;
  lastUpdatedTime: string;
  intro: string;
  source: string;
  entitlements: Record<string, any>;
}

export interface NewsContent {
  content?: {
    contentType: string;
    contentValue: string;
    hasFormat?: boolean;
  };
  ad?: {
    name: string;
    layout: string;
    position: number;
  };
}

export interface NewsFormat {
  type: string;
  value: {
    id: string;
    value: string;
  }[];
}

export interface NewsAuthor {
  id: number;
  name: string;
  imageId: number;
  twitterHandle?: string;
}

export interface NewsTag {
  itemName: string;
  itemType: string;
  itemId: string;
}

// News categories response
export interface NewsCategoriesResponse {
  storyType: NewsCategory[];
}

export interface NewsCategory {
  id: number;
  name: string;
  description: string;
} 