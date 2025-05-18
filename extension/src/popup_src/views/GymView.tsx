
import React from 'react';
import { Link } from 'react-router-dom';
import { hcLibraryData } from '@assets/data/hc_library_data';
import type { HCData } from '@core_logic/types';
import { Brain } from 'lucide-react'; // Example icon

const GymView: React.FC = () => {
  React.useEffect(() => {
    console.log('[GymView] Mounted');
  }, []);

  try {
    return (
      <div className="p-4 space-y-4 max-h-full overflow-y-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-primary flex items-center">
            <Brain className="w-6 h-6 mr-2"/> HC Gym
          </h1>
          <Link to="/profile" className="text-sm text-primary-foreground bg-primary px-3 py-1 rounded-md hover:bg-primary/90">
            My Profile
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Explore Heuristics & Cognitive skills. Select a skill to learn more and practice with drills.
        </p>
        <div className="grid grid-cols-1 gap-3">
          {hcLibraryData.map((hc: HCData) => (
            <Link
              key={hc.id}
              to={`/hc-detail/${hc.id}`}
              className="block p-3 border rounded-lg hover:shadow-md transition-shadow bg-card hover:border-primary/50"
              onClick={() => {
                console.log('[GymView] User clicked HC skill:', hc.id);
              }}
            >
              <div className="flex items-center space-x-3">
                {typeof hc.icon === 'string' ? (
                  <span className="text-2xl">{hc.icon}</span>
                ) : (
                  <hc.icon className="w-6 h-6 text-primary" />
                )}
                <div>
                  <h2 className="font-medium">{hc.name}</h2>
                  <p className="text-xs text-muted-foreground line-clamp-2">{hc.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('[GymView] Render error:', error);
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded">
        <h2 className="text-lg font-bold">Error</h2>
        <p>There was a problem displaying the gym view. Please reload or contact support.</p>
      </div>
    );
  }
};

export default GymView;
