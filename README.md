# NOURIPET — Pet Food Nutrition Marketplace & Booking Engine

> **Tagline:** *Better Nutrition. Happier Pets.*  
> **Product Category:** Pet-Care Marketplace & Real-Time Booking Platform  
> **Version:** 1.0.0 (Production-Quality HTML5 Template)

---

## 🐾 Overview

**NOURIPET** is a premium, commercial-grade HTML5 marketplace and real-time appointment booking engine designed specifically for companion animal nutrition. It connects conscientious pet owners with certified clinical animal nutritionists, holistic diet formulators, and specialty pet food brands.

The platform guides pet owners through a frictionless 7-step conversion journey:
$$\text{Discover} \longrightarrow \text{Choose Service} \longrightarrow \text{Choose Host} \longrightarrow \text{Select Date/Time} \longrightarrow \text{Get Quote} \longrightarrow \text{Pay Deposit} \longrightarrow \text{Booking Confirmed}$$

---

## ✨ Key Features

### 1. Mandatory Navbar & Offcanvas Mobile Drawer
- Fully responsive navigation with desktop dropdown menus:
  - **Marketplace Dropdown:** Browse Services, Pet Food, Nutrition Plans, Featured Hosts, Popular Services.
  - **Nutrition Services Dropdown:** Nutrition Consultation, Personalized Meal Plans, Food Assessment, Allergy & Sensitivity Guidance, Weight Management, Puppy & Kitten Nutrition.
- Single-click **Light/Dark Mode toggle** with persistent `localStorage` and OS preference auto-detection.
- Touch-friendly mobile offcanvas drawer tested from **320px** viewports up to 4K displays.
- Quick **Login**, **Sign Up**, and highlighted primary **Book a Consultation** action button.
- Strictly adheres to product guidelines: **NO Dashboard**, **NO Admin**, **NO Home-2**, **NO Cart shortcuts**.

### 2. Multi-Step Real-Time Booking Engine (`booking.html`)
- **Step 1 — Pet Information:** Pet species (Dog, Cat, Other), name, age, breed, weight, and interactive concern tags (Allergies, Weight loss, Kidney/Renal, Growth, Gut health).
- **Step 2 — Service & Specialist:** Select clinical consultation level, host tier, and modality (Virtual Zoom, In-Clinic, or At-Home).
- **Step 3 — Interactive Calendar:** Real-time monthly calendar (`assets/js/calendar.js`) showing available dates, unavailable dates, today's indicator, and instant time slots (Morning, Afternoon, Evening) with empty-state handling.
- **Step 4 — Review & Contact Details:** Comprehensive summary with guardian contact information and symptom notes.
- **Step 5 — Instant Quote & Escrow Deposit:** Real-time fee computation (base rate + modality + optional add-ons + $5 platform fee), calculating the exact 30% / $25 deposit due today and remaining balance. Includes simulated Card, Apple Pay, and Google Pay checkout with clear demo notices.

### 3. Dynamic Quote Calculator (`quote.html`)
- Independent interactive quote engine (`assets/js/quote.js`) allowing pet parents to toggle duration (30/60/90 mins), modalities, specialist tiers, and diagnostic add-ons (Printed Recipe Book, Gut Microbiome Stool Lab Review, Priority Chat Support).
- Instant itemized invoice calculation without page reloads.

### 4. Verified Host Profile (`host-profile.html`)
- Professional practitioner layout featuring Dr. Maya Carter, M.S., C.P.N.
- Verified credentials, clinical background, language skills, service area, and rating breakdown.
- Itemized service menu cards with direct booking links.
- Interactive **Availability Preview Widget** for Today, Tomorrow, and This Week.

### 5. Service Discovery & Faceted Marketplace (`marketplace.html`)
- Instant keyword search across services, specialties, and host names.
- Multi-faceted sidebar filters: Pet Type (Dog, Cat, Puppy, Senior), Service Category, Modality, Price Range Slider ($50–$150), Availability (Today, Tomorrow, This Week), and Rating (4.5+, 4.8+, 5.0).
- Live client-side sorting: Recommended, Price Low to High, Price High to Low, Earliest Availability, and Rating.

### 6. Booking Confirmation (`booking-confirmation.html`)
- Animated success indicator and unique booking reference code (`#NP-849201`).
- Itemized financial receipt showing deposit paid and remaining balance due at the appointment.
- Simulated calendar invitation download (`.ics` file generation) and print invoice action.

### 7. Evidence-Based Resource Library (`resources.html`)
- Editorial articles: Choosing food, pet food label math (guaranteed analysis & dry-matter carb calculation), puppy calcium-phosphorus ratios, and safe caloric pacing.
- Interactive accordion with common nutrition FAQs.

### 8. Role-Based Authentication (`login.html` & `signup.html`)
- Dynamic signup role switcher toggling input fields between **Pet Owner** and **Host / Nutrition Specialist**.
- Standalone `forgot-password.html` with simulated reset dispatch.

---

## 🎨 Design System & Color Palette

Built using vanilla CSS tokens defined in `assets/css/theme.css`:

| Token | Light Mode Value | Dark Mode Value | Usage |
| :--- | :--- | :--- | :--- |
| **Forest Green** | `#14382C` | `#7C9A84` | Primary brand color, headers, CTAs |
| **Soft Sage** | `#6B8B75` | `#A6CBB3` | Sub-headings, active states, accents |
| **Warm Cream / Surface** | `#FAF8F5` | `#0F1714` | Body background, soft surfaces |
| **Charcoal** | `#18221D` | `#F4F6F4` | Primary body typography |
| **Muted Terracotta** | `#C86D51` | `#D47A60` | Accent badges, sale tags, warning dots |
| **Amber** | `#D9822B` | `#E29D42` | Turnaround badges, rating stars |

### Typography
- **Primary:** `Manrope` (Google Fonts) — clean, modern, accessible sans-serif.
- **Editorial Accent:** `DM Serif Display` (Google Fonts) — editorial warmth for headings.
- **Metadata / Numerical:** `Space Grotesk` (Google Fonts) — prices, badges, and time slots.

---

## 📁 File Structure

```text
Pet-Food-Nutrition-Marketplace-Booking-Engine/
├── index.html                   # Homepage with hero, services, quote preview, customer stories
├── marketplace.html             # Full service marketplace with live faceted filters & sorting
├── service-details.html         # In-depth service page with gallery & sticky booking widget
├── host-profile.html            # Nutritionist profile with availability widget & service menu
├── booking.html                 # 5-step interactive booking engine with calendar & deposit
├── quote.html                   # Standalone instant dynamic pricing quote calculator
├── booking-confirmation.html    # Confirmation screen with receipt & .ics calendar download
├── resources.html               # Editorial pet nutrition library, feeding math & FAQs
├── about.html                   # Mission, platform mechanics, and transparency standards
├── contact.html                 # Contact form with validation & support channels
├── login.html                   # Account sign-in with social login simulation
├── signup.html                  # Dynamic registration for Pet Parents vs Specialists
├── forgot-password.html         # Password recovery form with demo dispatch
├── 404.html                     # Custom branded 404 error page
├── coming-soon.html             # Mobile app announcement & beta notification form
│
├── assets/
│   ├── css/
│   │   ├── theme.css            # CSS variables for Light & Dark mode tokens
│   │   ├── style.css            # Core component styles, cards, badges, navbar, forms
│   │   └── responsive.css       # Mobile (320px–425px), tablet, and desktop breakpoints
│   │
│   ├── js/
│   │   ├── theme.js             # Theme controller (Light/Dark + LocalStorage + OS sync)
│   │   ├── main.js              # Navbar scroll, mobile drawer, GSAP micro-animations
│   │   ├── calendar.js          # Interactive calendar engine with slot generator & empty states
│   │   ├── quote.js             # Dynamic pricing calculation engine & deposit breakdown
│   │   └── booking.js           # Multi-step booking wizard state management & demo checkout
│   │
│   └── images/
│       ├── hero/                # High-resolution editorial photography
│       ├── hosts/               # Specialist portraits
│       └── food/                # Fresh wholesome pet nutrition bowls & spreads
│
└── README.md                    # Technical documentation & project guide
```

---

## 🚀 Getting Started & Local Preview

1. Clone or extract the repository files into your local directory.
2. Launch any static web server (such as Python, Node `http-server`, Live Server, or NGINX):
   ```bash
   # Using Python 3:
   python -m http.server 8080

   # Or using Node:
   npx serve .
   ```
3. Open `http://localhost:8080` in your web browser.

---

## 📱 Responsive Testing Viewports

The template has been validated with **zero horizontal overflow** (`overflow-x: hidden`) across standard screen sizes:
- **Mobile:** 320×568, 360×800, 375×812, 390×844, 414×896, 425×900
- **Tablet:** 768×1024, 800×1280, 1024×1366
- **Desktop:** 1280×720, 1440×900, 1920×1080, and ultra-wide screens

---

## 🛡️ License & Credits
- **Designed for:** NOURIPET Platform
- **Year:** 2026
- **Compliance:** WCAG 2.1 AA Contrast Compliant, Semantic HTML5, Bootstrap 5.3, GSAP 3.12.
