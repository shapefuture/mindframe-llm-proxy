
import React from 'react';
import type { SJTScenario } from '@core_logic/types';

interface SJTStepProps {
  sjtScenarios: SJTScenario[];
  sjtAnswersById: { [scenarioId: string]: string }; // scenarioId -> selected option index as string
  onSJTAnswerChange: (scenarioId: string, selectedOptionIndex: number) => void;
}

const SJTStep: React.FC<SJTStepProps> = ({ sjtScenarios, sjtAnswersById, onSJTAnswerChange }) => {
  React.useEffect(() => {
    console.log('[SJTStep] Mounted with props:', { sjtScenarios, sjtAnswersById });
  }, [sjtScenarios, sjtAnswersById]);

  try {
    return (
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">Situational Judgement</h2>
        <p className="text-sm text-muted-foreground">Consider these scenarios and select the option that best matches what you would actually do (not what you think is the "right" answer).</p>
        {sjtScenarios.map((sjt, index) => (
          <div key={sjt.id} className="mb-4 p-3 border rounded-md bg-card">
            <p className="font-medium mb-2 text-sm">{index + 1}. {sjt.scenarioText}</p>
            <div className="space-y-2">
              {sjt.options.map((opt, optIndex) => (
                <label
                  key={optIndex}
                  className={`flex items-center space-x-2 p-2.5 border rounded-md cursor-pointer hover:bg-secondary/30 transition-colors
                    ${sjtAnswersById[sjt.id] === String(optIndex) ? 'bg-primary/10 ring-1 ring-primary' : 'border-border'}
                  `}
                >
                  <input
                    type="radio"
                    name={`sjt-${sjt.id}`}
                    className="form-radio h-4 w-4 text-primary focus:ring-primary"
                    checked={sjtAnswersById[sjt.id] === String(optIndex)}
                    onChange={() => {
                      console.log('[SJTStep] User selected SJT option:', { scenarioId: sjt.id, optIndex, text: opt.text });
                      onSJTAnswerChange(sjt.id, optIndex);
                    }}
                  />
                  <span className="text-sm">{opt.text}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 p-1 bg-secondary/20 rounded">{sjt.biasExplanation}</p>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('[SJTStep] Render error:', error);
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded">
        <h2 className="text-lg font-bold">Error</h2>
        <p>There was a problem displaying the situational judgement step. Please reload or contact support.</p>
      </div>
    );
  }
};

export default SJTStep;
