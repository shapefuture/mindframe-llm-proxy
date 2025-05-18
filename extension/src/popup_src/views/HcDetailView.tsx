
import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { hcLibraryData } from '@assets/data/hc_library_data';
import { hcDrillsData } from '@assets/data/hc_drills_data';
import type { HCData } from '@core_logic/types';
import { ChevronLeft, ListChecks, BookOpenText, Zap, Lightbulb, Award } from 'lucide-react'; // Added Award for examples

const HcDetailView: React.FC = () => {
  const { hcId } = useParams<{ hcId?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[HcDetailView] Mounted', { hcId });
  }, [hcId]);

  try {
    const hc: HCData | undefined = hcLibraryData.find(h => h.id === hcId);
    const drills = hcDrillsData.filter(d => d.hcId === hcId);

    if (!hc) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          Could not find the requested cognitive skill.
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4 max-h-full overflow-y-auto">
        <button
          type="button"
          className="inline-flex items-center text-sm text-primary hover:underline mb-2"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <div className="p-4 border rounded-lg bg-card shadow-sm">
          <div className="flex items-center mb-2">
            {typeof hc.icon === 'string' ? (
              <span className="text-2xl mr-2">{hc.icon}</span>
            ) : (
              hc.icon && React.createElement(hc.icon as React.ElementType, { className: "w-6 h-6 text-primary mr-2" })
            )}
            <h1 className="text-xl font-semibold">{hc.name}</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{hc.description}</p>
          <div className="mt-4 space-y-2">
            <h2 className="font-semibold flex items-center text-accent">
              <BookOpenText className="w-4 h-4 mr-1" /> Examples
            </h2>
            <ul className="list-disc list-inside text-xs ml-2">
              {(hc.examples || []).map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4 space-y-2">
            <h2 className="font-semibold flex items-center text-accent">
              <Zap className="w-4 h-4 mr-1" /> Practice Drills
            </h2>
            {drills.length > 0 ? (
              <ul className="list-none ml-0">
                {drills.map(drill => (
                  <li key={drill.id}>
                    <Link
                      to={`/drill/${hc.id}/${drill.id}`}
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      <ListChecks className="w-4 h-4 mr-1" />
                      {drill.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No drills available for this skill yet.</p>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('[HcDetailView] Render error:', error);
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded">
        <h2 className="text-lg font-bold">Error</h2>
        <p>There was a problem displaying the skill detail. Please reload or contact support.</p>
      </div>
    );
  }
};

export default HcDetailView;
