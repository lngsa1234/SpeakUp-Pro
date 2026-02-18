import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import type { TranscriptSegment } from '../services/api';
import { getEpisodeByFilename, getSpotifySearchUrl, timestampToSeconds, getSpotifyUrlWithTimestamp, getAppleUrlWithTimestamp } from '../data/podcastEpisodes';

interface TranscriptReaderProps {
  filename: string;
  startLine?: number;
  endLine?: number;
  highlightWords?: string[];
}

const SPEAKER_COLORS: Record<string, string> = {
  'Lenny': '#4A90D9',
  'default1': '#E07B39',
  'default2': '#7B68EE',
  'default3': '#20B2AA',
  'default4': '#DB7093',
};

export const TranscriptReader: React.FC<TranscriptReaderProps> = ({
  filename,
  startLine,
  endLine,
  highlightWords = [],
}) => {
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [speakers, setSpeakers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);

  // Get podcast episode info
  const episode = useMemo(() => getEpisodeByFilename(filename), [filename]);

  // Calculate start time in seconds from first segment's timestamp
  const startTimeSeconds = useMemo(() => {
    if (segments.length > 0 && segments[0].timestamp) {
      return timestampToSeconds(segments[0].timestamp);
    }
    return 0;
  }, [segments]);

  useEffect(() => {
    loadTranscript();
  }, [filename, startLine, endLine]);

  const loadTranscript = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getTranscript(filename, startLine, endLine);
      setSegments(response.segments);
      setSpeakers(response.speakers);
    } catch (err) {
      setError('Failed to load transcript. Make sure the backend server is running.');
      console.error('Transcript load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSpeakerColor = (speaker: string): string => {
    if (SPEAKER_COLORS[speaker]) return SPEAKER_COLORS[speaker];
    const index = speakers.indexOf(speaker);
    const defaultColors = ['default1', 'default2', 'default3', 'default4'];
    return SPEAKER_COLORS[defaultColors[index % defaultColors.length]];
  };

  const highlightText = (text: string): React.ReactNode => {
    if (!searchTerm && highlightWords.length === 0) return text;

    const termsToHighlight = searchTerm
      ? [searchTerm, ...highlightWords]
      : highlightWords;

    const regex = new RegExp(`(${termsToHighlight.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isMatch = termsToHighlight.some(term =>
        part.toLowerCase() === term.toLowerCase()
      );
      if (isMatch) {
        return (
          <mark key={i} className="highlight-word">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  const filteredSegments = useMemo(() => {
    let result = segments;

    if (activeSpeaker) {
      result = result.filter(seg => seg.speaker === activeSpeaker);
    }

    if (searchTerm) {
      result = result.filter(seg =>
        seg.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [segments, activeSpeaker, searchTerm]);

  if (loading) {
    return (
      <div className="transcript-reader">
        <div className="transcript-loading">
          <div className="loading-spinner"></div>
          <span>Loading transcript...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transcript-reader">
        <div className="transcript-error">
          <span className="error-icon">!</span>
          <p>{error}</p>
          <button onClick={loadTranscript} className="btn-secondary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="transcript-reader">
      <div className="transcript-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>
          <span className="transcript-icon">📄</span>
          Transcript: {filename}
        </h3>
        <button className="expand-btn">{isExpanded ? '−' : '+'}</button>
      </div>

      {isExpanded && (
        <div className="transcript-content">
          {/* Podcast Links Section */}
          <div className="podcast-links-section">
            {episode && (episode.spotify || episode.apple) ? (
              <div className="podcast-links">
                <div className="podcast-info">
                  <span className="podcast-icon">🎧</span>
                  <div className="podcast-details">
                    <span className="podcast-title">{episode.title}</span>
                    {startTimeSeconds > 0 && (
                      <span className="podcast-timestamp">
                        Starts at {segments[0]?.timestamp}
                      </span>
                    )}
                  </div>
                </div>
                <div className="podcast-buttons">
                  {episode.spotify && (
                    <a
                      href={getSpotifyUrlWithTimestamp(episode.spotify, startTimeSeconds)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="podcast-link spotify"
                    >
                      <span className="link-icon">●</span> Spotify
                    </a>
                  )}
                  {episode.apple && (
                    <a
                      href={getAppleUrlWithTimestamp(episode.apple, startTimeSeconds)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="podcast-link apple"
                    >
                      <span className="link-icon">●</span> Apple Podcasts
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="podcast-links">
                <div className="podcast-info">
                  <span className="podcast-icon">🎧</span>
                  <span className="podcast-title">Listen to this episode</span>
                </div>
                <div className="podcast-buttons">
                  <a
                    href={getSpotifySearchUrl(filename)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="podcast-link spotify"
                  >
                    <span className="link-icon">●</span> Search Spotify
                  </a>
                  <a
                    href="https://podcasts.apple.com/us/podcast/lennys-podcast-product-growth-career/id1627920305"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="podcast-link apple"
                  >
                    <span className="link-icon">●</span> Apple Podcasts
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="transcript-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search transcript..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  x
                </button>
              )}
            </div>

            <div className="font-controls">
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="font-btn"
                title="Decrease font size"
              >
                A-
              </button>
              <span className="font-size">{fontSize}px</span>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className="font-btn"
                title="Increase font size"
              >
                A+
              </button>
            </div>
          </div>

          <div className="speaker-filters">
            <button
              className={`speaker-filter ${activeSpeaker === null ? 'active' : ''}`}
              onClick={() => setActiveSpeaker(null)}
            >
              All
            </button>
            {speakers.map(speaker => (
              <button
                key={speaker}
                className={`speaker-filter ${activeSpeaker === speaker ? 'active' : ''}`}
                onClick={() => setActiveSpeaker(activeSpeaker === speaker ? null : speaker)}
                style={{
                  borderColor: getSpeakerColor(speaker),
                  backgroundColor: activeSpeaker === speaker ? getSpeakerColor(speaker) : 'transparent',
                  color: activeSpeaker === speaker ? 'white' : getSpeakerColor(speaker),
                }}
              >
                {speaker}
              </button>
            ))}
          </div>

          {filteredSegments.length === 0 ? (
            <div className="no-results">
              No matching segments found.
            </div>
          ) : (
            <div className="transcript-segments" style={{ fontSize: `${fontSize}px` }}>
              {filteredSegments.map((segment, index) => (
                <div
                  key={index}
                  className="transcript-segment"
                  style={{ borderLeftColor: getSpeakerColor(segment.speaker) }}
                >
                  <div className="segment-header">
                    <span
                      className="speaker-name"
                      style={{ color: getSpeakerColor(segment.speaker) }}
                    >
                      {segment.speaker}
                    </span>
                    <span className="timestamp">{segment.timestamp}</span>
                  </div>
                  <p className="segment-text">
                    {highlightText(segment.text)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="transcript-footer">
            <span className="segment-count">
              {filteredSegments.length} of {segments.length} segments
            </span>
            {(startLine || endLine) && (
              <span className="line-range">
                Lines {startLine || 1} - {endLine || 'end'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
