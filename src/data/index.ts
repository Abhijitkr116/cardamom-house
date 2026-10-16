
import rawMenuData from "./menu.json";
import type { RestaurantData } from "@/types/menu";

/**
 * Exposes the imported JSON through the restaurant data type.
 *
 * The type assertion documents the expected data shape for TypeScript.
 * It does not validate the JSON at runtime, so the JSON structure must
 * remain consistent with RestaurantData.
 */
export const restaurantData = rawMenuData as RestaurantData;
