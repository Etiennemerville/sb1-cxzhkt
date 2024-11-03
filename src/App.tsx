import { useState, useMemo } from 'react';
import { foodTrucks } from './data/trucks';
import Map from './components/Map';
import TruckList from './components/TruckList';
import WelcomeModal from './components/WelcomeModal';
import SearchBar from './components/SearchBar';
import DirectionsForm from './components/DirectionsForm';
import { FoodTruck } from './types';
import { Truck } from 'lucide-react';
import type { UserData } from './components/WelcomeModal';

function App() {
  const [selectedTruck, setSelectedTruck] = useState<FoodTruck | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [user, setUser] = useState<UserData | null>(() => {
    const savedUser = localStorage.getItem('food2truck_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleRegistration = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('food2truck_user', JSON.stringify(userData));
  };

  const filteredTrucks = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return foodTrucks.filter((truck) =>
      truck.name.toLowerCase().includes(query) ||
      truck.city.toLowerCase().includes(query) ||
      truck.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-100">
      {!user && <WelcomeModal onComplete={handleRegistration} />}
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Truck className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Food2Truck</h1>
            </div>
            {user && (
              <div className="text-sm text-gray-600">
                Bienvenue, {user.firstName} {user.lastName}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {selectedTruck && (
              <DirectionsForm
                selectedTruck={selectedTruck}
                onDirections={setStartCoords}
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Food Trucks disponibles {filteredTrucks.length > 0 && `(${filteredTrucks.length})`}
              </h2>
              <TruckList
                trucks={filteredTrucks}
                selectedTruck={selectedTruck}
                setSelectedTruck={(truck) => {
                  setSelectedTruck(truck);
                  setStartCoords(null); // Reset directions when selecting a new truck
                }}
              />
              {filteredTrucks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun food truck ne correspond à votre recherche</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:sticky lg:top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Carte des emplacements
            </h2>
            <Map
              trucks={filteredTrucks}
              selectedTruck={selectedTruck}
              setSelectedTruck={setSelectedTruck}
              startCoords={startCoords}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;