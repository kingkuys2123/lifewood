import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './OfficesMap.css';

/* ── Pin locations ───────────────────────────────────────────── */
const PINS = [
    { id: 'us',         label: 'United States',   lat: 39.5,   lng: -98.35  },
    { id: 'brazil',     label: 'Brazil',           lat: -14.24, lng: -51.93  },
    { id: 'finland',    label: 'Finland',          lat: 61.92,  lng: 25.74   },
    { id: 'uk',         label: 'United Kingdom',   lat: 55.38,  lng: -3.44   },
    { id: 'germany',    label: 'Germany',          lat: 51.17,  lng: 10.45   },
    { id: 'middleeast', label: 'Middle East',      lat: 24.47,  lng: 53.85   },
    { id: 'africa',     label: 'Africa',           lat: 8.78,   lng: 20.52   },
    { id: 'safrica',    label: 'South Africa',     lat: -30.56, lng: 22.94   },
    { id: 'madagascar', label: 'Madagascar',       lat: -18.77, lng: 46.87   },
    { id: 'australia',  label: 'Australia',        lat: -25.27, lng: 133.78  },
    { id: 'japan',      label: 'Japan',            lat: 36.20,  lng: 138.25  },
    { id: 'china',      label: 'China',            lat: 35.86,  lng: 104.20  },
    { id: 'bangladesh', label: 'Bangladesh',       lat: 23.68,  lng: 90.36   },
    { id: 'india',      label: 'India',            lat: 20.59,  lng: 78.96   },
    { id: 'philippines',label: 'Philippines',      lat: 12.88,  lng: 121.77  },
    { id: 'hongkong',   label: 'Hong Kong',        lat: 22.32,  lng: 114.17  },
    { id: 'vietnam',    label: 'Vietnam',          lat: 14.06,  lng: 108.28  },
    { id: 'thailand',   label: 'Thailand',         lat: 15.87,  lng: 100.99  },
    { id: 'malaysia',   label: 'Malaysia',         lat: 4.21,   lng: 108.96  },
    { id: 'indonesia',  label: 'Indonesia',        lat: -0.79,  lng: 113.92  },
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

/* ── Main component ───────────────────────────────────────── */
export default function OfficesMap() {
    const [activeId, setActiveId] = useState(null);

    return (
        <div className="of-map__wrapper" role="region" aria-label="Global offices map">
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
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {PINS.map((pin) => (
                    <Marker
                        key={pin.id}
                        position={[pin.lat, pin.lng]}
                        icon={activeId === pin.id ? PIN_ICON_ACTIVE : PIN_ICON_DEFAULT}
                        eventHandlers={{
                            mouseover: () => setActiveId(pin.id),
                            mouseout:  () => setActiveId(null),
                            focus:     () => setActiveId(pin.id),
                            blur:      () => setActiveId(null),
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
