# Design System - QuantumMathResearchGPT

## Overview

QuantumMathResearchGPT features a sophisticated dark theme inspired by quantum computing and modern AI interfaces. The design prioritizes clarity, scientific sophistication, and an engaging user experience while maintaining excellent contrast and accessibility.

## Color Palette

The design uses a carefully curated 4-color system representing quantum concepts:

### Primary Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Background** | `#0a0e27` | 10, 14, 39 | Main background, represents deep space/quantum field |
| **Foreground** | `#e0e7ff` | 224, 231, 255 | Primary text, high contrast with background |
| **Primary Accent** | `#00d4ff` | 0, 212, 255 | Cyan - Primary interactive elements, quantum state |
| **Secondary Accent** | `#6366f1` | 99, 102, 241 | Indigo - Secondary interactions, quantum superposition |

### Supporting Colors

| Color | Hex | Purpose |
|-------|-----|---------|
| Card Background | `#141829` | Message containers, panels |
| Card Dark | `#0f1219` | Deeper card layers, nested elements |
| Border Light | `#334155` | Component borders, dividers |
| Muted Text | `#64748b` | Secondary text, helper text |
| Muted Light | `#94a3b8` | Tertiary text, labels |

## Typography

### Font Stack

- **Sans-serif (Body)**: Inter
  - Sizes: 12px - 18px
  - Line height: 1.5 - 1.6
  - Weight: 400 (regular), 500 (medium), 600 (semibold)

- **Monospace (Code)**: JetBrains Mono
  - Used for code blocks, technical content
  - Sizes: 12px - 14px
  - Weight: 400

### Text Hierarchy

```
H1: 28-32px | 600 weight | Large headings
H2: 24px    | 600 weight | Section headings
H3: 20px    | 600 weight | Subsection headings
Body: 16px  | 400 weight | Primary content
Small: 14px | 400 weight | Secondary content
Meta: 12px  | 400 weight | Helper text
```

## Component Styling

### Messages

#### User Message
- Background: Gradient from `#00d4ff` to `#6366f1`
- Text Color: `#0a0e27` (background color)
- Border Radius: 12px (0.875rem)
- Padding: 12px 20px
- Shadow: Cyan glow at 20% opacity
- Alignment: Right-aligned

#### Assistant Message
- Background: Gradient from card to card-dark with transparency
- Border: 2px solid `#334155`
- Text Color: `#e0e7ff`
- Border Radius: 12px
- Padding: 12px 20px
- Shadow: Soft shadow with transparency

#### Error Message
- Background: Gradient from `rgba(239, 68, 68, 0.2)` to `rgba(220, 38, 38, 0.1)`
- Border: 2px solid `rgba(239, 68, 68, 0.5)`
- Text Color: `#fee2e2`
- Shadow: Red glow at 10% opacity

### Buttons

#### Primary Button
- Background: Gradient from `#00d4ff` to `#6366f1`
- Text: `#0a0e27`
- Border Radius: 8px
- Padding: 10px 20px
- Font Weight: 500
- Hover: Cyan shadow glow
- Disabled: 50% opacity

#### Secondary Button
- Border: 2px solid `#334155`
- Background: `#141829` card
- Text: `#e0e7ff`
- Hover: Border changes to primary, background darkens
- Transition: 200ms ease

#### Tertiary Button
- Background: Transparent
- Text: `#64748b` (muted)
- Hover: Text changes to `#e0e7ff`
- No border

### Input Fields

- Background: `#141829`
- Border: 2px solid `#1e293b`
- Text Color: `#e0e7ff`
- Placeholder: `#94a3b8`
- Border Radius: 8px
- Padding: 12px 16px
- Focus: Cyan border with 30% ring opacity
- Min Height: 40px

### Glass Morphism Cards

```css
.glass-card {
  background: linear-gradient(to bottom-right, rgba(20, 24, 41, 0.6), rgba(15, 18, 25, 0.6));
  border: 1px solid rgba(51, 65, 85, 0.4);
  backdrop-filter: blur(12px);
  border-radius: 16px;
}
```

Features:
- Subtle transparency
- Strong blur effect
- Light border
- Smooth hover transition with primary glow

## Layout & Spacing

### Grid System

- **Desktop**: Max-width 1024px (64rem)
- **Tablet**: Full-width with responsive padding
- **Mobile**: Full-width with 16px padding

### Spacing Scale

```
xs: 4px     (0.25rem)
sm: 8px     (0.5rem)
md: 16px    (1rem)
lg: 24px    (1.5rem)
xl: 32px    (2rem)
2xl: 48px   (3rem)
```

### Chat Layout

- Message container: 24px gap between messages
- Chat area: 32px top/bottom padding on desktop, 48px on large screens
- Header: 16px padding
- Input area: 16px padding

## Visual Effects

### Blur Effects

- **Header/Footer**: `backdrop-blur-xl` (32px)
- **Modals**: `backdrop-blur-md` (12px)
- **Subtle backgrounds**: `blur-3xl` in fixed overlays

### Glow Effects

```css
.glow-primary {
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}

.glow-secondary {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
}
```

### Animations

- **Fade In**: 300-500ms, cubic-bezier ease
- **Slide**: Bottom to top, 200ms
- **Scale**: Hover states, 100ms
- **Transition**: Color changes, 200ms

## Responsive Design

### Breakpoints

- **Mobile**: 0px - 639px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px+

### Mobile-First Approach

1. Single column layout
2. Full-width input/buttons
3. Hidden keyboard hints (shown on desktop)
4. Larger touch targets (min 44px)
5. Responsive font sizes

## Accessibility

### Color Contrast

- Primary text on background: 18:1 (WCAG AAA)
- Button text: 15:1+ (WCAG AAA)
- Muted text: 9:1 (WCAG AA)

### Interactive Elements

- Minimum touch target: 44px × 44px
- Focus indicators: Cyan border + ring
- Keyboard navigation fully supported
- Screen reader friendly

### Motion

- Respects `prefers-reduced-motion`
- Animations optional, not essential
- No auto-playing animations

## Code Block Styling

```css
pre {
  background: linear-gradient(to bottom-right, #0f1219, #0a0e27);
  border: 1px solid #334155;
  padding: 16px;
  border-radius: 8px;
}

code {
  color: #00d4ff; /* Cyan for keywords */
  font-family: 'JetBrains Mono', monospace;
}
```

## Dark Mode

All colors are optimized for dark mode. Light mode support can be added by creating inverse color tokens in Tailwind CSS.

## Design Tokens (Tailwind CSS)

The design system is implemented using Tailwind CSS with custom theme configuration:

```js
@theme {
  --color-background: #0a0e27;
  --color-foreground: #e0e7ff;
  --color-primary: #00d4ff;
  --color-secondary: #6366f1;
  --color-border: #1e293b;
  --radius: 0.875rem;
}
```

## Usage Guidelines

### When to Use Each Color

| Color | Use Case |
|-------|----------|
| Primary Cyan | CTA buttons, active states, highlights |
| Secondary Indigo | Secondary actions, hover states |
| Muted | Disabled states, helper text |
| Card Dark | Layering, depth |
| Border Light | Dividers, outlines |

### Contrast Checklist

- [ ] Body text on background: Light color on dark
- [ ] Interactive elements: Use primary accent
- [ ] Disabled states: Reduced opacity
- [ ] Hover states: Glow effect or color shift
- [ ] Focus indicators: Ring + border

## Future Enhancements

1. Light mode support
2. High contrast mode
3. Custom theme switcher
4. Animation preferences
5. Font size adjustment controls
