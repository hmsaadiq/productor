// FRONTEND ORDER STEPPER COMPONENT: This file defines a reusable OrderStepper component for displaying order progress.
// It provides a consistent stepper layout for showing the current step in the order process across different pages.
//
// Design Patterns: Uses the React Component pattern and presentational component pattern for reusable UI.
// Data Structures: Uses props for step configuration and current step state.
// Security: No direct security features; only displays progress information.

import React from 'react';
// Import MUI components for order stepper UI
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
} from '@mui/icons-material';

// Define the step interface
interface StepConfig {
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

// Define the props for the OrderStepper component
interface OrderStepperProps {
  steps: StepConfig[];
  activeStep: number;
  completedSteps?: number[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'compact';
  showDescription?: boolean;
}

// Default steps for the order process
const defaultSteps: StepConfig[] = [
  { label: 'Customize', description: 'Design your perfect cake' },
  { label: 'Delivery Details', description: 'Enter delivery information' },
  { label: 'Payment', description: 'Complete your payment' },
  { label: 'Confirmation', description: 'Order confirmed' },
];

// OrderStepper component displays order progress - New: Reusable MUI order stepper.
export default function OrderStepper({
  steps = defaultSteps,
  activeStep,
  completedSteps = [],
  orientation = 'horizontal',
  variant = 'default',
  showDescription = true,
}: OrderStepperProps) {
  // Custom step icon component
  const StepIcon = ({ active, completed, stepIndex }: { active: boolean; completed: boolean; stepIndex: number }) => {
    const isCompleted = completed || completedSteps.includes(stepIndex);
    
    return (
      <Box
        sx={{
          width: variant === 'compact' ? 28 : 32,
          height: variant === 'compact' ? 28 : 32,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isCompleted 
            ? 'success.main' 
            : active 
            ? 'primary.main' 
            : 'grey.300',
          color: 'white',
          fontSize: variant === 'compact' ? '0.75rem' : '0.875rem',
          fontWeight: 600,
          transition: 'all 0.3s ease',
        }}
      >
        {isCompleted ? (
          <CheckCircle sx={{ fontSize: variant === 'compact' ? 16 : 20 }} />
        ) : active ? (
          <RadioButtonUnchecked sx={{ fontSize: variant === 'compact' ? 16 : 20 }} />
        ) : (
          stepIndex + 1
        )}
      </Box>
    );
  };

  // Render compact version
  if (variant === 'compact') {
    return (
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep} orientation={orientation} alternativeLabel={orientation === 'horizontal'}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={(props) => (
                  <StepIcon 
                    active={props.active || false} 
                    completed={props.completed || false} 
                    stepIndex={index} 
                  />
                )}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  }

  // Render default version with Paper wrapper
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Stepper activeStep={activeStep} orientation={orientation} alternativeLabel={orientation === 'horizontal'}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              StepIconComponent={(props) => (
                <StepIcon 
                  active={props.active || false} 
                  completed={props.completed || false} 
                  stepIndex={index} 
                />
              )}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {step.label}
                </Typography>
                {showDescription && step.description && (
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                )}
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
}