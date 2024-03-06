export interface LocationData {
  city: string,
  country: {
    name: string,
    code: string,
  },
  coordinates: {
    lat: number,
    lon: number,
  } | null;
}

export interface WeatherData {
  name: string,
  main: {
    temp: number,
    temp_max: number,
    temp_min: number,
    feels_like: number,
    humidity: number,
  },
  sys: {
    sunrise: number,
    sunset: number,
  }
  weather: {
    description: string,
    main: string,
    icon: string,
  }[],
  dt_txt: string
}

export interface NewsData {
  article_id: number;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image_url: string;
  category: string[];
}

export interface Task {
  id: number;
  text: string;
  done: boolean;
}

export const categoryOptions = [
  'business',
  'crime',
  'domestic',
  'education',
  'entertainment',
  'environment',
  'food',
  'health',
  'lifestyle',
  'other',
  'politics',
  'science',
  'sports',
  'technology',
  'top',
  'tourism',
  'world'
]
