import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useLoaderData } from 'react-router-dom';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Coverage = () => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const districts = useLoaderData()

    // All 64 districts data with branch locations


    useEffect(() => {
        // Initialize map only once
        if (!mapInstanceRef.current && mapRef.current) {
            // Create map centered on Bangladesh
            const map = L.map(mapRef.current).setView([23.685, 90.3563], 7);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
            }).addTo(map);

            // Add markers for each district with branch information
            districts.forEach(district => {
                const popupContent = `
          <div style="font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
              ${district.district}
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">
              <strong>Region:</strong> ${district.region}
            </p>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">
              <strong>City:</strong> ${district.city}
            </p>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #059669;">
              <strong>✓ Service Available</strong>
            </p>
            <details style="margin-top: 8px;">
              <summary style="cursor: pointer; font-size: 13px; color: #3b82f6; font-weight: 500;">
                View Covered Areas (${district.covered_area.length})
              </summary>
              <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 12px; color: #4b5563;">
                ${district.covered_area.map(area => `<li>${area}</li>`).join('')}
              </ul>
            </details>
          </div>
        `;

                const marker = L.marker([district.latitude, district.longitude])
                    .addTo(map)
                    .bindPopup(popupContent, {
                        maxWidth: 300,
                        minWidth: 200
                    });
            });

            mapInstanceRef.current = map;
        }

        // Cleanup on unmount
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredDistricts = districts.filter(district =>
        district.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        district.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        district.region.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const focusOnDistrict = (district) => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([district.latitude, district.longitude], 10);
            // Open popup for the district
            mapInstanceRef.current.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    const latLng = layer.getLatLng();
                    if (latLng.lat === district.latitude && latLng.lng === district.longitude) {
                        layer.openPopup();
                    }
                }
            });
        }
        setSearchTerm('');
    };

    return (
        <div className="min-h-screen bg-base-200">
            {/* Hero Section */}
            <div className="bg-primary text-primary-content py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                        We are available in 64 districts
                    </h1>
                    <p className="text-center text-lg opacity-90">
                        Fast and reliable parcel delivery across Bangladesh
                    </p>
                </div>
            </div>

            {/* Search Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="form-control">
                        <div className="input-group flex">
                            <input
                                type="text"
                                placeholder="Search for a district..."
                                className="input input-bordered input-lg w-full"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <button className="btn btn-square btn-lg btn-primary">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Search Results Dropdown */}
                    {searchTerm && (
                        <div className="card bg-base-100 shadow-xl mt-2 max-h-60 overflow-y-auto">
                            <div className="card-body p-2">
                                {filteredDistricts.length > 0 ? (
                                    filteredDistricts.map((district, index) => (
                                        <button
                                            key={index}
                                            className="btn btn-ghost justify-start text-left"
                                            onClick={() => focusOnDistrict(district)}
                                        >
                                            <div className="flex flex-col items-start w-full">
                                                <span className="font-semibold">{district.district}</span>
                                                <span className="text-xs opacity-60">{district.region} Region</span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-center py-4 text-base-content/60">
                                        No districts found
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Map Section */}
            <div className="container mx-auto px-4 pb-12">
                <div className="card bg-base-100 shadow-2xl">
                    <div className="card-body p-0">
                        <div
                            ref={mapRef}
                            className="w-full h-[600px] rounded-2xl"
                            style={{ minHeight: '600px' }}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container mx-auto px-4 pb-12">
                <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block w-8 h-8 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <div className="stat-title">Districts Covered</div>
                        <div className="stat-value text-primary">64</div>
                        <div className="stat-desc">All over Bangladesh</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block w-8 h-8 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                        <div className="stat-title">Delivery Time</div>
                        <div className="stat-value text-secondary">24-48h</div>
                        <div className="stat-desc">Average delivery time</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-accent">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block w-8 h-8 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                />
                            </svg>
                        </div>
                        <div className="stat-title">Success Rate</div>
                        <div className="stat-value text-accent">98%</div>
                        <div className="stat-desc">On-time deliveries</div>
                    </div>
                </div>
            </div>

            {/* Required Leaflet CSS */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css"
            />
        </div>
    );
};

export default Coverage;