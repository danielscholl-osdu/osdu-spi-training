// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Pictograms shared with the Fieldnotes videos, which draw them from this file.
// Each borrows a product icon's silhouette (Azure architecture icons,
// Kubernetes, Docker) but stays in the site palette: ink line, tint, white, and
// blue on one small part. Drawn on a 0..120 box. Shapes filled with the tint
// carry class i-t, so a stylesheet can retint them (the partition's teal).
const INK = '#102b43';
const WHITE = '#fff';
const BLUE = '#0b6a9c';
export const iconTint = '#e8f2f9';

const attrs = (values) =>
  Object.entries(values)
    .filter(([, value]) => value != null)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

function pen(tint, stroke) {
  const line = {
    stroke: INK,
    'stroke-width': stroke,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  };
  const fillOf = (fill) => ({
    fill,
    class: fill === tint ? 'i-t' : null,
  });
  const shape = (tag, geometry, fill, extra = {}) =>
    `<${tag} ${attrs({ ...geometry, ...line, ...fillOf(fill), ...extra })}/>`;
  return {
    path: (d, fill = 'none', extra) => shape('path', { d }, fill, extra),
    rect: (x, y, width, height, rx, fill = tint, extra) =>
      shape('rect', { x, y, width, height, rx }, fill, extra),
    circle: (cx, cy, r, fill = tint, extra) =>
      shape('circle', { cx, cy, r }, fill, extra),
    polygon: (points, fill = tint, extra) =>
      shape('polygon', { points }, fill, extra),
    mark: (d, fill) => `<path ${attrs({ d, fill, stroke: 'none' })}/>`,
  };
}

const star = (cx, cy, r) =>
  `M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r}Z`;

const around = (n, cx, cy, r, start = -Math.PI / 2) =>
  Array.from({ length: n }, (_, k) => {
    const a = start + (k * 2 * Math.PI) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)].map(
      (v) => Math.round(v * 10) / 10,
    );
  });

function key(p, x, y, k) {
  const s = (v) => Math.round(v * k * 10) / 10;
  return [
    p.circle(x, y, s(13), WHITE),
    p.path(
      `M${x - s(5)} ${y + s(12)} V${y + s(50)} L${x} ${y + s(56)} L${x + s(5)} ${y + s(50)} V${y + s(44)} H${x + s(12)} V${y + s(37)} H${x + s(5)} V${y + s(31)} H${x + s(12)} V${y + s(24)} H${x + s(5)} V${y + s(12)}Z`,
      WHITE,
    ),
    p.circle(x, y - s(3), s(3.5)),
  ].join('');
}

const drawings = {
  // Azure Cosmos DB: a ringed planet with two sparkles.
  cosmos: (p) =>
    [
      p.path('M6 60 A54 16 0 0 1 114 60', 'none', {
        transform: 'rotate(-20 60 60)',
      }),
      p.circle(60, 60, 32),
      p.path(
        'M38 72 a9 9 0 0 1 9 -10 a12 12 0 0 1 22 2 a8 8 0 0 1 2 15 H45 a7 7 0 0 1 -7 -7Z',
        WHITE,
      ),
      p.path('M6 60 A54 16 0 0 0 114 60', 'none', {
        transform: 'rotate(-20 60 60)',
      }),
      p.mark(star(12, 32, 14), BLUE),
      p.mark(star(104, 102, 11), BLUE),
    ].join(''),
  // Azure Storage: a box with a header bar over stacked rows.
  storage: (p) =>
    [
      p.rect(18, 24, 84, 76, 10),
      p.path(
        'M18 46 V34 A10 10 0 0 1 28 24 H92 A10 10 0 0 1 102 34 V46Z',
        BLUE,
      ),
      ...[54, 70, 86].map((y) =>
        p.rect(30, y, 60, 9, 3, WHITE, { 'stroke-width': 2.4 }),
      ),
    ].join(''),
  // A table in Azure Storage: the storage header bar over a grid.
  table: (p) =>
    [
      p.rect(14, 22, 92, 76, 8, WHITE),
      p.path('M14 42 V30 A8 8 0 0 1 22 22 H98 A8 8 0 0 1 106 30 V42Z', BLUE),
      p.path('M14 61 H106 M14 80 H106 M46 42 V98', 'none', {
        'stroke-width': 2.6,
      }),
    ].join(''),
  // Azure Service Bus: an envelope inside corner brackets.
  servicebus: (p, t) =>
    [
      p.path(
        'M12 36 V18 H32 M88 18 H108 V36 M108 84 V102 H88 M32 102 H12 V84',
        'none',
        { stroke: BLUE, 'stroke-width': 5 },
      ),
      p.path('M30 52 L60 32 L90 52 V88 H30Z', t),
      p.path('M30 52 L60 72 L90 52'),
      p.path('M30 88 L60 66 L90 88Z', WHITE),
    ].join(''),
  // Azure Key Vault: a key standing in a ring.
  keyvault: (p) =>
    [p.circle(60, 60, 48), p.circle(60, 60, 38, WHITE), key(p, 60, 40, 1)].join(
      '',
    ),
  // Managed identity: the Entra pyramid with a small key.
  identity: (p, t) =>
    [
      p.path('M60 14 L18 70 L60 98Z', t),
      p.path('M60 14 L102 70 L60 98Z', WHITE),
      key(p, 94, 80, 0.55),
    ].join(''),
  // Container image: Docker's stacked containers riding a whale's back.
  image: (p, t) =>
    [
      p.path(
        'M10 66 H94 C102 66 106 58 112 50 C116 60 114 68 106 70 C100 94 72 106 46 104 C24 102 12 88 10 66Z',
        t,
      ),
      p.circle(30, 82, 3, INK, { stroke: 'none' }),
      ...[
        [22, 48],
        [41, 48],
        [60, 48],
        [41, 30],
        [60, 30],
        [60, 12],
      ].map(([x, y]) =>
        p.rect(x, y, 17, 16, 2, WHITE, { 'stroke-width': 2.4 }),
      ),
    ].join(''),
  // Azure Container Registry: a cloud behind a stack of containers.
  registry: (p, t) =>
    [
      p.path(
        'M24 82 A20 20 0 0 1 28 44 A28 28 0 0 1 82 38 A22 22 0 0 1 96 82Z',
        t,
      ),
      ...[56, 80].map(
        (y) =>
          p.rect(56, y, 50, 22, 3, WHITE) +
          p.path(
            `M68 ${y + 4} V${y + 18} M80 ${y + 4} V${y + 18} M92 ${y + 4} V${y + 18}`,
            'none',
            { 'stroke-width': 2.4 },
          ),
      ),
    ].join(''),
  // Kubernetes: a heptagon badge carrying the helm.
  k8s: (p) => {
    const helm = { stroke: WHITE, 'stroke-width': 5 };
    const spokes = around(7, 60, 62, 6)
      .map(([x, y], k) => `M${x} ${y} L${around(7, 60, 62, 34)[k].join(' ')}`)
      .join(' ');
    return [
      p.polygon(
        around(7, 60, 62, 52)
          .map((point) => point.join(','))
          .join(' '),
        BLUE,
      ),
      p.circle(60, 62, 22, 'none', helm),
      p.circle(60, 62, 6, WHITE, helm),
      p.path(spokes, 'none', helm),
    ].join('');
  },
  // AKS: seven cubes in a honeycomb.
  aks: (p) => {
    const r = 20;
    const w = r * Math.sqrt(3);
    const corner = (cx, cy, k) => {
      const a = Math.PI / 6 + (k * Math.PI) / 3;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)].map(
        (v) => Math.round(v * 10) / 10,
      );
    };
    return [
      [0, 0],
      [w, 0],
      [-w, 0],
      [w / 2, r * 1.5],
      [-w / 2, r * 1.5],
      [w / 2, -r * 1.5],
      [-w / 2, -r * 1.5],
    ]
      .map(([dx, dy]) => {
        const cx = Math.round((60 + dx) * 10) / 10;
        const cy = Math.round((60 + dy) * 10) / 10;
        const v = Array.from({ length: 6 }, (_, k) => corner(cx, cy, k));
        const face = (points, fill) =>
          p.polygon(points.map((point) => point.join(',')).join(' '), fill);
        return [
          face([v[4], v[5], [cx, cy], v[3]], WHITE),
          face([v[3], [cx, cy], v[1], v[2]]),
          face([[cx, cy], v[5], v[0], v[1]]),
        ].join('');
      })
      .join('');
  },
  // Entitlements in Gremlin and common Storage: a graph over a store.
  gremlin: (p, t) =>
    [
      p.path('M26 92 V104 A34 10 0 0 0 94 104 V92', t),
      p.path('M26 92 A34 10 0 0 1 94 92 A34 10 0 0 1 26 92Z', t),
      p.path('M34 30 L60 52 L88 26 M60 52 L60 76'),
      p.circle(34, 30, 9, BLUE),
      p.circle(88, 26, 9, BLUE),
      p.circle(60, 52, 10, BLUE),
    ].join(''),
  // Istio gateway: a door.
  gate: (p, t) =>
    [
      p.path('M20 106 V36 A40 40 0 0 1 100 36 V106', t),
      p.path('M44 106 V56 A16 16 0 0 1 76 56 V106', WHITE),
    ].join(''),
  // An API client: a screen with lines of text.
  client: (p) =>
    [
      p.rect(16, 22, 88, 58, 6, WHITE),
      p.path('M6 92 H114'),
      p.path('M30 40 H70 M30 54 H86 M30 66 H60', 'none', { stroke: BLUE }),
    ].join(''),
};

export const iconKinds = Object.keys(drawings);

// The icon's shapes, for a caller that places them in its own SVG.
export function iconShapes(kind, { tint = iconTint, stroke = 3.2 } = {}) {
  const draw = drawings[kind];
  return draw ? draw(pen(tint, stroke), tint) : '';
}

export function iconSvg(kind, { className = 'icon', stroke = 5 } = {}) {
  const shapes = iconShapes(kind, { stroke });
  return shapes
    ? `<svg class="${className}" viewBox="0 0 120 120" aria-hidden="true" focusable="false">${shapes}</svg>`
    : '';
}

// Map nodes that name a product carry its icon. Keyed by component id.
export const nodeIcons = {
  client: 'client',
  gateway: 'gate',
  service: 'image',
  image: 'image',
  cosmos: 'cosmos',
  'partition-storage': 'storage',
  events: 'servicebus',
  'shared-data': 'gremlin',
  identity: 'identity',
  vault: 'keyvault',
  registry: 'registry',
  'image-source': 'registry',
  azureclients: 'table',
};
