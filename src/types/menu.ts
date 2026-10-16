/**
 * Defines the supported dietary and preparation tags.
 * The lowercase "spicy" value matches the supplied JSON data.
 */
export type DietaryTag = "V" | "GF" | "spicy";

/**
 * Represents a single menu item.
 * Some items, such as sides, do not have descriptions.
 */
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  tags: DietaryTag[];

  /**
   * Optional UI state for an item that is temporarily unavailable.
   * This property is not present in the original mock data.
   */
  sold_out?: boolean;
  popular?: boolean;
}

/**
 * Represents one menu category and its associated items.
 */
export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
}

/**
 * Defines the restaurant's weekly opening hours.
 * The supplied data stores these as display strings, such as
 * "08:00 – 15:00" or "Closed".
 */
export interface RestaurantHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

/**
 * Contains the restaurant's public-facing information.
 */
export interface Restaurant {
  name: string;
  tagline: string;
  address: string;
  hours: RestaurantHours;
  brand_color: string;
  phone: string;
  instagram: string;
}

/**
 * Identifies the featured menu item and its promotional description.
 */
export interface TodaySpecial {
  item_id: string;
  blurb: string;
}

/**
 * Represents the complete supplied restaurant dataset.
 * The property names deliberately match the JSON keys.
 */
export interface RestaurantData {
  restaurant: Restaurant;
  today_special: TodaySpecial;
  categories: MenuCategory[];
}
