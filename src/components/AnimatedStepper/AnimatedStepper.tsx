import React from 'react';
import './AnimatedStepper.css';

// Step sub-component — used as children of AnimatedStepper to declare step labels
export function Step({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

interface AnimatedStepperProps {
  currentStep: number; // 0-indexed: steps before currentStep are completed, currentStep is active
  children: React.ReactNode;
}

// AnimatedStepper — purely visual, controlled by currentStep prop
export default function AnimatedStepper({ currentStep, children }: AnimatedStepperProps) {
  const stepItems = React.Children.toArray(children);

  return (
    <div className="as-root">
      {stepItems.map((step, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;
        return (
          <React.Fragment key={i}>
            <div className={`as-step${isCompleted ? ' as-completed' : ''}${isActive ? ' as-active' : ''}`}>
              <div className="as-indicator">
                {isCompleted ? (
                  <svg viewBox="0 0 24 24" className="as-check-icon">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <div className="as-label">{step}</div>
            </div>
            {i < stepItems.length - 1 && (
              <div className={`as-connector${isCompleted ? ' as-connector-done' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
