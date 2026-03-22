# Implementation Plan: Language Conversation Starter

## Phase 1: Setup and Basic Structure
- [ ] Task: Configure Webpack Entrypoint
    - [ ] Create `src/language-conversation-starter/index.ts` to mount the React component.
    - [ ] Add `language-conversation-starter` to `webpack.config.common.js` entrypoints.
- [ ] Task: Create Hugo Layouts and Partials
    - [ ] Create script partial `site/layouts/_partials/scripts/language-conversation-starter.html` following the standard `webpack-script.html` injection pattern.
    - [ ] Create Hugo layout `site/layouts/layout-language-conversation-starter.html` that includes the necessary base HTML, an empty root `div` for React, and the new script partial.
- [ ] Task: Create Sandbox Content Page
    - [ ] Add `site/content/sandbox/language-conversation-starter.md` with frontmatter `layout: layout-language-conversation-starter`.
- [ ] Task: Set up React Component skeleton
    - [ ] Create `src/language-conversation-starter/components/App.tsx`.

## Phase 2: Data and Core Logic
- [ ] Task: Define the data structure
    - [ ] Create an array of question objects (with question string, ruby text/furigana mappings, English translation, and example answers) in a `data.ts` file or within the component.
- [ ] Task: Implement state management
    - [ ] Add `currentIndex` state to track the active card.
    - [ ] Add `isFlipped` state to track if the current card is showing the back.
    - [ ] Implement shuffling logic to randomize the deck on component mount.

## Phase 3: UI and Interactions
- [ ] Task: Build the Card UI
    - [ ] Implement the front of the card: render text using `<ruby>` and `<rt>` tags, and the English translation.
    - [ ] Implement the back of the card: render a list of example answers.
    - [ ] Add full-screen landscape styling using Tailwind CSS, adhering to the site's dark/light theme.
- [ ] Task: Implement touch zones and navigation
    - [ ] Create three transparent overlay elements for the touch zones: left (25%), center (50%), right (25%).
    - [ ] Attach `onClick` and `onTouchEnd` handlers: left navigates to previous card, right navigates to next card, center toggles `isFlipped`.
    - [ ] Ensure the card resets to the front (unflipped) state when navigating to a new card.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI and Interactions' (Protocol in workflow.md)