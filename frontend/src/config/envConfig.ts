/**
 * Centralized Application Environment & Status Configuration.
 * 
 * Provides a single source of truth for environmental indicators, product names,
 * and data labeling across the Ride AI web application.
 */

export interface EnvConfig {
  appName: string;
  envMode: 'demo' | 'development' | 'production';
  isDemoEnv: boolean;
  networkBadge: string;
  models: {
    xgboost: string;
    lstm: string;
  };
  status: {
    connected: string;
    ready: string;
    demoMode: string;
    demoBadge: string;
    sampleData: string;
  };
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
    heroSubtitle: string;
    supportSubtitle: string;
  };
}

export const APP_ENV: EnvConfig = {
  appName: 'Ride AI',
  envMode: 'demo',
  isDemoEnv: true,
  networkBadge: 'NYC METRO NETWORK',
  models: {
    xgboost: 'XGBoost Trip Duration Model',
    lstm: 'PyTorch LSTM Demand Forecast',
  },
  status: {
    connected: 'AI Services Connected',
    ready: 'AI Services Ready',
    demoMode: 'DEMO MODE',
    demoBadge: 'DEMO ENVIRONMENT',
    sampleData: 'Sample Data',
  },
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
    heroSubtitle: 'AI-powered mobility intelligence for demand forecasting, trip duration estimation, and driver decision support.',
    supportSubtitle: 'Help with predictions, demand insights, account settings, and application features.',
  },
};
