/* ==========================================================================
   NOURIPET — THEME CONTROLLER
   Light & Dark Mode with LocalStorage and System Detection
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'nouripet_theme';
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';

  function getSystemPreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? THEME_DARK
      : THEME_LIGHT;
  }

  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    
    // Update theme toggle buttons across the page
    const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
    toggleButtons.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === THEME_DARK) {
          icon.className = 'bi bi-sun-fill text-warning';
          btn.setAttribute('aria-label', 'Switch to light mode');
          btn.setAttribute('title', 'Switch to light mode');
        } else {
          icon.className = 'bi bi-moon-stars-fill';
          btn.setAttribute('aria-label', 'Switch to dark mode');
          btn.setAttribute('title', 'Switch to dark mode');
        }
      }
    });

    // Dispatch event
    window.dispatchEvent(new CustomEvent('nouripetThemeChanged', { detail: { theme } }));
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
    const nextTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  }

  // Initialize immediately before render to avoid flash
  const initialTheme = getStoredTheme() || getSystemPreference();
  applyTheme(initialTheme);

  // Bind to DOM when loaded
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getStoredTheme() || getSystemPreference());

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    });

    // Listen to OS theme changes if user has no stored override
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!getStoredTheme()) {
          applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
        }
      });
    }
  });

  // Expose globally
  window.NouriTheme = {
    getTheme: () => document.documentElement.getAttribute('data-theme'),
    setTheme: (t) => {
      localStorage.setItem(STORAGE_KEY, t);
      applyTheme(t);
    },
    toggle: toggleTheme
  };
})();
