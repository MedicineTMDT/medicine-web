"use client";

import { useMemo } from "react";

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

interface ContentRendererProps {
  /** Raw HTML content from API */
  content: string;
  /** Additional CSS classes for the wrapper */
  className?: string;
  /** Callback that receives extracted headings for TOC */
  onHeadingsExtracted?: (headings: HeadingItem[]) => void;
}

/**
 * Extract headings from HTML content for table of contents
 */
export function extractHeadings(html: string): HeadingItem[] {
  if (typeof window === "undefined") return [];
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const headings: HeadingItem[] = [];
  
  const headingElements = doc.querySelectorAll("h2, h3");
  headingElements.forEach((el, index) => {
    const text = el.textContent?.trim() || "";
    if (text) {
      headings.push({
        id: `heading-${index}`,
        text,
        level: el.tagName === "H2" ? 2 : 3,
      });
    }
  });
  
  return headings;
}

/**
 * ContentRenderer - Sanitizes and beautifies HTML content from API
 * 
 * Features:
 * - Strips inline styles that conflict with theme
 * - Removes outdated layout properties (float, clear)
 * - Preserves semantic content (text, links, images)
 * - Applies consistent prose styling
 * - Extracts headings for TOC and adds IDs for anchor linking
 */
export function ContentRenderer({ content, className = "", onHeadingsExtracted }: ContentRendererProps) {
  const { sanitizedContent, headings } = useMemo(() => {
    if (!content) return { sanitizedContent: "", headings: [] };
    
    let html = content;
    
    // Remove inline styles completely for consistent theming
    html = html.replace(/\s*style\s*=\s*["'][^"']*["']/gi, "");
    
    // Remove unwanted classes that do nothing without original CSS
    const classesToRemove = [
      "cs-row10",
      "cs_wcontent", 
      "cs-sscomment",
      "cs-warningct",
      "cs_ppwcontent",
    ];
    classesToRemove.forEach((cls) => {
      html = html.replace(new RegExp(`\\bclass\\s*=\\s*["'][^"']*${cls}[^"']*["']`, "gi"), "");
    });
    
    // Remove data attributes that are not needed
    html = html.replace(/\s*data-[a-z-]+\s*=\s*["'][^"']*["']/gi, "");
    
    // Remove onclick handlers for security
    html = html.replace(/\s*onclick\s*=\s*["'][^"']*["']/gi, "");
    
    // Remove empty class attributes
    html = html.replace(/\s*class\s*=\s*["']\s*["']/gi, "");
    
    // Remove itemprop attributes (microdata not needed for display)
    html = html.replace(/\s*itemprop\s*=\s*["'][^"']*["']/gi, "");
    
    // Replace brand name with Analytics Pill
    html = html.replace(/Trung Tâm Thuốc Central Pharmacy/gi, "Analytics Pill");
    html = html.replace(/trung tâm thuốc/gi, "Analytics Pill");
    html = html.replace(/trungtamthuoc\.com/gi, "analyticspill.com");
    
    // Remove images that don't have https URLs
    html = html.replace(/<img[^>]*src\s*=\s*["'](?!https:\/\/)[^"']*["'][^>]*>/gi, "");
    
    // Extract headings and add IDs
    const extractedHeadings: HeadingItem[] = [];
    let headingIndex = 0;
    
    html = html.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, text) => {
      const cleanText = text.replace(/<[^>]*>/g, "").trim();
      if (cleanText) {
        const id = `heading-${headingIndex}`;
        extractedHeadings.push({
          id,
          text: cleanText,
          level: tag.toLowerCase() === "h2" ? 2 : 3,
        });
        headingIndex++;
        return `<${tag}${attrs} id="${id}">${text}</${tag}>`;
      }
      return match;
    });
    
    // Wrap images in figure tags if not already (only remaining https images)
    html = html.replace(
      /<img([^>]*)>/gi,
      '<figure class="content-image"><img$1 loading="lazy" /></figure>'
    );
    
    // Add proper link styling hint
    html = html.replace(/<a\s/gi, '<a rel="noopener noreferrer" ');
    
    return { sanitizedContent: html, headings: extractedHeadings };
  }, [content]);

  // Notify parent of extracted headings
  useMemo(() => {
    if (onHeadingsExtracted && headings.length > 0) {
      onHeadingsExtracted(headings);
    }
  }, [headings, onHeadingsExtracted]);

  if (!sanitizedContent) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Chưa có nội dung.</p>
      </div>
    );
  }

  return (
    <div
      className={`content-renderer ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
