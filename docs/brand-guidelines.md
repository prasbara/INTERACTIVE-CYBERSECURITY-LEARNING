# IDS Learning Lab — Brand Guidelines & Design System

## 1. Brand Concept & Philosophy

**IDS Learning Lab** is an interactive educational cybersecurity workstation built on the **LAPS–Heuristik** pedagogical model (Logan Avenue Problem Solving). It trains students of SMK TJKT (Teknik Jaringan Komputer dan Telekomunikasi) to detect threats, correlate raw log evidence, formulate hypotheses, triage alerts, and execute defensible incident response decisions.

### Core Brand Pillars
* **Intrusion Detection (IDS)**: Continuous sensor monitoring, telemetry stream analysis, and signature vs. anomaly recognition.
* **Empirical Investigation**: Reasoning rooted exclusively in objective log evidence (timestamp, source IP, payload, byte frequency).
* **Cognitive Scaffolding (LAPS–Heuristik)**:
  1. *Understand*: Grasp sensor behavior & raw data anomalies.
  2. *Plan*: Design detection rules, topology, and mitigation trade-offs.
  3. *Execute*: Triage multi-source telemetry in SOC conditions.
  4. *Review*: Verify hypotheses with incident CTF flags and metacognitive reflection.
* **Professional Technical Demeanor**: Clean, intelligent, editorial, and trustworthy—free from superficial hacker tropes, neon glows, or juvenile gamification.

---

## 2. Logo Mark Anatomy & Geometry

The **IDS Learning Lab** logo mark is an abstract geometric detection lens that rejects literal padlocks, cartoon shields, and bug icons.

```
       /\
      /  \        Outer Perimeter: Precision Rhombus-Hexagon
     /    \       (Security perimeter & network node monitoring)
    |  /\  |
    | /  \ |      Internal Coordinate Axes (Crosshairs):
    | \  / |      4 Quadrants corresponding to LAPS-Heuristik stages
     \    /
      \  /        Center Focal Dot (Security Green #007a5a):
       \/         The empirical evidence point at the center of inquiry
```

### Visual Components
1. **Outer Rhombus-Hexagon Perimeter**: Represents the network boundary, sensor monitoring zone, and defensive perimeter.
2. **Quadrant Coordinate Crosshairs**: 4 orthogonal axis lines defining the analytical coordinate system of the LAPS-Heuristik methodology:
   * North: *Understand Problem*
   * East: *Plan Solution*
   * South: *Execute Strategy*
   * West: *Review & Metacognition*
3. **Evidence Focal Core**: Concentric focal node filled with Security Green (`#007a5a`) and center focal dot, symbolizing the validated ground-truth fact uncovered by the analyst.

---

## 3. Logo Lockup Variants

All logo assets are available as scalable vector SVGs in `public/assets/brand/` and high-density PNGs.

| Asset File | Lockup Type | Composition | Intended Context |
| :--- | :--- | :--- | :--- |
| `logo.svg` | **Primary Lockup** | Mark + "IDS Learning Lab" + Subtitle | Landing page hero, desktop navigation, main documentation |
| `logo-dark.svg` | **Dark / Reverse** | White & Lavender Mark + White Typography | Dark surfaces, SOC command center mode, dark headers |
| `logo-light.svg` | **Light High-Contrast** | Deep Purple Mark + Deep Purple Typography | Crisp editorial documents, PDF exports, white papers |
| `logo-mark.svg` | **Symbol Only** | Hex-rhombus detection lens only | Favicon, app launcher icon, avatar, compact navbar |
| `logo-mark-dark.svg` | **Symbol (Dark)** | High-contrast reverse mark | Dark theme sidebar icon, mobile avatar, SOC header |
| `favicon.svg` | **Favicon** | Optimized 32×32 vector symbol | Browser tab icon, PWA shortcut |
| `logo.png` / `@2x.png` | **Raster Export** | High-DPI transparent bitmap | Native integrations, OpenGraph sharing, embeds |
| `logo-mark.png` / `@2x.png`| **Raster Mark** | High-DPI transparent mark | Apple touch icon, app manifests, PWA icons |

---

## 4. Typography System

The platform strictly uses **Inter** for all UI and brand wordmarks, supplemented by **JetBrains Mono** for technical telemetry and code artifacts.

* **Primary Sans**: `Inter, system-ui, -apple-system, sans-serif`
  * Wordmark Title: `font-weight: 700`, `letter-spacing: -0.02em`
  * Subtitle / Badge: `font-weight: 600`, `letter-spacing: 0.08em`, `text-transform: uppercase`
* **Monospace**: `JetBrains Mono, monospace`
  * Technical telemetry, Snort/Suricata rules, shell logs, IP:port combinations.

---

## 5. Color Palette & Token Hierarchy

```
Primary: Deep Purple       #1c061e  (Dominant header, primary text, brand perimeter)
Secondary: Purple          #4a154b  (Coordinate axes, interactive borders, subheadings)
Accent: Security Green     #007a5a  (Evidence focal core, valid states, verified flags)
Accent Light: Green Soft   #34d399  (Dark mode evidence focal point, high contrast)
Background: Warm Neutral   #f4ede4  (Editorial canvas, card backgrounds)
Pure White: Surface Base   #ffffff  (Light card panels, crisp contrast)
Border Gray:               #e5e7eb  (Technical borders, minimal dividers)
```

### Color Contrast Compliance
* Deep Purple (`#1c061e`) on Warm Neutral (`#f4ede4`): Contrast ratio > 14:1 (Passes WCAG AAA).
* Security Green (`#007a5a`) on White (`#ffffff`): Contrast ratio > 4.8:1 (Passes WCAG AA).
* White (`#ffffff`) on Deep Purple (`#1c061e`): Contrast ratio > 16:1 (Passes WCAG AAA).

---

## 6. Sizing, Spacing & Clear Space

### Minimum Sizes
* **Primary Lockup**:
  * Minimum width: `160px`
  * Minimum mark height: `22px`
* **Compact Lockup**:
  * Minimum width: `80px`
  * Minimum mark height: `20px`
* **Symbol Only**:
  * Favicon: `16×16px`, `32×32px`, `48×48px`
  * UI Mark: `20×20px`

### Clear Space Rule
Maintain clear space around the logo equal to at least half the width of the logo mark ($X/2$ where $X$ is the mark dimension). No text, buttons, or graphic elements may encroach within this zone.

---

## 7. Reusable Brand Components

### JavaScript Component: `BrandLogo`
Located at `src/components/BrandLogo.js`.

```javascript
import { createBrandLogo } from './components/BrandLogo.js';

// Primary lockup for headers
const headerLogo = createBrandLogo({
  variant: 'primary', // 'primary' | 'compact' | 'mark' | 'light' | 'dark'
  size: 'md',        // 'sm' (22px) | 'md' (30px) | 'lg' (40px) | 'xl' (52px)
  href: '/dashboard'
});
```

### Icon Component: `Icon`
Located at `src/components/Icon.js` and `src/utils/icons.js`.

```javascript
import { createIcon } from './components/Icon.js';

// Vector Lucide-style icon
const searchBtn = createIcon({
  name: 'search',
  size: 18,
  ariaLabel: 'Cari Kasus'
});
```

---

## 8. Interface Iconography Rules

* **Zero Emojis Policy**: Emojis (e.g., 🔍, ⚙️, 📊, 📚, 🏆, 🔥, ⚠️, ✅, ❌, 🔒, 🛡️, 🚀, 💡, 🎯) are **strictly forbidden** as interface icons, buttons, or status badges.
* **Unified Geometry**: All icons adhere to a 24×24 grid, 1.8–2px stroke width, rounded stroke caps and joints, and `fill="none"`.
* **Semantic Reinforcement**:
  * *Search / Investigation*: `search`
  * *Target / Objective*: `target`
  * *Evidence File*: `fileText`
  * *Network Architecture*: `network` / `server` / `database`
  * *Detection Sensor*: `radar` / `shield`
  * *Completed State*: `check` / `checkCircle`
  * *Error / Rejection*: `x` / `xCircle`
  * *Investigation Hint*: `helpCircle` / `unlock`

---

## 9. Prohibited Usages (Anti-Patterns)

1. **Do not stretch or distort** the mark aspect ratio.
2. **Do not apply drop shadows, 3D extrusions, or bevels**.
3. **Do not apply neon glows or cyberpunk chromatic aberration**.
4. **Do not replace the vector mark with clip art, hacker silhouettes, or padlocks**.
5. **Do not use low-contrast color combinations** (e.g., deep purple text on dark gray surfaces).
6. **Do not insert emojis into button text, headers, or gamification badge items**.
