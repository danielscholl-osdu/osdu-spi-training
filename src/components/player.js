import { episodes, defaultEpisode, episodeById } from '../content/audio.js';
import { formatTime } from './pages.js';

// One <audio> element lives in the page frame so playback survives hash
// navigation. The dock, the Listen page, and the listen chips beside a map
// all drive it. Switching episodes swaps the element's source.
export function createPlayer(element, dock) {
  let episode = defaultEpisode;
  // A cue from a map sets stopAt; playback pauses at the end of that section.
  let stopAt = null;
  element.src = episode.file;
  element.preload = 'metadata';

  const controls = () => [
    ...document.querySelectorAll('[data-player]'),
    ...dock.querySelectorAll('[data-player]'),
  ];
  const byRole = (role) => controls().filter((c) => c.dataset.player === role);

  function currentMarker(time) {
    return [...episode.markers].reverse().find((marker) => marker.time <= time);
  }

  function reflect() {
    const playing = !element.paused && !element.ended;
    dock.hidden =
      dock.dataset.dismissed === 'true' ||
      (element.paused && !element.currentTime);
    dock.classList.toggle('is-playing', playing);
    dock.dataset.episode = episode.id;
    for (const label of byRole('label'))
      label.textContent = playing ? 'Pause' : 'Play';
    for (const button of byRole('toggle')) {
      button.setAttribute(
        'aria-label',
        playing ? `Pause ${episode.title}` : `Play ${episode.title}`,
      );
      button.querySelector('.play-glyph').textContent = playing ? '❚❚' : '▶';
    }
    for (const current of byRole('current'))
      current.textContent = formatTime(element.currentTime);
    for (const total of byRole('total'))
      total.textContent = formatTime(episode.duration);
    for (const seek of byRole('seek')) {
      seek.max = String(Math.floor(episode.duration));
      if (document.activeElement !== seek)
        seek.value = String(Math.floor(element.currentTime));
    }
    for (const title of byRole('episode')) title.textContent = episode.title;
    const marker = currentMarker(element.currentTime);
    const ended = stopAt === null && dock.dataset.stopped === 'true';
    for (const kicker of byRole('kicker'))
      kicker.textContent = ended
        ? 'Section ended · play to continue'
        : 'Listening';
    for (const now of byRole('now'))
      now.textContent = marker ? marker.title : episode.title;
    for (const link of byRole('now-link')) {
      link.href = marker ? marker.route : `#listen?episode=${episode.id}`;
      link.textContent = marker
        ? `${marker.routeLabel} →`
        : 'Open the player →';
    }
    for (const box of byRole('note-box')) box.hidden = !marker?.note;
    for (const note of byRole('note')) note.textContent = marker?.note || '';
    const listening = playing || ended;
    document.querySelectorAll('[data-listen-now]').forEach((line) => {
      const chips = [...line.parentElement.querySelectorAll('[data-seek]')];
      const inside = chips.some(
        (chip) =>
          chip.dataset.listenEpisode === episode.id &&
          element.currentTime >= Number(chip.dataset.seek) &&
          element.currentTime <
            Number(chip.dataset.listenEnd || chip.dataset.seek) + 1,
      );
      line.hidden = !(listening && inside && marker);
      if (line.hidden) return;
      line.innerHTML = `<b>${ended ? 'Section ended.' : 'Now:'} ${marker.title}.</b> <span class="listen-from">${episode.short} · ${formatTime(marker.time)}</span> ${
        marker.note
          ? `<span class="listen-check"><b>Source check.</b> ${marker.note}</span>`
          : 'No source check for this section.'
      }`;
    });
    document.querySelectorAll('[data-marker-start]').forEach((item) => {
      const start = Number(item.dataset.markerStart);
      const end = Number(item.dataset.markerEnd);
      item.classList.toggle(
        'is-current',
        item.dataset.episode === episode.id &&
          element.currentTime >= start &&
          element.currentTime < end,
      );
    });
    document.querySelectorAll('[data-listen-episode]').forEach((chip) => {
      const start = Number(chip.dataset.seek);
      const end = Number(chip.dataset.listenEnd || start + 1);
      chip.classList.toggle(
        'is-current',
        (playing || dock.dataset.stopped === 'true') &&
          chip.dataset.listenEpisode === episode.id &&
          element.currentTime >= start &&
          element.currentTime < end,
      );
    });
    const segments = document.querySelectorAll('#transcript p[data-start]');
    let active = null;
    for (const segment of segments) {
      if (Number(segment.dataset.start) <= element.currentTime)
        active = segment;
      else break;
    }
    segments.forEach((segment) =>
      segment.classList.toggle('is-current', segment === active),
    );
  }

  function select(id) {
    const next = episodeById(id);
    if (next === episode) return false;
    const wasPlaying = !element.paused && !element.ended;
    episode = next;
    stopAt = null;
    dock.dataset.stopped = 'false';
    element.src = episode.file;
    element.currentTime = 0;
    if (wasPlaying) element.play().catch(() => {});
    reflect();
    return true;
  }

  function toggle() {
    if (element.paused) {
      dock.dataset.stopped = 'false';
      element.play().catch(() => {});
    } else element.pause();
  }

  function seekTo(seconds, play = true, id = null, until = null) {
    dock.dataset.dismissed = 'false';
    dock.dataset.stopped = 'false';
    if (id) select(id);
    stopAt = until;
    element.currentTime = Math.max(0, Math.min(seconds, episode.duration));
    if (play) element.play().catch(() => {});
    reflect();
  }

  element.addEventListener('timeupdate', () => {
    // Stop just short of the boundary so the section's marker stays current.
    if (stopAt !== null && element.currentTime >= stopAt - 0.4) {
      stopAt = null;
      dock.dataset.stopped = 'true';
      element.pause();
    }
  });

  document.addEventListener('click', (event) => {
    const seek = event.target.closest('[data-seek]');
    if (seek)
      return seekTo(
        Number(seek.dataset.seek),
        true,
        seek.dataset.listenEpisode || seek.dataset.episode || null,
        seek.dataset.listenStop ? Number(seek.dataset.listenStop) : null,
      );
    const control = event.target.closest('[data-player]');
    if (!control) return;
    if (control.dataset.player === 'toggle') {
      dock.dataset.dismissed = 'false';
      toggle();
    }
    if (control.dataset.player === 'dismiss') {
      element.pause();
      dock.dataset.dismissed = 'true';
      reflect();
    }
  });
  document.addEventListener('input', (event) => {
    const control = event.target.closest('[data-player]');
    if (!control) return;
    if (control.dataset.player === 'seek')
      seekTo(Number(control.value), !element.paused);
    if (control.dataset.player === 'rate') {
      element.playbackRate = Number(control.value);
      for (const rate of byRole('rate')) rate.value = control.value;
    }
  });
  // A video on a page (the start page's one-minute overview) and the audio
  // dock never play at once: whichever starts pauses the other.
  document.addEventListener(
    'play',
    (event) => {
      if (event.target.tagName === 'VIDEO' && !element.paused) element.pause();
    },
    true,
  );
  element.addEventListener('play', () => {
    for (const video of document.querySelectorAll('video'))
      if (!video.paused) video.pause();
  });

  for (const type of [
    'play',
    'pause',
    'timeupdate',
    'ended',
    'seeked',
    'loadedmetadata',
  ])
    element.addEventListener(type, reflect);

  return {
    reflect,
    seekTo,
    select,
    element,
    get episode() {
      return episode;
    },
    episodes,
  };
}
