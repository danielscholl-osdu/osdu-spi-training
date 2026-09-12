import { audio } from '../content/audio.js';
import { formatTime } from './pages.js';

// One <audio> element lives in the page frame so playback survives hash
// navigation. The dock and the Listen page both drive it.
export function createPlayer(element, dock) {
  element.src = audio.file;
  element.preload = 'metadata';

  const controls = () => [
    ...document.querySelectorAll('[data-player]'),
    ...dock.querySelectorAll('[data-player]'),
  ];
  const byRole = (role) => controls().filter((c) => c.dataset.player === role);

  function currentMarker(time) {
    return [...audio.markers].reverse().find((marker) => marker.time <= time);
  }

  function reflect() {
    const playing = !element.paused && !element.ended;
    dock.hidden =
      dock.dataset.dismissed === 'true' ||
      (element.paused && !element.currentTime);
    dock.classList.toggle('is-playing', playing);
    for (const label of byRole('label'))
      label.textContent = playing ? 'Pause' : 'Play';
    for (const button of byRole('toggle')) {
      button.setAttribute(
        'aria-label',
        playing ? 'Pause the deep dive' : 'Play the deep dive',
      );
      button.querySelector('.play-glyph').textContent = playing ? '❚❚' : '▶';
    }
    for (const current of byRole('current'))
      current.textContent = formatTime(element.currentTime);
    for (const seek of byRole('seek')) {
      if (document.activeElement !== seek)
        seek.value = String(Math.floor(element.currentTime));
    }
    const marker = currentMarker(element.currentTime);
    for (const now of byRole('now'))
      now.textContent = marker ? marker.title : audio.title;
    for (const link of byRole('now-link')) {
      link.href = marker ? marker.route : '#listen';
      link.textContent = marker
        ? `${marker.routeLabel} →`
        : 'Open the player →';
    }
    document.querySelectorAll('[data-marker-start]').forEach((item) => {
      const start = Number(item.dataset.markerStart);
      const end = Number(item.dataset.markerEnd);
      item.classList.toggle(
        'is-current',
        element.currentTime >= start && element.currentTime < end,
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

  function toggle() {
    if (element.paused) element.play().catch(() => {});
    else element.pause();
  }

  function seekTo(seconds, play = true) {
    dock.dataset.dismissed = 'false';
    element.currentTime = Math.max(0, Math.min(seconds, audio.duration));
    if (play) element.play().catch(() => {});
    reflect();
  }

  document.addEventListener('click', (event) => {
    const seek = event.target.closest('[data-seek]');
    if (seek) return seekTo(Number(seek.dataset.seek));
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
  for (const type of [
    'play',
    'pause',
    'timeupdate',
    'ended',
    'seeked',
    'loadedmetadata',
  ])
    element.addEventListener(type, reflect);

  return { reflect, seekTo, element };
}
