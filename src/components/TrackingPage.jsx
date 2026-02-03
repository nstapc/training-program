import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, User } from 'lucide-react';
import { getUserProfile } from '../utils/progressTracker';

const TrackingPage = ({ onBack }) => {
  const [usdaApiKey, setUsdaApiKey] = useState('');
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [trackingData, setTrackingData] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const userProfile = getUserProfile();
    setProfile(userProfile);
  }, []);

  const isSignedIn = profile && profile.name;

  useEffect(() => {
    // Load API key from localStorage if available
    const savedApiKey = localStorage.getItem('usdaApiKey');
    if (savedApiKey) {
      setUsdaApiKey(savedApiKey);
      setApiKeySaved(true);
    }

    // Load tracking data from localStorage
    const savedData = localStorage.getItem('trackingData');
    if (savedData) {
      // Sort saved data in descending order (newest first)
      const sortedData = JSON.parse(savedData).sort((a, b) => new Date(b.date) - new Date(a.date));
      setTrackingData(sortedData);
    } else {
      // Initialize with sample data for the last 7 days (newest first)
      const initialData = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        initialData.push({
          date: date.toISOString().split('T')[0],
          sleep: '',
          weight: '',
          steps: '',
          food: '',
          calories: '',
          protein: '',
          carbs: '',
          fats: ''
        });
      }
      setTrackingData(initialData);
    }
  }, []);

  const handleApiKeyChange = (e) => {
    setUsdaApiKey(e.target.value);
  };

  const saveApiKey = () => {
    if (usdaApiKey.trim()) {
      localStorage.setItem('usdaApiKey', usdaApiKey.trim());
      setApiKeySaved(true);
    }
  };

    const handleDataChange = (index, field, value) => {
    const newData = [...trackingData];
    newData[index] = {
      ...newData[index],
      [field]: value
    };
    setTrackingData(newData);
    saveData();
  };

      const saveData = () => {
    localStorage.setItem('trackingData', JSON.stringify(trackingData));
  };

    const addNewDay = () => {
    const latestDate = new Date(trackingData[0].date);
    const nextDate = new Date(latestDate);
    nextDate.setDate(latestDate.getDate() + 1);
    const newDay = {
      date: nextDate.toISOString().split('T')[0],
      sleep: '',
      weight: '',
      steps: '',
      food: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: ''
    };
    setTrackingData([newDay, ...trackingData]);
    saveData();
  };

    const fetchNutritionData = async (food, index) => {
    if (!apiKeySaved) {
      alert('Please save your USDA API key first');
      return;
    }

    try {
      // This is a placeholder for the actual implementation
      // In a real app, you would use the USDA API to fetch nutrition data
      // For this example, we'll use mock data
      const mockNutritionData = {
        calories: Math.floor(Math.random() * 500) + 200,
        protein: Math.floor(Math.random() * 30) + 10,
        carbs: Math.floor(Math.random() * 60) + 20,
        fats: Math.floor(Math.random() * 20) + 5
      };

      const newData = [...trackingData];
      newData[index] = {
        ...newData[index],
        calories: mockNutritionData.calories,
        protein: mockNutritionData.protein,
        carbs: mockNutritionData.carbs,
        fats: mockNutritionData.fats
      };
      setTrackingData(newData);
      saveData();
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      alert('Error fetching nutrition data');
    }
  };

  return (
    <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center bg-no-repeat text-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="text-sm px-4 py-2 bg-white/75 hover:bg-white/100 transition-all transform hover:scale-105 shadow-lg text-black"
            aria-label="Back"
          >
            ← Back
          </button>
                    <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/75 hover:bg-white/100 transition-all transform hover:scale-105 shadow-lg text-black">
              <User size={20} />
              {isSignedIn ? 'Profile' : 'Sign in'}
            </button>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-8 text-black">Daily Tracking</h1>

        {/* USDA API Key Configuration */}
        <div className="bg-white/75 shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black">USDA API Key Configuration</h2>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={usdaApiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter your USDA API key"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-black"
            />
            <button
              onClick={saveApiKey}
              className="px-6 py-2 bg-white/75 hover:bg-white/100 transition-all transform hover:scale-105 shadow-lg text-black"
            >
              Save API Key
            </button>
          </div>
          {apiKeySaved && <p className="text-green-600 mt-2">API key saved successfully!</p>}
        </div>

        {/* Tracking Spreadsheet */}
        <div className="bg-white/75 shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-black">Daily Log</h2>
            <button
              onClick={addNewDay}
              className="px-4 py-2 bg-white/75 hover:bg-white/100 transition-all transform hover:scale-105 shadow-lg text-black"
            >
              Add New Day
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/75">
                  <th className="border border-gray-300 px-4 py-2 text-left text-black">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-black">Sleep (hrs)</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-black">Weight (lbs)</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-black">Steps</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-black">Food</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-black">Calories</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-black">Protein (g)</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-black">Carbs (g)</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-black">Fats (g)</th>
                </tr>
              </thead>
              <tbody>
                {trackingData.map((row, index) => (
                  <tr key={index} className="hover:bg-white/100">
                    <td className="border border-gray-300 px-4 py-2 text-black">{row.date}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={row.sleep}
                        onChange={(e) => handleDataChange(index, 'sleep', e.target.value)}
                        placeholder="8"
                        className="w-full px-2 py-1 border border-gray-300 rounded bg-white text-black"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={row.weight}
                        onChange={(e) => handleDataChange(index, 'weight', e.target.value)}
                        placeholder="180"
                        className="w-full px-2 py-1 border border-gray-300 rounded bg-white text-black"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={row.steps}
                        onChange={(e) => handleDataChange(index, 'steps', e.target.value)}
                        placeholder="10000"
                        className="w-full px-2 py-1 border border-gray-300 rounded bg-white text-black"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        value={row.food}
                        onChange={(e) => handleDataChange(index, 'food', e.target.value)}
                        placeholder="Enter food"
                        className="w-full px-2 py-1 border border-gray-300 rounded bg-white text-black"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{row.calories}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{row.protein}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{row.carbs}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{row.fats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;