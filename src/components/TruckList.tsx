import { FoodTruck } from '../types';
import { MapPin, Clock } from 'lucide-react';

interface TruckListProps {
  trucks: FoodTruck[];
  selectedTruck: FoodTruck | null;
  setSelectedTruck: (truck: FoodTruck | null) => void;
}

const TruckList = ({ trucks, selectedTruck, setSelectedTruck }: TruckListProps) => {
  return (
    <div className="space-y-4">
      {trucks.map((truck) => (
        <div
          key={truck.id}
          className={`p-4 rounded-lg shadow-md cursor-pointer transition-all ${
            selectedTruck?.id === truck.id
              ? 'bg-blue-50 border-2 border-blue-500'
              : 'bg-white hover:bg-gray-50'
          }`}
          onClick={() => setSelectedTruck(truck)}
        >
          <div className="flex gap-4">
            <img
              src={truck.imageUrl}
              alt={truck.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{truck.name}</h3>
                  <p className="text-gray-600">{truck.description}</p>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{truck.city}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{truck.schedule}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TruckList;