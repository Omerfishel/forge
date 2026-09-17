// Type declarations for the zero-dependency feed library (used by tests).
export interface FeedSourceDef { name: string; url: string; site: string; category: string; tier: 1 | 2 | 3 }
export interface RawItem { id: string; title: string; url: string; source: string; category: string; date: string; summary: string; score?: number; top?: boolean }
export interface Limits { windowDays: number; perDay: number; perSourcePerDay: number; topPerDay: number; minScore: number; topScore: number; total: number }
export const CATEGORIES: string[];
export const SOURCES: FeedSourceDef[];
export const DEFAULT_LIMITS: Limits;
export function decode(s: string): string;
export function stripTags(s: string): string;
export function parseFeed(xml: string, source: FeedSourceDef): RawItem[];
export function canonicalUrl(url: string): string;
export function idFor(url: string): string;
export function clip(s: string, n: number): string;
export function score(item: RawItem, source?: FeedSourceDef): number;
export function dayKey(iso: string): string;
export function dedupe(...lists: RawItem[][]): RawItem[];
export function select(items: RawItem[], sourcesByName: Record<string, FeedSourceDef>, now?: number, limits?: Partial<Limits>): RawItem[];
export function sourcesByName(list?: FeedSourceDef[]): Record<string, FeedSourceDef>;
