"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  RiCheckLine,
  RiCloseLine,
  RiFireLine,
  RiLeafLine,
  RiRestaurantLine,
  RiSearchLine,
  RiStarFill,
} from "@remixicon/react";
import type { RestaurantData, DietaryTag } from "@/types/menu";
import { menuItemImages } from "@/data/images";

/**
 * Define the available dietary filters and their display labels.
 */
const dietaryFilters: {
  value: "all" | DietaryTag;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "V", label: "Vegetarian" },
  { value: "GF", label: "Gluten-free" },
  { value: "spicy", label: "Spicy" },
];

/**
 * Convert a dietary tag into a visitor-friendly label.
 */
function getTagLabel(tag: DietaryTag): string {
  if (tag === "V") return "Vegetarian";
  if (tag === "GF") return "Gluten-free";
  return "Spicy";
}

/**
 * Display a compact menu card with separated status badges and price.
 */
function MenuItemCard({
  item,
  index,
  reduceMotion,
}: {
  item: RestaurantData["categories"][number]["items"][number];
  index: number;
  reduceMotion: boolean;
}) {
  const imageSrc = menuItemImages[item.id];
  const isSoldOut = item.sold_out === true;
  const isPopular = item.popular === true;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduceMotion ? 0 : 0.35,
        delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.16),
        ease: "easeOut",
      }}
      className={`flex min-w-0 gap-3 rounded-xl border border-sand/80 bg-white p-3 transition-colors duration-200 sm:gap-4 sm:p-4 ${
        isSoldOut ? "bg-stone-50" : "hover:border-brand/40"
      }`}
    >
      {imageSrc && (
        <div className="relative h-[76px] w-[76px] shrink-0 self-start overflow-hidden rounded-lg bg-cream sm:h-24 sm:w-24">
          <Image
            src={imageSrc}
            alt={item.name}
            fill
            sizes="(max-width: 639px) 76px, 96px"
            className={`object-cover ${isSoldOut ? "grayscale-[35%]" : ""}`}
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Keep the dish name and price separate from status badges. */}
        <div className="flex min-w-0 items-start justify-between gap-2">
          <h4 className="min-w-0 flex-1 break-words text-sm font-semibold leading-5 text-espresso sm:text-base">
            {item.name}
          </h4>

          <p className="shrink-0 whitespace-nowrap text-sm font-bold tabular-nums text-brand sm:text-base">
            €{item.price.toFixed(2)}
          </p>
        </div>

        {/* Put status labels on their own row to prevent mobile overlap. */}
        {(isPopular || isSoldOut) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {isPopular && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold leading-4 text-amber-800 ring-1 ring-inset ring-amber-200 sm:text-xs">
                <RiStarFill aria-hidden="true" className="h-3 w-3" />
                Popular
              </span>
            )}

            {isSoldOut && (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold leading-4 text-stone-600 ring-1 ring-inset ring-stone-200 sm:text-xs">
                <RiCloseLine aria-hidden="true" className="h-3 w-3" />
                Sold out
              </span>
            )}
          </div>
        )}

        {item.description && (
          <p className="mt-2 line-clamp-3 text-xs leading-5 text-stone-600 sm:text-sm sm:leading-6">
            {item.description}
          </p>
        )}

        {item.tags.length > 0 && (
          <ul
            aria-label={`Dietary tags for ${item.name}`}
            className="mt-2.5 flex flex-wrap gap-1.5"
          >
            {item.tags.map((tag) => (
              <li
                key={tag}
                className="inline-flex items-center gap-1 rounded-md bg-cream px-2 py-1 text-[10px] font-medium leading-3 text-spice sm:text-xs"
              >
                {tag === "V" && (
                  <RiLeafLine aria-hidden="true" className="h-3 w-3" />
                )}
                {tag === "GF" && (
                  <RiCheckLine aria-hidden="true" className="h-3 w-3" />
                )}
                {tag === "spicy" && (
                  <RiFireLine aria-hidden="true" className="h-3 w-3" />
                )}
                {getTagLabel(tag)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.article>
  );
}

/**
 * Render the searchable menu with responsive category and dietary filters.
 */
export default function MenuSection({
  categories,
}: {
  categories: RestaurantData["categories"];
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeDiet, setActiveDiet] = useState<"all" | DietaryTag>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const reduceMotion = useReducedMotion() ?? false;

  /**
   * Filter menu items by category, dietary preference, name, and description.
   */
  const filteredCategories = categories
    .filter(
      (category) => activeCategory === "all" || category.id === activeCategory,
    )
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        const matchesDiet =
          activeDiet === "all" || item.tags.includes(activeDiet);

        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          item.name.toLowerCase().includes(query) ||
          (item.description?.toLowerCase().includes(query) ?? false);

        return matchesDiet && matchesSearch;
      }),
    }))
    .filter((category) => category.items.length > 0);

  /**
   * Reset the search field and both menu filters.
   */
  function resetFilters() {
    setActiveCategory("all");
    setActiveDiet("all");
    setSearchQuery("");
  }

  return (
    <motion.section
      id="menu"
      aria-labelledby="menu-heading"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
      className="mt-12 scroll-mt-24 sm:mt-16 lg:mt-20"
    >
      {/* Use smaller typography and tighter spacing on mobile. */}
      <div className="mb-6 text-center sm:mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand sm:text-xs sm:tracking-[0.25em]">
          Fresh from our kitchen
        </p>

        <h2
          id="menu-heading"
          className="mt-2 text-3xl font-medium leading-tight sm:mt-3 sm:text-4xl lg:text-5xl"
        >
          Our Menu
        </h2>

        <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-stone-600 sm:mt-3 sm:text-sm sm:leading-6">
          Seasonal favourites, carefully made coffee, and slow brunches worth
          lingering over.
        </p>
      </div>

      {/* Compact search field with a Remix Icon and a clear action. */}
      <div className="mx-auto mb-5 max-w-xl sm:mb-6">
        <label
          htmlFor="menu-search"
          className="mb-1.5 block text-xs font-medium text-espresso sm:text-sm"
        >
          Find your favourite
        </label>

        <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-sand bg-white px-3 py-2.5 transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10 sm:rounded-2xl sm:px-4 sm:py-3">
          <RiSearchLine
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-stone-500"
          />

          <input
            id="menu-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search dishes, coffee..."
            className="min-w-0 flex-1 bg-transparent text-sm text-espresso !outline-none placeholder:text-stone-400"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-full text-brand transition-colors hover:bg-cream"
            >
              <RiCloseLine aria-hidden="true" className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontally scrollable category controls on narrow screens. */}
      <div className="mb-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 sm:text-xs">
          Explore categories
        </p>

        <div
          role="group"
          aria-label="Filter menu by category"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            aria-pressed={activeCategory === "all"}
            className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors sm:text-sm ${
              activeCategory === "all"
                ? "border-brand bg-brand text-white"
                : "border-sand bg-white text-espresso hover:border-brand"
            }`}
          >
            <RiRestaurantLine aria-hidden="true" className="h-4 w-4" />
            All dishes
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              aria-pressed={activeCategory === category.id}
              className={`min-h-9 shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors sm:text-sm ${
                activeCategory === category.id
                  ? "border-brand bg-brand text-white"
                  : "border-sand bg-white text-espresso hover:border-brand"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Keep dietary controls compact and easy to scan. */}
      <div className="mb-7 sm:mb-9">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 sm:text-xs">
          Dietary preferences
        </p>

        <div
          role="group"
          aria-label="Filter by dietary preference"
          className="flex flex-wrap gap-2 "
        >
          {dietaryFilters.map((diet) => (
            <button
              key={diet.value}
              type="button"
              onClick={() => setActiveDiet(diet.value)}
              aria-pressed={activeDiet === diet.value}
              className={`inline-flex min-h-8 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                activeDiet === diet.value
                  ? "border-spice bg-spice text-white"
                  : "border-sand bg-white text-stone-700 hover:border-spice"
              }`}
            >
              {diet.value === "V" && (
                <RiLeafLine aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {diet.value === "GF" && (
                <RiCheckLine aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {diet.value === "spicy" && (
                <RiFireLine aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {diet.label}
            </button>
          ))}
        </div>
      </div>

      {/* Render the matching categories and responsive menu cards. */}
      <div className="space-y-6 sm:space-y-9">
        {filteredCategories.map((category) => (
          <section
            key={category.id}
            id={`category-${category.id}`}
            aria-labelledby={`heading-${category.id}`}
            className="scroll-mt-24 rounded-2xl border border-sand/80 bg-white p-3.5 sm:p-6 lg:p-8"
          >
            <div className="mb-4 border-b border-sand pb-3.5 sm:mb-5 sm:pb-4">
              <h3
                id={`heading-${category.id}`}
                className="text-xl font-medium leading-tight sm:text-2xl lg:text-3xl"
              >
                {category.name}
              </h3>

              {category.description && (
                <p className="mt-1.5 text-xs leading-5 text-stone-600 sm:text-sm sm:leading-6">
                  {category.description}
                </p>
              )}
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
              {category.items.map((item, index) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </section>
        ))}

        {filteredCategories.length === 0 && (
          <div
            role="status"
            className="rounded-2xl border border-sand bg-white px-4 py-9 text-center sm:px-5 sm:py-12"
          >
            <RiSearchLine
              aria-hidden="true"
              className="mx-auto h-8 w-8 text-stone-400"
            />

            <h3 className="mt-3 text-lg font-semibold text-espresso sm:text-xl">
              No matching dishes found
            </h3>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Try another search, category, or dietary preference.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-spice"
            >
              <RiCloseLine aria-hidden="true" className="h-4 w-4" />
              Clear search and filters
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
}
