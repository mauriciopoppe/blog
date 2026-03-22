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

## Phase 3: UI and Interactions [checkpoint: 8fa616a]
- [x] Task: Build the Card UI
    - [x] Implement the front of the card: render text using `<ruby>` and `<rt>` tags, and the English translation.
    - [x] Implement the back of the card: render a list of example answers.
    - [x] Add full-screen landscape styling using Tailwind CSS, adhering to the site's dark/light theme.
- [x] Task: Implement touch zones and navigation
    - [x] Create three transparent overlay elements for the touch zones: left (25%), center (50%), right (25%).
    - [x] Attach `onClick` and `onTouchEnd` handlers: left navigates to previous card, right navigates to next card, center toggles `isFlipped`.
    - [x] Ensure the card resets to the front (unflipped) state when navigating to a new card.
- [x] Task: Conductor - User Manual Verification 'Phase 3: UI and Interactions' (Protocol in workflow.md)

## Phase 4: UI Refinements [checkpoint: 0586444]
- [x] Task: Support Furigana in Answers
    - [x] Update the `Card` data structure to support segments (text + rt) in the `answers` array.
    - [x] Update `data.ts` with furigana for existing example answers.
    - [x] Update `App.tsx` to render answer segments using `<ruby>` tags.
- [x] Task: Refine Card Styling
    - [x] Remove the outer "card" wrapper styling (e.g., large padding, aspect ratio, shadow) to make the borders tighter and the content more prominent.
    - [x] Adjust the layout for a more "borderless" full-screen feel.
- [x] Task: Conductor - User Manual Verification 'Phase 4: UI Refinements' (Protocol in workflow.md)

## Phase 5: Content and UI Refinements [checkpoint: 40293c0]
- [x] Task: Remove "Example Answers" Heading
    - [x] Update `App.tsx` to remove the "Example Answers" `h2` heading from the back of the card.
- [x] Task: Expand Practice Answers
    - [x] Update `data.ts` to include more diverse and useful answer examples for the existing questions.
    - [x] Ensure all new answers follow the ruby segment structure for furigana support.
- [x] Task: Conductor - User Manual Verification 'Phase 5: Content and UI Refinements' (Protocol in workflow.md)

## Phase 6: Font Size Refinements [checkpoint: b546643]
- [x] Task: Adjust Front Card Font Size
    - [x] Reduce the font size of the question text in `App.tsx` to ensure it looks balanced and fits well on mobile landscape.
- [x] Task: Adjust Back Card Font Size
    - [x] Reduce the font size of the answer examples in `App.tsx` to ensure at least 3 sentences fit without overflowing on mobile landscape.
- [x] Task: Conductor - User Manual Verification 'Phase 6: Font Size Refinements' (Protocol in workflow.md)

## Phase 7: Answer Spacing and Limit Refinements [checkpoint: 3ea6258]
- [x] Task: Tighten Answer Spacing
    - [x] Update `App.tsx` to reduce the vertical spacing between answer items and between the kanji/furigana text and its English translation.
- [x] Task: Limit and Refine Answers
    - [x] Update `App.tsx` (or `data.ts`) to ensure a maximum of 3 answers are displayed per card.
    - [x] Verify that all 3 answers fit comfortably on the back of the card without overflowing in mobile landscape.
- [x] Task: Conductor - User Manual Verification 'Phase 7: Answer Spacing and Limit Refinements' (Protocol in workflow.md)

## Phase 8: Scrolling and Layout Refinements [checkpoint: 22d54f9]
- [x] Task: Fix Answer Scrolling
    - [x] Update the touch zone overlays in `App.tsx` to ensure they don't block scrolling for the answer content on the back of the card.
- [x] Task: Consolidate Layout Padding/Margins
    - [x] Remove redundant padding/margins from intermediate parent elements in `App.tsx` (specifically the parent of the parent of the `ul` element).
    - [x] Ensure only the top-most parent defines the necessary padding/margins for a clean, consistent layout.
- [x] Task: Conductor - User Manual Verification 'Phase 8: Scrolling and Layout Refinements' (Protocol in workflow.md)

## Phase 9: Content Expansion (from Video) [checkpoint: f13303b]
- [x] Task: Extract Questions from Video
    - [x] Watch/analyze the content of `https://www.youtube.com/watch?v=8nTDWfEXoaM` to identify conversation starter questions.
- [x] Task: Expand the Card Deck
    - [x] Create new card objects for each extracted question, including Japanese text with ruby segments, English translation, and a set of 3-6 relevant practice answers (also with ruby segments).
    - [x] Update `data.ts` with the expanded deck.
- [x] Task: Conductor - User Manual Verification 'Phase 9: Content Expansion (from Video)' (Protocol in workflow.md)

## Phase 10: Final Bulk Content Expansion [checkpoint: 9544229]
- [x] Task: Expand the Card Deck with User List
    - [x] Update `src/language-conversation-starter/data.ts` to include the massive list of new questions provided by the user.
    - [x] For EACH new question, provide 3 diverse and natural Japanese practice answers.
    - [x] Ensure ALL new questions and answers utilize the `RubySegment` structure for full furigana support.
    - [x] Remove any duplicate questions that might have been added in previous phases.
- [x] Task: Conductor - User Manual Verification 'Phase 10: Final Bulk Content Expansion' (Protocol in workflow.md)
