import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './OfficesMap.css';

/* ── Pin locations ───────────────────────────────────────────── */
const PINS = [
    { id: 'us', label: 'United States', lat: 39.5, lng: -98.35, region: 'Americas' },
    { id: 'brazil', label: 'Brazil', lat: -14.24, lng: -51.93, region: 'Americas' },
    { id: 'finland', label: 'Finland', lat: 61.92, lng: 25.74, region: 'Europe' },
    { id: 'uk', label: 'United Kingdom', lat: 55.38, lng: -3.44, region: 'Europe' },
    { id: 'germany', label: 'Germany', lat: 51.17, lng: 10.45, region: 'Europe' },
    { id: 'middleeast', label: 'Middle East', lat: 24.47, lng: 53.85, region: 'Asia' },
    { id: 'africa', label: 'Africa', lat: 8.78, lng: 20.52, region: 'Africa' },
    { id: 'safrica', label: 'South Africa', lat: -30.56, lng: 22.94, region: 'Africa' },
    { id: 'madagascar', label: 'Madagascar', lat: -18.77, lng: 46.87, region: 'Africa' },
    { id: 'australia', label: 'Australia', lat: -25.27, lng: 133.78, region: 'Oceania' },
    { id: 'japan', label: 'Japan', lat: 36.20, lng: 138.25, region: 'Asia' },
    { id: 'china', label: 'China', lat: 35.86, lng: 104.20, region: 'Asia' },
    { id: 'bangladesh', label: 'Bangladesh', lat: 23.68, lng: 90.36, region: 'Asia' },
    { id: 'india', label: 'India', lat: 20.59, lng: 78.96, region: 'Asia' },
    { id: 'philippines', label: 'Philippines', lat: 12.88, lng: 121.77, region: 'Asia' },
    { id: 'hongkong', label: 'Hong Kong', lat: 22.32, lng: 114.17, region: 'Asia' },
    { id: 'vietnam', label: 'Vietnam', lat: 14.06, lng: 108.28, region: 'Asia' },
    { id: 'thailand', label: 'Thailand', lat: 15.87, lng: 100.99, region: 'Asia' },
    { id: 'malaysia', label: 'Malaysia', lat: 4.21, lng: 108.96, region: 'Asia' },
    { id: 'indonesia', label: 'Indonesia', lat: -0.79, lng: 113.92, region: 'Asia' },
];

const MAP_REGIONS = [
    { key: 'all', label: 'All', zoom: 2, center: [20, 20] },
    { key: 'Asia', label: 'Asia', zoom: 3, center: [24, 101] },
    { key: 'Africa', label: 'Africa', zoom: 3, center: [7, 21] },
    { key: 'Europe', label: 'Europe', zoom: 4, center: [54, 13] },
    { key: 'Americas', label: 'Americas', zoom: 3, center: [19, -81] },
    { key: 'Oceania', label: 'Oceania', zoom: 4, center: [-25, 134] },
];

/* ── Custom saffron drop-pin icon — stable module-level singletons ─── */
// Created once so Leaflet never receives a new object reference on re-render,
// which would cause it to destroy/recreate all marker DOM nodes (the "flash").
const PIN_ICON_DEFAULT = L.divIcon({
    className: '',
    html: `<div class="of-map-pin">
             <div class="of-map-pin__head"></div>
             <div class="of-map-pin__tail"></div>
           </div>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    tooltipAnchor: [0, -38],
});

const PIN_ICON_ACTIVE = L.divIcon({
    className: '',
    html: `<div class="of-map-pin of-map-pin--active">
             <div class="of-map-pin__head"></div>
             <div class="of-map-pin__tail"></div>
           </div>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    tooltipAnchor: [0, -38],
});

/* ── Fit-world helper ─────────────────────────────────────── */
function FitWorld() {
    const map = useMap();
    useEffect(() => {
        map.fitWorld({ padding: [20, 20] });
    }, [map]);
    return null;
}

function ViewportController({ region, selectedPin }) {
    const map = useMap();

    useEffect(() => {
        if (selectedPin) {
            map.flyTo([selectedPin.lat, selectedPin.lng], 5, { duration: 0.8 });
            return;
        }

        const next = MAP_REGIONS.find((item) => item.key === region) || MAP_REGIONS[0];
        map.flyTo(next.center, next.zoom, { duration: 0.7 });
    }, [map, region, selectedPin]);

    return null;
}

/* ── Main component ───────────────────────────────────────── */
export default function OfficesMap() {
    const [activeId, setActiveId] = useState(null);
    const [region, setRegion] = useState('all');
    const [selectedId, setSelectedId] = useState('');

    const visiblePins = useMemo(() => {
        if (region === 'all') {
            return PINS;
        }
        return PINS.filter((pin) => pin.region === region);
    }, [region]);

    const selectedPin = useMemo(
        () => visiblePins.find((pin) => pin.id === selectedId) || null,
        [selectedId, visiblePins],
    );

    return (
        <div className="of-map__wrapper" role="region" aria-label="Global offices map">
            <aside className="of-map__filters" aria-label="Map filters">
                <p className="of-map__filters-title">Filter locations</p>
                <div className="of-map__filters-chips">
                    {MAP_REGIONS.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            className={`of-map__filters-chip${region === item.key ? ' is-active' : ''}`}
                            onClick={() => {
                                setRegion(item.key);
                                setSelectedId('');
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
                <label className="of-map__filters-label" htmlFor="of-country-filter">Country</label>
                <select
                    id="of-country-filter"
                    className="of-map__filters-select"
                    value={selectedId}
                    onChange={(event) => setSelectedId(event.target.value)}
                >
                    <option value="">Select a country</option>
                    {visiblePins.map((pin) => (
                        <option key={pin.id} value={pin.id}>{pin.label}</option>
                    ))}
                </select>
            </aside>

            <div className="of-map__country-count" aria-live="polite">
                <span className="of-map__country-count-dot" aria-hidden="true" />
                {visiblePins.length} Countries
            </div>

            <div className="of-map__highlight" aria-hidden="true" />

            <MapContainer
                center={[20, 20]}
                zoom={2}
                minZoom={2}
                maxZoom={6}
                scrollWheelZoom={false}
                className="of-map__container"
                zoomControl={true}
                attributionControl={true}
                worldCopyJump={false}
                maxBounds={[[-85, -180], [85, 180]]}
                maxBoundsViscosity={1.0}
            >
                <FitWorld />
                <ViewportController region={region} selectedPin={selectedPin} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {visiblePins.map((pin) => (
                    <Marker
                        key={pin.id}
                        position={[pin.lat, pin.lng]}
                        icon={activeId === pin.id ? PIN_ICON_ACTIVE : PIN_ICON_DEFAULT}
                        eventHandlers={{
                            mouseenter: () => setActiveId(pin.id),
                            mouseleave: () => setActiveId(null),
                            focus:     () => setActiveId(pin.id),
                            blur:      () => setActiveId(null),
                            click:     () => setSelectedId(pin.id),
                        }}
                    >
                        <Tooltip
                            permanent={false}
                            direction="top"
                            className="of-map__tooltip"
                            offset={[0, -8]}
                        >
                            {pin.label}
                        </Tooltip>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
