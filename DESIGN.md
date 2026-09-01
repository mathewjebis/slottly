# Slottly Design System

## Product Identity

Slottly is a modern scheduling and booking management application.

The interface should feel:
- Professional
- Calm
- Modern
- Trustworthy
- Efficient
- Clean without feeling sterile

Avoid generic SaaS styling. The UI should feel like a deliberate product rather than a collection of template components.

## Visual Direction

Use a refined SaaS aesthetic inspired by products such as Linear, Vercel, and modern productivity applications, while maintaining Slottly's own identity.

Prioritize:
- Strong visual hierarchy
- Generous whitespace
- Clear content grouping
- Subtle borders
- Restrained shadows
- Consistent spacing
- Purposeful motion

Avoid:
- Excessive gradients
- Excessive glassmorphism
- Huge decorative elements
- Random rounded cards everywhere
- Overuse of shadows
- Excessive animations
- Generic dashboard card grids

## Layout

Use a responsive layout with clear structural hierarchy.

Desktop:
- Persistent navigation where appropriate
- Main content centered within a comfortable max-width
- Generous horizontal spacing
- Clear separation between navigation, content, and actions

Mobile:
- Content should remain readable and uncluttered
- Navigation should collapse appropriately
- Touch targets must remain comfortable
- Avoid horizontal scrolling

Use whitespace to establish hierarchy rather than relying on borders and cards.

## Typography

Typography should be highly readable and hierarchical.

Use:
- Strong page titles
- Clear section headings
- Comfortable body text
- Smaller muted supporting text

Recommended hierarchy:

- Page title: 28–36px
- Section heading: 20–24px
- Body: 14–16px
- Supporting text: 13–14px

Avoid excessive font-weight changes.

Use one primary font family consistently throughout the application unless a deliberate display font is introduced.

## Color

The color system should communicate trust and clarity.

Use:
- Neutral backgrounds
- High-contrast primary text
- Muted secondary text
- One primary brand/accent color
- Semantic success, warning, and error colors

Do not introduce a new accent color for individual components.

Color should communicate meaning, not decoration.

## Surfaces

Prefer a small number of meaningful surfaces.

Examples:
- Application background
- Navigation surface
- Content surface
- Elevated surface for important interactive elements

Use borders and subtle elevation sparingly.

Cards should group related information, not simply wrap every element.

## Buttons

Buttons should have clear hierarchy.

Primary actions:
- Strong visual emphasis
- Used for the main action of a screen

Secondary actions:
- Lower visual emphasis
- Used for supporting actions

Destructive actions:
- Clearly communicate danger
- Require appropriate confirmation where necessary

Avoid having multiple competing primary buttons in the same visual area.

## Forms

Forms should feel simple and trustworthy.

Requirements:
- Clear labels
- Helpful supporting text when needed
- Visible validation states
- Clear error messages
- Comfortable input spacing
- Strong focus states

Do not rely on placeholder text as the only label.

## Navigation

Navigation should make the current location obvious.

Active navigation items should have:
- Clear visual indication
- Accessible contrast
- Consistent styling

Keep navigation simple and avoid unnecessary menu items.

## Dashboard

The dashboard should prioritize useful information and actions.

Do not automatically create a grid of identical cards.

Instead:
1. Establish the page purpose.
2. Highlight the most important information.
3. Group related information.
4. Provide obvious next actions.
5. Use progressive disclosure for secondary information.

The dashboard should feel operational rather than decorative.

## Authentication

Login, registration, password reset, and forgot-password screens should feel focused.

Prioritize:
- Clear heading
- Short supporting description
- Simple form
- Obvious primary action
- Helpful validation
- Minimal distractions

Authentication screens should not feel like marketing pages.

## Settings

Settings should use clear sections with understandable labels.

Group related settings together.

Prefer:
- Section headings
- Descriptions
- Form controls
- Save actions

Avoid presenting every setting as an isolated card.

## Motion

Motion should communicate state and hierarchy.

Use short, subtle transitions for:
- Hover
- Focus
- Opening/closing UI
- Loading
- Success/error states

Avoid:
- Constant animations
- Large entrance animations
- Distracting movement
- Animation that delays user interaction

Respect `prefers-reduced-motion`.

## Icons

Use one consistent icon family.

Icons should:
- Support meaning
- Align visually with text
- Have accessible labels when interactive
- Not replace important text

Avoid decorative icon overload.

## Accessibility

Accessibility is part of the design system.

Maintain:
- Visible keyboard focus
- Sufficient color contrast
- Comfortable touch targets
- Semantic HTML
- Accessible form labels
- Appropriate ARIA usage
- Keyboard navigation
- Reduced-motion support

Never sacrifice accessibility for visual appearance.

## Responsive Design

Design mobile layouts intentionally rather than simply shrinking desktop layouts.

Pay special attention to:
- Navigation
- Forms
- Tables
- Dashboard content
- Buttons
- Spacing
- Touch targets

The interface should work comfortably from small phones through large desktop displays.

## Design Principle

Every UI decision should answer:

> Does this make Slottly clearer, faster, or easier to use?

If not, remove it.
