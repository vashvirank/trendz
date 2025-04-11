// // f34b5a503amshfb30a225316ae59p133000jsn9dc3021d1682
// import React, { useRef, useState, useEffect } from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls, Stars, useTexture } from "@react-three/drei";
// import * as THREE from "three";

// const cartesianToLatLon = (x, y, z) => {
//   const radius = Math.sqrt(x * x + y * y + z * z);
//   const lat = Math.asin(y / radius) * (180 / Math.PI);
//   const lon = Math.atan2(z, -x) * (180 / Math.PI); // flipped x to correct longitude
//   return { lat: parseFloat(lat.toFixed(2)), lon: parseFloat(lon.toFixed(2)) };
// };

// const latLonToCartesian = (lat, lon, radius = 1.01) => {
//   const phi = (90 - lat) * (Math.PI / 180);
//   const theta = (lon + 180) * (Math.PI / 180);
//   const x = -(radius * Math.sin(phi) * Math.cos(theta));
//   const y = radius * Math.cos(phi);
//   const z = radius * Math.sin(phi) * Math.sin(theta);
//   return [x, y, z];
// };

// const CityPins = ({ cities }) => {
//   return cities.map((city, index) => {
//     const position = latLonToCartesian(city.latitude, city.longitude);
//     return (
//       <mesh key={index} position={position}>
//         <sphereGeometry args={[0.01, 8, 8]} />
//         <meshStandardMaterial color="red" />
//       </mesh>
//     );
//   });
// };

// const Earth = ({ onSelect }) => {
//   const texture = useTexture("/images/earth-day.jpg");
//   const earthRef = useRef();
//   const { camera } = useThree();

//   const handleClick = (event) => {
//     const mouse = new THREE.Vector2();
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//     const raycaster = new THREE.Raycaster();
//     raycaster.setFromCamera(mouse, camera);

//     const intersects = raycaster.intersectObject(earthRef.current);
//     if (intersects.length > 0) {
//       const point = intersects[0].point;
//       const { lat, lon } = cartesianToLatLon(point.x, point.y, point.z);
//       onSelect({ lat, lon });
//     }
//   };

//   return (
//     <mesh ref={earthRef} onClick={handleClick} rotation={[0, Math.PI, 0]}>
//       {/* Rotate Earth to align correctly */}
//       <sphereGeometry args={[1, 64, 64]} />
//       <meshStandardMaterial map={texture} />
//     </mesh>
//   );
// };

// const presetLocations = [
//   { name: "New York, USA", lat: 40.71, lon: -74.01 },
//   { name: "London, UK", lat: 51.51, lon: -0.13 },
//   { name: "Tokyo, Japan", lat: 35.68, lon: 139.69 },
//   { name: "Sydney, Australia", lat: -33.87, lon: 151.21 },
//   { name: "Delhi, India", lat: 28.61, lon: 77.2 },
// ];

// const SelectLocation = () => {
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [nearbyCities, setNearbyCities] = useState([]);

//   useEffect(() => {
//     const fetchNearbyCities = async () => {
//       if (!selectedLocation) return;
//       try {
//         const lat = selectedLocation.lat.toFixed(2);
//         const lon = selectedLocation.lon.toFixed(2);
//         const lonFormatted = selectedLocation.lon >= 0 ? `%2B${lon}` : lon;

//         const response = await fetch(
//           `https://wft-geo-db.p.rapidapi.com/v1/geo/locations/${lat}${lonFormatted}/nearbyCities?radius=100&limit=5`,
//           {
//             method: "GET",
//             headers: {
//               "X-RapidAPI-Key":
//                 "f34b5a503amshfb30a225316ae59p133000jsn9dc3021d1682",
//               "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
//             },
//           }
//         );
//         const data = await response.json();
//         setNearbyCities(data.data || []);
//       } catch (error) {
//         console.error("Failed to fetch nearby cities", error);
//         setNearbyCities([]);
//       }
//     };

//     fetchNearbyCities();
//   }, [selectedLocation]);

//   const handleSelectChange = (e) => {
//     const location = presetLocations.find((loc) => loc.name === e.target.value);
//     if (location) {
//       setSelectedLocation({ lat: location.lat, lon: location.lon });
//     }
//   };

//   return (
//     <div className="w-full h-screen bg-black text-white relative">
//       <Canvas camera={{ position: [2, 0, 2], fov: 50 }}>
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[5, 5, 5]} />
//         <Stars />
//         <OrbitControls enableZoom={true} />
//         <Earth onSelect={setSelectedLocation} />
//         <CityPins
//           cities={nearbyCities.map((city) => ({
//             latitude: city.latitude,
//             longitude: city.longitude,
//           }))}
//         />
//       </Canvas>

//       <div className="absolute top-4 left-4 bg-white text-black p-4 rounded shadow max-w-xs">
//         <h2 className="font-bold mb-2">Selected Location</h2>
//         {selectedLocation ? (
//           <>
//             <p>Latitude: {selectedLocation.lat}</p>
//             <p>Longitude: {selectedLocation.lon}</p>
//           </>
//         ) : (
//           <p>No location selected.</p>
//         )}

//         <div className="mt-4">
//           <label htmlFor="location-select" className="block mb-1 font-medium">
//             Choose Location:
//           </label>
//           <select
//             id="location-select"
//             onChange={handleSelectChange}
//             className="p-2 border rounded w-full"
//             defaultValue=""
//           >
//             <option value="" disabled>
//               -- Select a city --
//             </option>
//             {presetLocations.map((loc) => (
//               <option key={loc.name} value={loc.name}>
//                 {loc.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {Array.isArray(nearbyCities) && nearbyCities.length > 0 && (
//           <div className="mt-4">
//             <h3 className="font-bold mb-1">Nearby Cities</h3>
//             <ul className="list-disc list-inside text-sm">
//               {nearbyCities.map((city) => (
//                 <li key={city.id}>
//                   {city.city}, {city.country}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SelectLocation;

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

const cartesianToLatLon = (x, y, z) => {
  const radius = Math.sqrt(x * x + y * y + z * z);
  const lat = Math.asin(y / radius) * (180 / Math.PI);
  const lon = Math.atan2(z, x) * (180 / Math.PI); // no flip
  return { lat: parseFloat(lat.toFixed(2)), lon: parseFloat(lon.toFixed(2)) };
};

const latLonToCartesian = (lat, lon, radius = 1.01) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
};

const CityPins = ({ cities }) => {
  return cities.map((city, index) => {
    const position = latLonToCartesian(city.latitude, city.longitude);
    return (
      <mesh key={index} position={position}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  });
};

const Earth = ({ onSelect }) => {
  const texture = useTexture("/images/earth-day.jpg");
  const earthRef = useRef();
  const { camera } = useThree();

  const handleClick = (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(earthRef.current);
    if (intersects.length > 0) {
      const point = intersects[0].point;
      const { lat, lon } = cartesianToLatLon(point.x, point.y, point.z);
      console.log("Clicked point:", point);
      console.log("Converted to lat/lon:", { lat, lon });
      onSelect({ lat, lon });
    }
  };

  return (
    <mesh ref={earthRef} onClick={handleClick}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const presetLocations = [
  { name: "New York, USA", lat: 40.71, lon: -74.01 },
  { name: "London, UK", lat: 51.51, lon: -0.13 },
  { name: "Tokyo, Japan", lat: 35.68, lon: 139.69 },
  { name: "Sydney, Australia", lat: -33.87, lon: 151.21 },
  { name: "Delhi, India", lat: 28.61, lon: 77.2 },
];

const SelectLocation = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [nearbyCities, setNearbyCities] = useState([]);

  useEffect(() => {
    const fetchNearbyCities = async () => {
      if (!selectedLocation) return;
      try {
        const lat = selectedLocation.lat.toFixed(2);
        const lon = selectedLocation.lon.toFixed(2);
        const lonFormatted = selectedLocation.lon >= 0 ? `%2B${lon}` : lon;

        const response = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/locations/${lat}${lonFormatted}/nearbyCities?radius=100&limit=5`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key":
                "f34b5a503amshfb30a225316ae59p133000jsn9dc3021d1682",
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
          }
        );
        const data = await response.json();
        setNearbyCities(data.data || []);
      } catch (error) {
        console.error("Failed to fetch nearby cities", error);
        setNearbyCities([]);
      }
    };

    fetchNearbyCities();
  }, [selectedLocation]);

  const handleSelectChange = (e) => {
    const location = presetLocations.find((loc) => loc.name === e.target.value);
    if (location) {
      setSelectedLocation({ lat: location.lat, lon: location.lon });
    }
  };

  return (
    <div className="w-full h-screen bg-black text-white relative">
      <Canvas camera={{ position: [2, 0, 2], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Stars />
        <OrbitControls enableZoom={true} />
        <Earth onSelect={setSelectedLocation} />
        <CityPins
          cities={nearbyCities.map((city) => ({
            latitude: city.latitude,
            longitude: city.longitude,
          }))}
        />
      </Canvas>

      <div className="absolute top-4 left-4 bg-white text-black p-4 rounded shadow max-w-xs">
        <h2 className="font-bold mb-2">Selected Location</h2>
        {selectedLocation ? (
          <>
            <p>Latitude: {selectedLocation.lat}</p>
            <p>Longitude: {selectedLocation.lon}</p>
          </>
        ) : (
          <p>No location selected.</p>
        )}

        <div className="mt-4">
          <label htmlFor="location-select" className="block mb-1 font-medium">
            Choose Location:
          </label>
          <select
            id="location-select"
            onChange={handleSelectChange}
            className="p-2 border rounded w-full"
            defaultValue=""
          >
            <option value="" disabled>
              -- Select a city --
            </option>
            {presetLocations.map((loc) => (
              <option key={loc.name} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {Array.isArray(nearbyCities) && nearbyCities.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold mb-1">Nearby Cities</h3>
            <ul className="list-disc list-inside text-sm">
              {nearbyCities.map((city) => (
                <li key={city.id}>
                  {city.city}, {city.country}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectLocation;
