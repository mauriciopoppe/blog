# Overview
Create a new single-page application (SPA) named `language-conversation-starter` in `site/content/sandbox/`. It functions as a flashcard game for practicing conversation questions (e.g., Japanese, French). The app is optimized for full-screen landscape viewing on mobile devices.

# Functional Requirements
- **Card Content:**
  - Front: Displays a question with furigana/annotations (using native HTML `<ruby>` tags) and a smaller English translation below.
  - Back: Displays examples of how the user might answer that question.
- **Interactions (Touch Zones):**
  - Designed mobile-first using both `onClick` and touch events (`onTouchEnd` / `onTap`).
  - Tapping the **left quarter (25%)** of the screen navigates to the previous card.
  - Tapping the **right quarter (25%)** of the screen navigates to the next card.
  - Tapping the **center half (50%)** flips the card between the question (front) and answers (back).
- **Game Logic:**
  - A fixed list of questions and answers is hardcoded directly into the component.
  - The deck of cards must be randomly shuffled when the game initializes.
  - Navigation state (current card index, flipped status) is maintained entirely within component state without updating the browser URL.

# Non-Functional Requirements
- **Platform:** Designed specifically for mobile usage in landscape orientation.
- **Tech Stack:** Implemented using React, TypeScript, and Tailwind CSS.
- **Styling:** Follows the existing site's dark/light theme and overall aesthetic.

# Acceptance Criteria
- [ ] A new page is accessible under the sandbox section (`/sandbox/language-conversation-starter`).
- [ ] The app renders full-screen and is usable in landscape mode on a mobile device.
- [ ] Tapping left (25%), right (25%), and center (50%) performs the correct actions (previous, next, flip).
- [ ] The text properly renders furigana/annotations.
- [ ] The cards are shuffled upon page load.