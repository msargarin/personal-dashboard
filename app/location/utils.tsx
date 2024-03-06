import { createContext, useContext, useState } from 'react';

// Context for news page widget
const LocationContext = createContext(null);
const SetLocationContext = createContext(null);

export function LocationProvider({ children } : { children: any}) {
  const [location, setLocation] = useState();

  return (
    <LocationContext.Provider value={location}>
      <SetLocationContext.Provider value={setLocation}>
        {children}
      </SetLocationContext.Provider>
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}

export function useSetLocation() {
  return useContext(SetLocationContext);
}
