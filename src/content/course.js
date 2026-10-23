// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { chapters } from './chapters.js';
import { episodes } from './curriculum.js';
import { fieldnoteById } from './videos.js';

// Learn chapters in the order a learner meets them, which is chapters.js order.
export const learnOrder = Object.keys(chapters).filter(
  (key) => chapters[key].group === 'learn',
);

// The twelve lessons in the order they were numbered. A lesson keeps its
// number while the curriculum replaces it, so "lesson 05" in copy stays true.
const tour = [
  'running-stack',
  'bring-up',
  'spi-boundary',
  'fork-shape',
  'fork-day',
  'handshake',
  'not-true',
  'whose-image',
  'who-is-asking',
  'ready-not-loaded',
  'core-dags',
  'prove-from-desk',
];
export const lessonCount = tour.length;

const foundations = episodes.filter((episode) => episode.level === 100);

// A page whose Fieldnote is a level 100 episode shows its place among the
// foundations instead of a lesson number. Start is 101's page.
export function foundationPlace(key) {
  const episode = foundations.find(
    (entry) => entry.video && fieldnoteById(entry.video)?.chapter === key,
  );
  if (!episode) return null;
  return {
    code: episode.code,
    n: foundations.indexOf(episode) + 1,
    of: foundations.length,
  };
}

export function lessonNumber(key) {
  return foundationPlace(key) ? null : tour.indexOf(key) + 1 || null;
}

// The number a learner sees beside a page's title: its code or its lesson.
export function chapterNumber(key) {
  const place = foundationPlace(key);
  if (place) return place.code;
  const number = lessonNumber(key);
  return number ? String(number).padStart(2, '0') : '';
}

// "Level 100 · 2 of 5", or "2 of 12 · The stack" after the word Lesson.
export function placeLabel(key) {
  const place = foundationPlace(key);
  if (place) return `Level 100 · ${place.n} of ${place.of}`;
  return `${lessonNumber(key)} of ${lessonCount} · ${chapters[key].book}`;
}
