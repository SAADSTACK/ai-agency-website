# 🎨 Authentication System - Visual Design Guide

## Color Palette

Your authentication system uses Material Design 3 with your brand colors:

### Primary Colors
```
Deep Blue (Primary)
├─ Color: #0041a2
├─ Usage: Buttons, links, highlights
└─ Hover: Slightly lighter shade with glow

Teal (Secondary)
├─ Color: #006b5b
├─ Usage: Accents, decorative elements
└─ With transparency: rgba(0,107,91,...)

Slate Blue (Tertiary)
├─ Color: #274b5f
├─ Usage: Alternative accents
└─ With transparency: rgba(39,75,95,...)
```

### Background & Surface
```
Background
├─ Color: #f8f9fa (Very light gray)
├─ Usage: Page background

Surface Container Lowest
├─ Color: #ffffff (Pure white)
├─ Usage: Form backgrounds, cards

Surface Container High
├─ Color: #e7e8e9 (Light gray)
└─ Usage: Hover states, separators
```

### Status Colors
```
Error/Alert: #ba1a1a (Red)
Success: #4caf50 (Green)
Warning: #ff9800 (Orange)
Info: #2196f3 (Blue)
```

---

## Component Designs

### Login Page

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌──────────────┐         ┌──────────────────────┐ │
│  │ [Logo]       │         │ ┌────────────────┐   │ │
│  │ Node & Nexus │         │ │ Welcome Back   │   │ │
│  │ Ai           │         │ ├────────────────┤   │ │
│  │              │         │ │ Sign in to     │   │ │
│  │ DECORATION   │         │ │ access your    │   │ │
│  │              │         │ │ dashboard      │   │ │
│  │              │         │ ├────────────────┤   │ │
│  │ "Join Our    │         │ │ [Email Input]  │   │ │
│  │  AI          │         │ ├────────────────┤   │ │
│  │  Revolution" │         │ │ [Password]     │   │ │
│  │              │         │ ├────────────────┤   │ │
│  │ ✓ Advanced   │         │ │ [Remember Me]  │   │ │
│  │ ✓ 24/7       │         │ │ [Forgot Pass]  │   │ │
│  │ ✓ Enterprise │         │ ├────────────────┤   │ │
│  │              │         │ │ [Sign In Btn]  │   │ │
│  │              │         │ ├────────────────┤   │ │
│  │              │         │ │ Don't have     │   │ │
│  │              │         │ │ account? [Link]│   │ │
│  │              │         │ └────────────────┘   │ │
│  └──────────────┘         └──────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
    Background: Gradient Primary (Blue → Teal)
    Left: Decorative circles with 10% opacity
    Right: White form panel with shadows
```

### Signup Page (Similar Layout)

```
Same as login but with additional fields:
- Full Name input
- Company input (optional)
- Password strength indicator
- Confirm password
- Terms & conditions checkbox
```

### Dashboard

```
┌─ HEADER (Fixed) ──────────────────────────────────┐
│ [Logo] Node & Nexus │ Nav │ [Search] │ [🔔] [👤] │
└───────────────────────────────────────────────────┘
│                                                   │
│ ┌─ SIDEBAR (Fixed) ┐  ┌─ MAIN CONTENT ─────────┐ │
│ │ Dashboard ✓      │  │                        │ │
│ │ Projects         │  │ Welcome, John! 👋      │ │
│ │ AI Workflows     │  │                        │ │
│ │ Analytics        │  │ ┌────────┐ ┌────────┐ │ │
│ │ Settings         │  │ │ Active │ │ AI     │ │ │
│ │                  │  │ │Projects│ │Workflow│ │ │
│ │                  │  │ │ 7      │ │ 12     │ │ │
│ │                  │  │ └────────┘ └────────┘ │ │
│ │                  │  │                        │ │
│ │                  │  │ Recent Projects:       │ │
│ │                  │  │ ┌────────────────────┐ │ │
│ │                  │  │ │ E-commerce AI      │ │ │
│ │                  │  │ │ Custom chatbot...  │ │ │
│ │                  │  │ │ ↑ 23% usage        │ │ │
│ │                  │  │ └────────────────────┘ │ │
│ └──────────────────┘  └────────────────────────┘ │
│                                                   │
└─────────────────────────────────────────────────┘
```

---

## Typography

### Font Family
- **Headlines**: Manrope (Bold weights: 500, 700, 800)
  - Page titles: 2rem, 800, letter-spacing -0.03em
  - Section headers: 1.5rem, 700
  - Card titles: 1.125rem, 700

- **Body**: Inter (Regular to Bold: 400, 500, 600, 700)
  - Paragraph text: 0.95rem-1rem, 400
  - Input labels: 0.875rem, 600
  - Small text: 0.8rem, 500

### Font Sizes
```
Display: 2.5rem - 4.5rem (Headlines)
Head 1:  2rem                (Page title)
Head 2:  1.5rem              (Section title)
Head 3:  1.25rem             (Card title)
Body:    0.95rem - 1rem      (Text content)
Small:   0.875rem - 0.8rem   (Labels, hints)
Tiny:    0.75rem             (Badges, tags)
```

---

## Spacing System (Rem-based)

```
0.25rem  (4px)  - Tiny gaps
0.5rem   (8px)  - Small spacing
0.75rem  (12px) - Default gap between elements
1rem     (16px) - Standard padding
1.25rem  (20px) - Medium spacing
1.5rem   (24px) - Large spacing
2rem     (32px) - Extra large
2.5rem   (40px) - Section spacing
3rem     (48px) - Large sections
```

---

## Border Radius (Rem-based)

```
0.5rem   (8px)   - Small elements (buttons, inputs)
1rem     (16px)  - Cards, modals
1.5rem   (24px)  - Large cards, panels
2rem     (32px)  - Extra large containers
3rem     (48px)  - Full-page containers
9999px           - Perfect circles (avatars)
```

---

## Shadows & Depth

### Shadow Elevations
```
Shadow SM:  0 1px 3px rgba(0,0,0,0.06)
            → Subtle, hover states
            
Shadow MD:  0 4px 16px rgba(0,0,0,0.08)
            → Cards, default elements
            
Shadow LG:  0 8px 32px rgba(0,0,0,0.10)
            → Modals, important containers
            
Shadow XL:  0 16px 48px rgba(0,0,0,0.12)
            → Full-page overlays
            
Shadow Glow: 0 8px 32px rgba(0,65,162,0.15)
             → Primary action highlights
```

---

## Animations

### Transitions (All use cubic-bezier easing)
```
Fast:  150ms  → Micro interactions (hover, focus)
Base:  250ms  → Standard transitions
Slow:  500ms  → Heavy animations
```

### Common Animations
```
Slide In Up:   300ms ease
               from: opacity 0, translateY(30px)
               to:   opacity 1, translateY(0)

Fade In:       200ms ease
               from: opacity 0
               to:   opacity 1

Scale Up:      250ms ease
               from: scale(0.95)
               to:   scale(1)

Spin:          1s linear infinite (loaders)
```

---

## Form Components

### Input Fields
```
┌─ Input Container ─────────────┐
│ [ICON] ┌──────────────────┐   │
│        │ Placeholder      │   │
│        └──────────────────┘   │
│                               │
│ Normal:  Border #c3c6d6       │
│ Focused: Border #0041a2 + Glow│
│ Error:   Border #ba1a1a       │
└───────────────────────────────┘

Height: 42-44px (44px = 0.875rem padding)
Padding: 0.875rem (left icon 0.75rem offset)
Border radius: 1rem
Font size: 0.95rem
```

### Buttons
```
┌─────────────────────┐
│  [ICON] Button Text │
└─────────────────────┘

Sizes:
├─ Small (SM):  0.5rem padding, 0.875rem text
├─ Medium (MD): 0.75rem padding, 0.95rem text
└─ Large (LG):  1.25rem padding, 1.125rem text

Variants:
├─ Primary:   Gradient bg, white text, glow on hover
├─ Secondary: Light gray bg, blue text
└─ Outline:   White bg, blue border, blue text

States:
├─ Default:  Normal appearance
├─ Hover:    Scale 1.02, stronger shadow
├─ Active:   Scale 0.95 (pressed)
└─ Disabled: Opacity 0.6, no interaction
```

### Checkboxes
```
☐ Unchecked:  Gray border
☑ Checked:    Blue background, white checkmark
⊘ Disabled:   Grayed out

Size: 18x18px
Border radius: 4px
Accent color: var(--primary)
```

---

## Responsive Breakpoints

### Mobile First Approach
```
Mobile:    0px - 480px
  └─ Single column layout
  └─ Large touch targets
  └─ Full-width elements

Tablet:    481px - 767px
  └─ 2-column grid
  └─ Optimized padding
  └─ Flexible layouts

Desktop:   768px - 1024px
  └─ Full layout (sidebar + content)
  └─ Multi-column grids
  └─ Navigation visible

Wide:      1024px+
  └─ Full width content
  └─ Max-width containers
  └─ Enhanced layouts
```

---

## Dark Mode Support (Optional)

When implementing dark mode, swap these colors:

```
Background:         #191c1d (Dark gray)
Surface:            #2e3132 (Darker gray)
On-surface:         #f0f1f2 (Light text)
Outline-variant:    #424654 (Light border)

Shadows:            Use darker rgba values
                    (0,0,0,0.3 instead of 0.1)
```

---

## Gradient Usage

### Primary Gradient (Used on decoration areas)
```
background: linear-gradient(135deg, #0041a2 0%, #006b5b 100%);
Direction:  135deg (top-left to bottom-right)
Colors:     Blue → Teal
```

### Glow Gradient (Subtle backgrounds)
```
background: linear-gradient(135deg, 
  rgba(0,65,162,0.1) 0%, 
  rgba(0,107,91,0.1) 100%);
```

### Text Gradient (Headlines)
```
background: linear-gradient(135deg, #0041a2 0%, #006b5b 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

---

## Icon Usage

### Material Symbols Outlined
- **Weight**: 100-700 (mostly 400-600)
- **Size**: 1rem - 1.75rem depending on context
- **Color**: Inherits from parent (usually --on-surface or --primary)
- **Common icons used:**
  - mail, lock, visibility, person, business
  - dashboard, work, smart_toy, bar_chart, settings
  - check_circle, refresh, menu, notifications, logout

---

## Accessibility Features

✓ Color contrast ratios ≥ 4.5:1 for text
✓ Focus states visible on all interactive elements
✓ Labels associated with inputs
✓ Semantic HTML (forms, buttons, etc.)
✓ ARIA attributes where needed
✓ Keyboard navigation support
✓ Touch-friendly target sizes (min 44x44px)

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Mobile

---

**Design System Version**: 1.0.0
**Last Updated**: March 2026
**Design Framework**: Material Design 3
