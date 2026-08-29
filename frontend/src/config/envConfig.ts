/**
 * Centralized Application Environment & Status Configuration.
 * 
 * Provides a single source of truth for environmental indicators and data labeling,
 * ensuring clear differentiation between live backend capabilities and demo/sample data.
 */

export interface EnvConfig {
  envMode: 'demo' | 'development' | 'production';
  isDemoEnv: boolean;
  labels: {
    environmentBadge: string;
    environmentShort: string;
    sampleDataBadge: string;
    sampleRecords: string;
    demoEstimate: string;
    demoFeedback: string;
    demoDispatch: string;
    demoDriverPrefix: string;
    demoAccountDefault: string;
    sampleTripsHeader: string;
  };
}

export const APP_ENV: EnvConfig = {
  envMode: 'demo',
  isDemoEnv: true,
  labels: {
    environmentBadge: 'DEMO ENVIRONMENT',
    environmentShort: 'DEMO MODE',
    sampleDataBadge: 'Sample Data',
    sampleRecords: 'Sample Trip Records',
    demoEstimate: 'Demo Estimate',
    demoFeedback: 'Demo Passenger Feedback',
    demoDispatch: 'Demo Dispatch Rate',
    demoDriverPrefix: 'Demo Driver',
    demoAccountDefault: 'demo@rideai.local',
    sampleTripsHeader: 'Sample Completed Trips',
  },
};
