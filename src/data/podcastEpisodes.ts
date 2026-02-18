// Podcast episode links for Lenny's Podcast
// Lenny's Podcast Apple Podcasts ID: 1627920305

export interface PodcastEpisode {
  spotify?: string;  // Spotify episode URL
  apple?: string;    // Apple Podcasts episode URL
  title: string;
  guest: string;
}

// Map transcript filename (without .txt) to podcast links
export const podcastEpisodes: Record<string, PodcastEpisode> = {
  "Casey Winters": {
    spotify: "https://open.spotify.com/episode/44rZeWQQJNnAPqUtZevFW3",
    apple: "https://podcasts.apple.com/us/podcast/thinking-beyond-frameworks-casey-winters-pinterest/id1627920305?i=1000606593758",
    title: "Thinking beyond frameworks",
    guest: "Casey Winters"
  },
  "Gibson Biddle": {
    spotify: "https://open.spotify.com/episode/6WALK2cHpQaQG06SedMcNQ",
    apple: "https://podcasts.apple.com/us/podcast/gibson-biddle-on-his-dhm-product-strategy-framework/id1627920305?i=1000567128045",
    title: "DHM product strategy framework",
    guest: "Gibson Biddle"
  },
  "Jackie Bavaro": {
    spotify: "https://open.spotify.com/episode/4MPpRTptfBFYGA6xPeVfJt",
    apple: "https://podcasts.apple.com/us/podcast/jackie-bavaro-on-getting-better-at-product-strategy/id1627920305?i=1000566634294",
    title: "Getting better at product strategy",
    guest: "Jackie Bavaro"
  },
  "Shishir Mehrotra": {
    spotify: "https://open.spotify.com/episode/2EWVDzqhkxvLvEioAUE5kh",
    apple: "https://podcasts.apple.com/us/podcast/the-rituals-of-great-teams-shishir-mehrotra-of/id1627920305?i=1000576021672",
    title: "The rituals of great teams",
    guest: "Shishir Mehrotra"
  },
  "Brian Chesky": {
    spotify: "https://open.spotify.com/episode/7pa9sM2MSwmI2pQNDYYei9",
    apple: "https://podcasts.apple.com/gb/podcast/brian-cheskys-new-playbook/id1627920305?i=1000634526343",
    title: "Brian Chesky's new playbook",
    guest: "Brian Chesky"
  },
  "Rahul Vohra": {
    spotify: "https://open.spotify.com/episode/3fdchk9OHHXS7SjVe4jOXM",
    apple: "https://podcasts.apple.com/us/podcast/superhumans-secret-to-success-ignoring-most-customer/id1627920305?i=1000700465496",
    title: "Superhuman's secret to success",
    guest: "Rahul Vohra"
  },
  "Ryan Hoover": {
    spotify: "https://open.spotify.com/episode/3CEIMLVlP6dYwX6TrW3oU0",
    apple: "https://podcasts.apple.com/us/podcast/how-to-launch-and-grow-your-product-ryan-hoover/id1627920305?i=1000575269405",
    title: "How to launch and grow your product",
    guest: "Ryan Hoover"
  },
  "Ada Chen Rekhi": {
    spotify: "https://open.spotify.com/episode/28j08TefHDtnvFXr3UEHTW",
    apple: "https://podcasts.apple.com/us/podcast/how-to-make-better-decisions-and-build-a-joyful-career/id1627920305",
    title: "How to make better decisions and build a joyful career",
    guest: "Ada Chen Rekhi"
  },
};

// Helper function to get episode by filename
export function getEpisodeByFilename(filename: string): PodcastEpisode | null {
  // Remove .txt extension if present
  const cleanName = filename.replace(/\.txt$/, '');
  return podcastEpisodes[cleanName] || null;
}

// Generate a search URL for finding the episode
export function getSpotifySearchUrl(guestName: string): string {
  return `https://open.spotify.com/search/lenny%20${encodeURIComponent(guestName)}`;
}

export function getAppleSearchUrl(_guestName: string): string {
  return `https://podcasts.apple.com/us/podcast/lennys-podcast-product-growth-career/id1627920305`;
}

// Helper function to convert timestamp string to seconds
// Supports formats: "00:36", "00:00:36", "1:23:45"
export function timestampToSeconds(timestamp: string): number {
  const parts = timestamp.split(':').map(Number);
  if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

// Add timestamp to Spotify URL
export function getSpotifyUrlWithTimestamp(baseUrl: string, seconds: number): string {
  if (seconds <= 0) return baseUrl;
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}t=${seconds}`;
}

// Add timestamp to Apple Podcasts URL
export function getAppleUrlWithTimestamp(baseUrl: string, seconds: number): string {
  if (seconds <= 0) return baseUrl;
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}t=${seconds}`;
}
