# About Back Glass Button Design

## Goal

Replace the red About-panel Back control with a restrained glass-style button positioned directly below the About information card and aligned to the card's right edge.

## Interaction

- The existing `About Us` hero navigation item opens the About panel.
- While the panel is open, the original hero navigation item is hidden with the other hero navigation items.
- A dedicated `Back` button appears below the information card.
- Selecting `Back` closes the panel and restores the original hero navigation and hero content.

## Structure

- Add `.hero__about-back` inside `.hero__about-panel`, immediately after `.hero__about-inner`.
- Keep the current About panel toggle function as the single source of open/closed state.
- Bind the new Back button to the same toggle function.
- Stop changing the original `About Us` label to `Back`.

## Visual Design

- Right-align the button beneath the card with a 12px vertical gap.
- Use a translucent dark background, backdrop blur, subtle white border, soft shadow, and white uppercase text.
- Use a compact rounded shape that visually belongs to the existing glass interface.
- On hover and keyboard focus, slightly brighten the background and border without introducing the red accent.

## Responsive Scope

- Apply the dedicated Back control on desktop widths where the About panel is displayed.
- Preserve the current mobile behavior, where the About panel is hidden below 1024px.

## Verification

- Opening About shows one glass Back button below and right-aligned with the card.
- The button does not overlap the card or viewport edge at desktop widths.
- No red background remains on the Back control.
- Back closes the panel and restores the hero navigation.
- The GitHub Pages preview loads the new CSS cache version.
