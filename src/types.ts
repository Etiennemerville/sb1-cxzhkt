export interface FoodTruck {
  id: number;
  name: string;
  city: string;
  description: string;
  schedule: string;
  coordinates: [number, number];
  imageUrl: string;
}

export interface MapMarkerProps {
  truck: FoodTruck;
  setSelected: (truck: FoodTruck | null) => void;
}