import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import axios from 'axios';

interface DirectionsFormProps {
  selectedTruck: {
    name: string;
    coordinates: [number, number];
  } | null;
  onDirections: (start: [number, number]) => void;
}

const DirectionsForm = ({ selectedTruck, onDirections }: DirectionsFormProps) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTruck) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );

      if (response.data && response.data[0]) {
        const { lat, lon } = response.data[0];
        onDirections([parseFloat(lat), parseFloat(lon)]);
      } else {
        setError('Adresse non trouvée');
      }
    } catch (err) {
      setError('Erreur lors de la recherche de l\'adresse');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedTruck) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="font-semibold mb-3">Itinéraire vers {selectedTruck.name}</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Votre adresse de départ
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="address"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Entrez votre adresse..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            'Recherche...'
          ) : (
            <>
              <Navigation className="h-4 w-4 mr-2" />
              Obtenir l'itinéraire
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DirectionsForm;