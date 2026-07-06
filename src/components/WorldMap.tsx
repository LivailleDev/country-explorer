import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { select } from 'd3-selection';
import { zoom as d3zoom, zoomIdentity, type ZoomTransform } from 'd3-zoom';
import { feature } from 'topojson-client';
import type { FeatureCollection } from 'geojson';
import type { CountrySummary } from '../types';
import StateMessage from './StateMessage';

const WIDTH = 960;
const HEIGHT = 500;
const WORLD_URL = `${import.meta.env.BASE_URL}data/world-110m.json`;

interface Shape {
  key: string;
  d: string;
  country: CountrySummary | null;
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

  const shapes = useMemo<Shape[]>(() => {
    if (!world) return [];
    const projection = geoEqualEarth().fitSize([WIDTH, HEIGHT], world);
    const path = geoPath(projection);
    return world.features.map((f) => {
      const [[x0, y0], [x1, y1]] = path.bounds(f);
      return {
        key: String(f.id),
        d: path(f) ?? '',
        country: byId.get(Number(f.id)) ?? null,
        x0,
        y0,
        w: x1 - x0,
        h: y1 - y0,
      };
    });
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
          {/* One clip-path per country so its flag fills the exact territory. */}
          <defs>
            {shapes.map((s) =>
              s.country ? (
                <clipPath key={s.key} id={`clip-${s.key}`}>
                  <path d={s.d} />
                </clipPath>
              ) : null,
            )}
          </defs>

          <g transform={transform.toString()}>
            {/* Flags, each clipped to its country shape. */}
            {shapes.map((s) =>
              s.country ? (
                <image
                  key={s.key}
                  href={s.country.flag}
                  x={s.x0}
                  y={s.y0}
                  width={s.w}
                  height={s.h}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#clip-${s.key})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHovered(s.key)}
                  onMouseLeave={() => setHovered((h) => (h === s.key ? null : h))}
                  onClick={() => navigate(`/country/${s.country!.code}`)}
                >
                  <title>{s.country.name}</title>
                </image>
              ) : (
                <path key={s.key} d={s.d} fill="#d6d3d1" stroke="#ffffff" strokeWidth={0.4} />
              ),
            )}

            {/* Country outlines drawn on top; don't block clicks on the flags. */}
            {shapes.map((s) => (
              <path
                key={`b-${s.key}`}
                d={s.d}
                fill="none"
                stroke={hovered === s.key ? '#0c0a09' : '#ffffff'}
                strokeWidth={hovered === s.key ? 1.4 : 0.4}
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
