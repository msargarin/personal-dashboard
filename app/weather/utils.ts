import { LocationData, WeatherData } from "@/app/data";

// Define function to fetch weather now
export const fetchWeatherNowData = async (location: LocationData|null, setWeatherNowData: Function) => {
  try {
    // Only send request to weather API if location is available
    if (location && location.coordinates) {
      // Send request to api
      const response = await fetch(`/api/weather?lat=${location.coordinates.lat}&lon=${location.coordinates.lon}`);
      const data: WeatherData = await response.json();

      // Load results to component
      setWeatherNowData(data);
    }
  } catch (error) {
    console.error('Error fetching weather now data:', error);
  }
};

// Define function to fetch weather forecast
export const fetchWeatherForecastData = async (location: LocationData|null, setWeatherForecastData: Function) => {
  try {
    // Only send request to weather API if location is available
    if (location && location.coordinates) {
      // Send request to api
      const response = await fetch(`/api/forecast?lat=${location.coordinates.lat}&lon=${location.coordinates.lon}`);
      const data = await response.json();

      console.log(data);  // DEBUG
      // Load results to component
      setWeatherForecastData(data);
    }
  } catch (error) {
    console.error('Error fetching weather forecast data:', error);
  }
};
