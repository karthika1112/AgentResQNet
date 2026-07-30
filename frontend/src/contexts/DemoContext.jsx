import React, { createContext, useContext, useState, useEffect } from 'react';

const DemoContext = createContext();

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

export const DemoProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState(0);

  const toggleDemoMode = () => {
    setIsDemoMode(prev => !prev);
  };

  // Auto-advance workflow in demo mode for presentation purposes
  useEffect(() => {
    let interval;
    if (isDemoMode) {
      interval = setInterval(() => {
        setCurrentWorkflowStep(prev => (prev >= 7 ? 0 : prev + 1));
      }, 5000); // Advance every 5 seconds
    } else {
      setCurrentWorkflowStep(0);
    }
    return () => clearInterval(interval);
  }, [isDemoMode]);

  return (
    <DemoContext.Provider value={{ isDemoMode, toggleDemoMode, currentWorkflowStep, setCurrentWorkflowStep }}>
      {children}
    </DemoContext.Provider>
  );
};
