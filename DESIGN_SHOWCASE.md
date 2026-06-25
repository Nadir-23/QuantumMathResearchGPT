# Design Showcase - QuantumMathResearchGPT

## Visual Design Overview

Welcome to the QuantumMathResearchGPT design system! This document showcases the visual design, color palette, and component styling.

## Color Palette

### Primary Colors

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Background: #0a0e27                                         │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│  Deep dark blue - represents the quantum vacuum              │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Foreground: #e0e7ff                                         │
│  ███████████████████████████████████████████████████████     │
│  Light blue-white - high contrast text                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Primary Accent: #00d4ff                                     │
│  ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●   │
│  Vibrant cyan - quantum state representation                │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Secondary Accent: #6366f1                                   │
│  ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆   │
│  Indigo - quantum superposition                              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Supporting Colors

| Name | Hex | Purpose |
|------|-----|---------|
| Card | #141829 | Container backgrounds |
| Card Dark | #0f1219 | Deeper layers |
| Border Light | #334155 | Dividers, borders |
| Muted | #64748b | Secondary text |
| Muted Light | #94a3b8 | Tertiary text |

## Layout Structure

### Desktop Layout (1024px+)

```
┌────────────────────────────────────────────────────────────┐
│ Ψ QuantumMathResearchGPT           ID: 1234567...          │
│ Multi-agent AI for Mathematics, Quantum Physics & Research │
├────────────────────────────────────────────────────────────┤
│                                                              │
│                    [ Welcome Section ]                      │
│                          Ψ                                  │
│                 Explore Quantum & Math                      │
│                                                              │
│        ┌──────────────┐  ┌──────────────┐                 │
│        │ 📐 Math      │  │ ⚛️ Quantum   │                 │
│        └──────────────┘  └──────────────┘                 │
│                                                              │
│        ┌──────────────┐  ┌──────────────┐                 │
│        │ 🔌 Circuits  │  │ 📚 Research  │                 │
│        └──────────────┘  └──────────────┘                 │
│                                                              │
├────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────┐ ┌───┐ │
│  │ Ask about mathematics, quantum physics...     │ │⟶ │ │
│  └────────────────────────────────────────────────┘ └───┘ │
└────────────────────────────────────────────────────────────┘
```

### Mobile Layout (0-639px)

```
┌─────────────────────────┐
│ Ψ QuantumMathResearchGPT│
│ Multi-agent AI for...   │
├─────────────────────────┤
│                         │
│  [ Welcome Section ]    │
│          Ψ              │
│  Explore Quantum & Math │
│                         │
│  ┌──────────────────┐   │
│  │ 📐 Mathematics   │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ ⚛️ Quantum       │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ 🔌 Quantum       │   │
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │ 📚 Research      │   │
│  └──────────────────┘   │
│                         │
├─────────────────────────┤
│ ┌──────────────────────┐│
│ │ Ask about...       ⟶││
│ └──────────────────────┘│
└─────────────────────────┘
```

## Component Showcase

### Message Components

#### User Message (with gradient)

```
┌────────────────────────────────────┐
│ "What is superposition?"           │ ← Right-aligned
└────────────────────────────────────┘
  Background: Gradient (#00d4ff → #6366f1)
  Text Color: #0a0e27
  Glow: Cyan shadow (0, 212, 255, 0.3)
  Border Radius: 12px
  Animation: Fade + Slide from bottom
```

#### Assistant Message (with border)

```
┌────────────────────────────────────┐
│ Superposition is a quantum...      │ ← Left-aligned
└────────────────────────────────────┘
  Background: Card gradient (transparent)
  Border: 2px solid #334155
  Text Color: #e0e7ff
  Glow: Subtle soft shadow
  Border Radius: 12px
```

#### Error Message

```
┌────────────────────────────────────┐
│ Error: Connection timeout          │
└────────────────────────────────────┘
  Background: Red gradient (transparent)
  Border: 2px solid #ef4444
  Text Color: #fee2e2 (light red)
  Glow: Red shadow (239, 68, 68, 0.1)
```

### Button States

#### Primary Button

```
┌──────────────────┐
│  Send Message ⟶  │  ← Normal state
└──────────────────┘
  Background: Gradient (#00d4ff → #6366f1)
  Text: #0a0e27
  Padding: 10px 20px
  Border Radius: 8px
  
┌──────────────────┐
│  Send Message ⟶  │  ← Hover state
└──────────────────┘
  + Glow: 0 0 20px rgba(0, 212, 255, 0.3)
  Shadow: Elevated appearance

┌──────────────────┐
│   ⟳ Sending...   │  ← Loading state
└──────────────────┘
  Opacity: 70%
  Cursor: disabled
  Icon: Spinning loader
```

#### Secondary Button

```
┌──────────────────┐
│   Reset          │  ← Normal state
└──────────────────┘
  Border: 2px solid #334155
  Background: #141829
  Text: #e0e7ff

┌──────────────────┐
│   Reset          │  ← Hover state
└──────────────────┘
  Border: 2px solid #00d4ff (cyan)
  Background: #0f1219 (darker)
```

### Feature Cards (Glass Morphism)

```
┌───────────────────────────┐
│ 📐                         │  ← Card background: transparent with blur
│ Mathematics                │
│ Solve equations &          │
│ simplify expressions       │
└───────────────────────────┘
  Background: Gradient with 60% opacity
  Backdrop: blur(12px)
  Border: 1px solid rgba(51,65,85,0.4)
  Border Radius: 16px
  
  Hover State:
  ┌───────────────────────────┐
  │ 📐 (scales up 110%)        │
  │ Mathematics (cyan color)   │
  │ Solve equations &          │
  │ simplify expressions       │
  └───────────────────────────┘
  Border: Cyan (#00d4ff)
  Glow: 0 0 20px rgba(0, 212, 255, 0.1)
```

### Input Field

```
Normal State:
┌──────────────────────────────────────┐
│ Ask about mathematics...             │
└──────────────────────────────────────┘
  Border: 2px solid #1e293b
  Background: #141829
  Padding: 12px 16px

Focus State:
┌──────────────────────────────────────┐ ← Cyan border
│ Ask about mathematics...             │
└──────────────────────────────────────┘
  ⊕ Cyan ring (30% opacity)
  Border: 2px solid #00d4ff
  Blur: Maintained at 8px
```

### Code Block

```
┌──────────────────────────────────────┐
│ def quantum_circuit():               │  ← Font: JetBrains Mono
│     qc = QuantumCircuit(2)           │  ← Keywords: Cyan (#00d4ff)
│     qc.h(0)                          │
│     qc.cx(0, 1)                      │
│     return qc                        │
└──────────────────────────────────────┘
  Background: Gradient (#0f1219 → #0a0e27)
  Border: 1px solid #334155
  Padding: 16px
  Syntax: Cyan keywords
```

## Typography Showcase

### Heading Hierarchy

```
Ψ QuantumMathResearchGPT              ← H1 (28-32px, 600 weight)
Multi-agent AI for Mathematics        ← Subtitle (14px, 400 weight)

Explore Quantum & Math                ← H2 (24px, 600 weight)

Mathematics                           ← H3 (20px, 600 weight)
Solve equations & simplify            ← Body text (16px, 400 weight)
expressions                           

Updated 2 hours ago                   ← Meta text (12px, 400 weight)
```

### Text Effects

```
Normal Text
"Quantum computing is fascinating"
Color: #e0e7ff, Weight: 400

Highlighted Text (Primary)
"Quantum computing is fascinating"  ← Gradient to cyan
Gradient: #00d4ff

Muted Text
"Last updated 2 hours ago"
Color: #94a3b8, Size: 12px, Weight: 400
```

## Animation Examples

### Message Appearance

```
Timeline: 0ms → 300ms
┌────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  0ms (0% opacity)
│                                    │
│ ███████████████████████████████░░░ │  100ms (50% opacity, 50% slide)
│                                    │
│ ████████████████████████████████ │  200ms (90% opacity, 10% slide)
│                                    │
│ Quantum computing is fascinating   │  300ms (100% opacity, 0% slide)
└────────────────────────────────────┘
```

### Button Hover

```
Normal: Gradient from #00d4ff to #6366f1
Hover: Same gradient + Shadow appears
       Shadow: 0 0 20px rgba(0, 212, 255, 0.3)
       Duration: 200ms
```

### Input Focus

```
Unfocused:
┌─────────────────────────┐
│ Placeholder text        │  Border: #1e293b
└─────────────────────────┘

Focused:
┌─────────────────────────┐ ← Cyan border (2px)
│ Type your query...      │
└─────────────────────────┘
⊕ Cyan glow ring (30% opacity)
```

## Responsive Behavior

### Feature Grid

```
Desktop (1024px+):
┌──────────────┐ ┌──────────────┐
│ 📐 Math      │ │ ⚛️ Quantum   │
└──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐
│ 🔌 Circuits  │ │ 📚 Research  │
└──────────────┘ └──────────────┘

Tablet (640-1023px):
┌──────────────┐ ┌──────────────┐
│ 📐 Math      │ │ ⚛️ Quantum   │
└──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐
│ 🔌 Circuits  │ │ 📚 Research  │
└──────────────┘ └──────────────┘

Mobile (0-639px):
┌──────────────┐
│ 📐 Math      │
└──────────────┘
┌──────────────┐
│ ⚛️ Quantum   │
└──────────────┘
┌──────────────┐
│ 🔌 Circuits  │
└──────────────┘
┌──────────────┐
│ 📚 Research  │
└──────────────┘
```

## Accessibility Features

### Focus Indicators

```
Button (Unfocused):
┌─────────────────────┐
│  Send Message       │
└─────────────────────┘

Button (Focused):
┌─────────────────────┐ ← Cyan border
│  Send Message       │
└─────────────────────┘
⊕ Cyan ring (50% opacity)
```

### Contrast Ratios

```
High Contrast:
Body text (#e0e7ff) on background (#0a0e27)
Ratio: 18:1 ✓ WCAG AAA

Medium Contrast:
Muted text (#94a3b8) on background (#0a0e27)
Ratio: 9:1 ✓ WCAG AA

Disabled:
Disabled button on background
Ratio: 5.5:1 ✓ WCAG AA
```

## Design System Files

### CSS Custom Properties

```css
@theme {
  --color-background: #0a0e27;
  --color-foreground: #e0e7ff;
  --color-primary: #00d4ff;
  --color-secondary: #6366f1;
  --color-card: #141829;
  --color-card-dark: #0f1219;
  --color-border: #1e293b;
  --color-border-light: #334155;
  --color-muted: #64748b;
  --color-muted-light: #94a3b8;
  --radius: 0.875rem;
}
```

### Component Classes

```css
.glass-card          /* Glass morphism container */
.glass-panel         /* Smaller glass panel */
.btn-primary         /* Primary action button */
.btn-secondary       /* Secondary action button */
.btn-tertiary        /* Tertiary action button */
.input-field         /* Standard input */
.text-gradient       /* Gradient text effect */
.glow-primary        /* Cyan glow effect */
.glow-secondary      /* Indigo glow effect */
```

## Summary

The QuantumMathResearchGPT design system features:

✨ **Quantum Aesthetic** - Dark theme with cyan & indigo accents
🎨 **4-Color Palette** - Carefully chosen for harmony & contrast
📱 **Responsive Design** - Optimized for all screen sizes
♿ **WCAG AAA Accessibility** - High contrast & keyboard navigation
🌊 **Glass Morphism** - Modern blur effects with transparency
💫 **Smooth Animations** - 200-500ms transitions
🎯 **Professional Polish** - Consistent spacing & styling

Start using the design system with the component classes in globals.css!
