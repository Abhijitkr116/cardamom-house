"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RiCloseLine, RiMenu3Line, RiArrowRightUpLine } from "@remixicon/react";

/**
 * Render a responsive navigation bar with an animated mobile menu.
 */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Special", href: "#special" },
    { label: "Menu", href: "#menu" },
    { label: "Visit Us", href: "#visit" },
  ];

  /**
   * Toggle the mobile navigation menu open or closed.
   */
  function handleMenuToggle() {
    setIsMenuOpen((isOpen) => !isOpen);
  }

  /**
   * Close the mobile menu after a visitor selects a navigation link.
   */
  function handleNavClick() {
    setIsMenuOpen(false);
  }

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 border-b border-sand bg-cream/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
        <a
          href="#home"
          onClick={handleNavClick}
          className="relative z-20 font-heading text-xl font-semibold text-espresso transition-colors hover:text-brand"
        >
          Cardamom House
        </a>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-brand"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile and tablet menu button */}
        <button
          type="button"
          onClick={handleMenuToggle}
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          className="relative z-20 inline-flex size-11 items-center justify-center rounded-full border border-sand text-espresso transition-colors hover:bg-sand/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:hidden"
        >
          {isMenuOpen ? (
            <RiCloseLine size={23} aria-hidden="true" />
          ) : (
            <RiMenu3Line size={23} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Animated mobile navigation panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="absolute inset-x-0 top-full border-b border-sand bg-cream px-5 pb-5 pt-2 shadow-lg lg:hidden"
          >
            <div className="mx-auto max-w-7xl">
              {navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="flex items-center justify-between border-b border-sand/80 py-4 text-base font-medium text-espresso transition-colors last:border-b-0 hover:text-brand"
                >
                  {link.label}
                  <RiArrowRightUpLine
                    size={18}
                    aria-hidden="true"
                    className="text-brand"
                  />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
