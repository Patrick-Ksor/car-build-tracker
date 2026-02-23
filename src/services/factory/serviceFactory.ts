import type { IAuthService } from "@/services/interfaces/IAuthService";
import type { ICarsService } from "@/services/interfaces/ICarsService";
import type { IModsService } from "@/services/interfaces/IModsService";

// Mock implementations
import { MockAuthService } from "@/services/mock/MockAuthService";
import { MockCarsService } from "@/services/mock/MockCarsService";
import { MockModsService } from "@/services/mock/MockModsService";

// Real implementations
import { AuthService } from "@/services/real/AuthService";
import { CarsService } from "@/services/real/CarsService";
import { ModsService } from "@/services/real/ModsService";

export interface ServiceContainer {
  auth: IAuthService;
  cars: ICarsService;
  mods: IModsService;
}

function createServices(): ServiceContainer {
  // Vite statically replaces import.meta.env.* at build time,
  // so mock code is completely tree-shaken out of production bundles.
  if (import.meta.env.VITE_USE_MOCK === "true") {
    console.info(
      "[ServiceFactory] 🔧 Running in MOCK mode — no API calls will be made.",
    );
    return {
      auth: new MockAuthService(),
      cars: new MockCarsService(),
      mods: new MockModsService(),
    };
  }

  console.info("[ServiceFactory] 🌐 Running in REAL API mode.");
  return {
    auth: new AuthService(),
    cars: new CarsService(),
    mods: new ModsService(),
  };
}

/**
 * Global service container.
 * All Pinia stores import from this object — never from concrete classes directly.
 * To switch from mock → real: set VITE_USE_MOCK=false in .env.development
 */
export const services: ServiceContainer = createServices();
