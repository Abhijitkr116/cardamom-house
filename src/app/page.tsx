import Image from "next/image";
import {
  RiMapPin2Line,
  RiPhoneLine,
  RiInstagramLine,
  RiArrowDownLine,
  RiArrowRightLine,
  RiCalendarCheckLine,
} from "@remixicon/react";

import OpenStatus from "@/components/OpenStatus";
import HoursBlock from "@/components/HoursBlock";
import MenuSection from "@/components/MenuSection";
import Navbar from "@/components/Navbar";
import { restaurantData } from "@/data";
import { restaurantImages, menuItemImages } from "@/data/images";

// Defines the actual status and supported URL demo scenarios.
type DemoState = "actual" | "open" | "closed" | "special-sold-out";

// Defines the props accepted by the homepage.
type HomePageProps = {
  searchParams: Promise<{ state?: string | string[] }>;
};

/**
 * Converts menu tags into visitor-friendly labels.
 */
function getTagLabel(tag: string): string {
  if (tag === "V") return "Vegetarian";
  if (tag === "GF") return "Gluten-free";
  return "Spicy";
}

/**
 * Reads a supported demo state from the URL.
 * Uses actual opening hours when no valid demo state is provided.
 */
function getDemoState(value: string | string[] | undefined): DemoState {
  const state = Array.isArray(value) ? value[0] : value;

  if (state === "open" || state === "closed" || state === "special-sold-out") {
    return state;
  }

  return "actual";
}

/**
 * Renders the café homepage using actual status by default
 * and optional demo states supplied through the URL.
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  const { restaurant, categories, today_special } = restaurantData;
  const params = await searchParams;
  const demoState = getDemoState(params.state);

  /**
   * Creates a separate menu copy for the sold-out demo.
   * The original JSON data remains unchanged.
   */
  const displayCategories = categories.map((category) => ({
    ...category,
    items: category.items.map((item) => ({
      ...item,
      sold_out:
        demoState === "special-sold-out" &&
        (item.name === "Saffron French Toast" ||
          item.id === today_special.item_id)
          ? true
          : item.sold_out,
    })),
  }));

  /**
   * Finds the featured dish in the displayed menu so its
   * availability matches the corresponding menu card.
   */
  const specialItem = displayCategories
    .flatMap((category) => category.items)
    .find((item) => item.id === today_special.item_id);

  const specialIsSoldOut = specialItem?.sold_out === true;

  return (
    <main className="min-h-screen overflow-x-clip bg-cream text-espresso">
      <Navbar />

      {/* Hero banner */}
      <header
        id="home"
        className="relative isolate min-h-[440px] scroll-mt-20 overflow-hidden sm:min-h-[500px] lg:min-h-[540px]"
      >
        <Image
          src={restaurantImages.hero}
          alt="Warm café interior at Cardamom House"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Improves contrast between the hero text and background image. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/25" />

        <div className="relative z-10 mx-auto flex min-h-[440px] max-w-7xl items-center px-5 py-14 sm:min-h-[500px] sm:px-8 sm:py-16 lg:min-h-[540px] lg:px-12">
          <div className="max-w-2xl animate-hero-enter text-white">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 sm:text-sm sm:tracking-[0.25em]">
              Lisbon · Est. 2021
            </p>

            <h1 className="max-w-xl break-words font-heading text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {restaurant.name}
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-white/90 sm:mt-6 sm:text-lg sm:leading-8">
              {restaurant.tagline}
            </p>

            {/* Displays actual opening hours or the selected URL demo. */}
            <div className="mt-5">
              <OpenStatus hours={restaurant.hours} demoState={demoState} />
            </div>

            {/* Displays an additional message only in the closed demo. */}
            {demoState === "closed" && (
              <div
                role="status"
                className="mt-4 max-w-lg rounded-xl border border-white/25 bg-black/35 p-4 backdrop-blur-sm"
              >
                <p className="font-semibold text-white">
                  We&apos;re closed today
                </p>
                <p className="mt-1 text-sm leading-6 text-white/85">
                  Thanks for stopping by. We&apos;ll welcome you back when we
                  reopen.
                </p>
              </div>
            )}

            <address className="mt-5 flex max-w-md items-start gap-2 text-sm not-italic leading-6 text-white/85 sm:mt-6">
              <RiMapPin2Line
                size={19}
                className="mt-0.5 shrink-0 text-amber-200"
                aria-hidden="true"
              />
              <span>{restaurant.address}</span>
            </address>

            <a
              href={`tel:${restaurant.phone.replace(/\s/g, "")}`}
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white underline decoration-white/50 underline-offset-4 transition hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <RiPhoneLine size={17} aria-hidden="true" />
              {restaurant.phone}
            </a>

            <p className="mt-1 flex items-center gap-2 text-sm text-white/85">
              <RiInstagramLine size={17} aria-hidden="true" />
              {restaurant.instagram}
            </p>

            <a
              href="#menu"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-amber-100 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Explore the menu
              <RiArrowDownLine size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 py-9 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        {/* Today's featured dish */}
        {specialItem && (
          <section
            id="special"
            aria-labelledby="special-heading"
            className={`animate-feature-enter scroll-mt-24 overflow-hidden rounded-2xl border border-sand bg-surface shadow-sm md:grid md:grid-cols-[0.9fr_1.1fr] lg:rounded-3xl ${
              specialIsSoldOut ? "opacity-90" : ""
            }`}
          >
            <div className="relative aspect-[5/3] min-w-0 overflow-hidden bg-sand md:aspect-auto md:min-h-[300px] lg:min-h-[340px]">
              <Image
                src={
                  menuItemImages[specialItem.id] ??
                  restaurantImages.saffronFrenchToast
                }
                alt={specialItem.name}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 45vw, 40vw"
                className={`object-cover transition-transform duration-500 ${
                  specialIsSoldOut
                    ? "grayscale opacity-60"
                    : "hover:scale-[1.03]"
                }`}
              />
            </div>

            <div className="flex min-w-0 flex-col justify-center p-5 sm:p-7 md:p-8 lg:p-10">
              <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand sm:text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Today&apos;s special
                {specialIsSoldOut && (
                  <span className="rounded-full bg-sand px-2.5 py-1 text-[10px] font-semibold tracking-normal text-espresso ring-1 ring-inset ring-sand sm:text-xs">
                    Sold out
                  </span>
                )}
              </p>

              <div className="mt-3 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <h2
                  id="special-heading"
                  className="min-w-0 flex-1 font-heading text-2xl font-medium leading-tight sm:text-3xl lg:text-4xl"
                >
                  {specialItem.name}
                </h2>

                {!specialIsSoldOut && (
                  <p className="shrink-0 whitespace-nowrap pt-1 text-base font-semibold tabular-nums text-brand sm:text-lg">
                    €{specialItem.price.toFixed(2)}
                  </p>
                )}
              </div>

              <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:mt-4 sm:text-base sm:leading-7">
                {specialIsSoldOut
                  ? "Today's special has sold out. We're sorry we missed you on this one, but there are plenty of other brunch favourites to discover."
                  : today_special.blurb}
              </p>

              {!specialIsSoldOut && specialItem.description && (
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                  {specialItem.description}
                </p>
              )}

              {!specialIsSoldOut && specialItem.tags.length > 0 && (
                <ul
                  aria-label={`Dietary information for ${specialItem.name}`}
                  className="mt-4 flex flex-wrap gap-2"
                >
                  {specialItem.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-cream px-3 py-1.5 text-xs font-medium text-spice"
                    >
                      {getTagLabel(tag)}
                    </li>
                  ))}
                </ul>
              )}

              <a
                href="#menu"
                className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-brand transition hover:text-spice"
              >
                {specialIsSoldOut ? "Explore other dishes" : "View full menu"}
                <RiArrowRightLine size={18} aria-hidden="true" />
              </a>
            </div>
          </section>
        )}

        {/* Passes the displayed menu data to the menu component. */}
        <MenuSection categories={displayCategories} />

        {/* Opening hours and contact details */}
        <section
          id="visit"
          aria-labelledby="visit-heading"
          className="mt-14 scroll-mt-24 border-t border-sand pt-10 sm:mt-20 sm:pt-16"
        >
          <div className="mb-8 text-center sm:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand sm:text-sm">
              Your table is waiting
            </p>

            <h2
              id="visit-heading"
              className="mt-3 font-heading text-3xl font-medium sm:text-4xl"
            >
              Come Say Hello
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted sm:text-base">
              Stop by for a relaxed brunch, a good cup of coffee, and a little
              taste of Lisbon.
            </p>
          </div>

          {/* Displays the weekly opening hours. */}
          <div className="mx-auto w-full max-w-7xl">
            <HoursBlock hours={restaurant.hours} />
          </div>

          <div className="mx-auto mt-8 max-w-xl px-4 sm:px-0">
            <div className="rounded-2xl border border-sand bg-surface p-5 sm:p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
                <RiMapPin2Line
                  size={21}
                  className="text-brand"
                  aria-hidden="true"
                />
                Find Us
              </h3>

              <address className="mt-4 flex items-start gap-2 text-sm not-italic leading-6 text-muted">
                <RiMapPin2Line
                  size={17}
                  className="mt-0.5 shrink-0 text-brand"
                  aria-hidden="true"
                />
                <span>{restaurant.address}</span>
              </address>

              <a
                href={`tel:${restaurant.phone.replace(/\s/g, "")}`}
                className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-muted underline decoration-sand underline-offset-4 transition hover:text-brand"
              >
                <RiPhoneLine size={17} aria-hidden="true" />
                {restaurant.phone}
              </a>

              <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                <RiInstagramLine
                  size={17}
                  className="text-brand"
                  aria-hidden="true"
                />
                {restaurant.instagram}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href={`tel:${restaurant.phone.replace(/\s/g, "")}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-spice focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              <RiCalendarCheckLine size={18} aria-hidden="true" />
              Get in touch
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-sand bg-surface px-5 py-7 text-center text-sm text-muted">
        <p className="font-heading text-lg font-semibold text-espresso">
          {restaurant.name}
        </p>

        <p className="mt-1">{restaurant.tagline}</p>

        <p className="mt-4">
          © {new Date().getFullYear()} {restaurant.name}. Made with care in
          Lisbon.
        </p>
      </footer>
    </main>
  );
}
