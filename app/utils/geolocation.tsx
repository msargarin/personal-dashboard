'use client';

// Function to check if the Geolocation API is supported
function isGeolocationAvailable() {
  return "geolocation" in navigator;
}

// Function to get the user's current position
export const getUserLocation = () => {
  if (isGeolocationAvailable()) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Handle position data here
        const { latitude, longitude } = position.coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        return position.coords
      },
      (error) => {
        console.error(`Geolocation error: ${error.message}`);

        return null;
      },
      {
        // Options object for enabling high accuracy
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  } else {
    console.error("Geolocation is not supported by this browser.");

    return null;
  }
};
