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

// Each ordered track of the curriculum: its name in a position line and the
// group it heads on Start and the Fieldnotes page.
const tracks = [
  {
    path: 'everyone',
    level: 100,
    name: 'Level 100',
    book: 'Level 100 · Foundations',
  },
  { path: 'service', level: 200, name: 'Service path', book: 'Service path' },
  {
    path: 'platform',
    level: 200,
    name: 'Platform path',
    book: 'Platform path',
  },
];

// A page whose Fieldnote is a level 100 or level 200 episode shows its place
// in that episode's track instead of a lesson number. Start is 101's page.
export function pathPlace(key) {
  const episode = episodes.find(
    (entry) => entry.video && fieldnoteById(entry.video)?.chapter === key,
  );
  const track = tracks.find(
    ({ path, level }) => path === episode?.path && level === episode?.level,
  );
  if (!track) return null;
  const inTrack = episodes.filter(
    ({ path, level }) => path === track.path && level === track.level,
  );
  return {
    code: episode.code,
    n: inTrack.indexOf(episode) + 1,
    of: inTrack.length,
    track: track.name,
    book: track.book,
  };
}

export function lessonNumber(key) {
  return pathPlace(key) ? null : tour.indexOf(key) + 1 || null;
}

// The number a learner sees beside a page's title: its code or its lesson.
export function chapterNumber(key) {
  const place = pathPlace(key);
  if (place) return place.code;
  const number = lessonNumber(key);
  return number ? String(number).padStart(2, '0') : '';
}

// "Service path · 2 of 7", or "2 of 12 · The stack" after the word Lesson.
export function placeLabel(key) {
  const place = pathPlace(key);
  if (place) return `${place.track} · ${place.n} of ${place.of}`;
  return `${lessonNumber(key)} of ${lessonCount} · ${chapters[key].book}`;
}
