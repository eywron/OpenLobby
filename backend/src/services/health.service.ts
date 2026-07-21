import { env } from "../config/env";

export type HealthStatus = {
  status: "ok";
  service: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
};

export function getHealthStatus(): HealthStatus {
  return {
    status: "ok",
    service: "openlobby-backend",
    environment: env.NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  };
}