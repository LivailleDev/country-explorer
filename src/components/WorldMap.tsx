import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { select } from 'd3-selection';
import { zoom as d3zoom, zoomIdentity, type ZoomTransform } from 'd3-zoom';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, Polygon } from 'geojson';
import type { CountrySummary } from '../types';
import StateMessage from './StateMessage';

const WIDTH = 960;
const HEIGHT = 500;
const WORLD_URL = `${import.meta.env.BASE_URL}data/world-110m.json`;

/**
 * Some flagcdn SVGs (e.g. Chile's) draw their star via internal `<use xlink:href="#id">`
 * fragment references. Nested inside this SVG's own `<image>` elements, those internal
 * refs fail to resolve in some browser engines and the flag silently doesn't paint at
 * all (confirmed by swapping in a PNG, which renders fine). Raster PNGs have no such
 * internal references, so the map uses the PNG variant of each flag; the SVG (crisper,
 * no nested-nesting) is still used for the plain <img> on the country detail page.
 */
function mapFlagUrl(svgUrl: string): string {
  const file = svgUrl.split('/').pop() ?? '';
  return `https://flagcdn.com/w640/${file.replace(/\.svg$/, '.png')}`;
}

/** One country outline, used for the border stroke and the "no flag data" fallback fill. */
interface Border {
  key: string;
  d: string;
  country: CountrySummary | null;
}

/**
 * One polygon *ring* of a country (a MultiPolygon country — e.g. an archipelago —
 * has several). Each piece gets its own flag image sized to its own bounding box,
 * so a far-flung island never stretches the box used for the mainland and leaves
 * it under-covered.
 */
interface FlagPiece {
  key: string;
  countryKey: string;
  d: string;
  country: CountrySummary;
  x0: number;
  y0: number;
  w: number;
  h: number;
}

export default function WorldMap({ countries }: { countries: CountrySummary[] }) {
  const navigate = useNavigate();
  const svgRef = useRef<SVGSVGElement>(null);
  const [world, setWorld] = useState<FeatureCollection | null>(null);
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity);
  const [hovered, setHovered] = useState<string | null>(null);

  // Country borders are bundled as a static topojson asset (no external calls).
  useEffect(() => {
    let active = true;
    fetch(WORLD_URL)
      .then((r) => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((topo: any) => {
        if (active) setWorld(feature(topo, topo.objects.countries) as unknown as FeatureCollection);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const byId = useMemo(() => {
    const map = new Map<number, CountrySummary>();
    for (const c of countries) if (c.ccn3) map.set(Number(c.ccn3), c);
    return map;
  }, [countries]);

  const { borders, flagPieces } = useMemo(() => {
    if (!world) return { borders: [] as Border[], flagPieces: [] as FlagPiece[] };
    const projection = geoEqualEarth().fitSize([WIDTH, HEIGHT], world);
    const path = geoPath(projection);
    const borderList: Border[] = [];
    const pieceList: FlagPiece[] = [];

    world.features.forEach((f, index) => {
      // A few disputed territories carry no numeric id in this dataset; fall
      // back to the array index so their React keys never collide.
      const key = f.id != null ? String(f.id) : `no-id-${index}`;
      const country = f.id != null ? (byId.get(Number(f.id)) ?? null) : null;
      borderList.push({ key, d: path(f) ?? '', country });
      if (!country) return;

      // Split MultiPolygons into individual rings so a far-flung island (or an
      // antimeridian-crossing landmass) never inflates the bounding box used to
      // size the flag over the main territory, leaving it under-covered.
      const polygons: Polygon['coordinates'][] =
        f.geometry.type === 'MultiPolygon'
          ? f.geometry.coordinates
          : f.geometry.type === 'Polygon'
            ? [f.geometry.coordinates]
            : [];

      polygons.forEach((coordinates, i) => {
        const ring: Feature<Polygon> = {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Polygon', coordinates },
        };
        const d = path(ring);
        if (!d) return;
        const [[x0, y0], [x1, y1]] = path.bounds(ring);
        const w = x1 - x0;
        const h = y1 - y0;
        if (w <= 0 || h <= 0) return;
        pieceList.push({ key: `${key}-${i}`, countryKey: key, d, country, x0, y0, w, h });
      });
    });
    return { borders: borderList, flagPieces: pieceList };
  }, [world, byId]);

  // Attach d3-zoom for pan + wheel/pinch zoom.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !world) return;
    const sel = select(svg);
    const behavior = d3zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 12])
      .translateExtent([
        [0, 0],
        [WIDTH, HEIGHT],
      ])
      .on('zoom', (event) => setTransform(event.transform));
    sel.call(behavior);
    return () => {
      sel.on('.zoom', null);
    };
  }, [world]);

  if (!world) return <StateMessage title="Loading map…" />;

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800">
      <div className="aspect-[960/500] w-full">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-full w-full cursor-grab bg-[#aecbe8] active:cursor-grabbing dark:bg-[#14304a]"
          role="img"
          aria-label="Interactive world map, each country filled with its flag"
        >
          {/* One clip-path per polygon piece, so every island/mainland ring gets
              its flag sized to its OWN bounds — no shared bbox to stretch. */}
          <defs>
            {flagPieces.map((p) => (
              <clipPath key={p.key} id={`clip-${p.key}`}>
                <path d={p.d} clipRule="evenodd" />
              </clipPath>
            ))}
          </defs>

          <g transform={transform.toString()}>
            {/* Solid fallback fill for countries we have no flag data for. */}
            {borders.map((b) =>
              b.country ? null : (
                <path key={b.key} d={b.d} fill="#d6d3d1" stroke="#ffffff" strokeWidth={0.4} />
              ),
            )}

            {/* Flags: one image per polygon piece, each clipped to its own shape. */}
            {flagPieces.map((p) => (
              <image
                key={p.key}
                href={mapFlagUrl(p.country.flag)}
                x={p.x0}
                y={p.y0}
                width={p.w}
                height={p.h}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#clip-${p.key})`}
                className="cursor-pointer"
                onMouseEnter={() => setHovered(p.countryKey)}
                onMouseLeave={() => setHovered((h) => (h === p.countryKey ? null : h))}
                onClick={() => navigate(`/country/${p.country.code}`)}
              >
                <title>{p.country.name}</title>
              </image>
            ))}

            {/* Country outlines drawn on top; don't block clicks on the flags. */}
            {borders.map((b) => (
              <path
                key={`b-${b.key}`}
                d={b.d}
                fill="none"
                stroke={hovered === b.key ? '#0c0a09' : '#ffffff'}
                strokeWidth={hovered === b.key ? 1.4 : 0.4}
                vectorEffect="non-scaling-stroke"
                pointerEvents="none"
              />
            ))}
          </g>
        </svg>
      </div>
      <p className="eyebrow absolute bottom-3 right-4 rounded bg-white/70 px-2 py-1 dark:bg-stone-900/70">
        Drag to pan · scroll to zoom · click a country
      </p>
    </div>
  );
}
