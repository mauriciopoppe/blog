# Implementation Plan: Language Conversation Starter

## Phase 1: Setup and Basic Structure
- [x] Task: Configure Webpack Entrypoint
    - [x] Create `src/language-conversation-starter/index.ts` to mount the React component.
    - [x] Add `language-conversation-starter` to `webpack.config.common.js` entrypoints.
- [x] Task: Create Hugo Layouts and Partials
    - [x] Create script partial `site/layouts/_partials/scripts/language-conversation-starter.html` following the standard `webpack-script.html` injection pattern.
    - [x] Create Hugo layout `site/layouts/layout-language-conversation-starter.html` that includes the necessary base HTML, an empty root `div` for React, and the new script partial.
- [x] Task: Create Sandbox Content Page
    - [x] Add `site/content/sandbox/language-conversation-starter.md` with frontmatter `layout: layout-language-conversation-starter`.
- [x] Task: Set up React Component skeleton
    - [x] Create `src/language-conversation-starter/components/App.tsx`.

## Phase 2: Data and Core Logic
- [x] Task: Define the data structure
    - [x] Create an array of question objects (with question string, ruby text/furigana mappings, English translation, and example answers) in a `data.ts` file or within the component.
- [x] Task: Implement state management
    - [x] Add `currentIndex` state to track the active card.
    - [x] Add `isFlipped` state to track if the current card is showing the back.
    - [x] Implement shuffling logic to randomize the deck on component mount.

## Phase 3: UI and Interactions
- [x] Task: Build the Card UI
    - [x] Implement the front of the card: render text using `<ruby>` and `<rt>` tags, and the English translation.
    - [x] Implement the back of the card: render a list of example answers.
    - [x] Add full-screen landscape styling using Tailwind CSS, adhering to the site's dark/light theme.
- [x] Task: Implement touch zones and navigation
    - [x] Create three transparent overlay elements for the touch zones: left (25%), center (50%), right (25%).
    - [x] Attach `onClick` and `onTouchEnd` handlers: left navigates to previous card, right navigates to next card, center toggles `isFlipped`.
    - [x] Ensure the card resets to the front (unflipped) state when navigating to a new card.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI and Interactions' (Protocol in workflow.md)
