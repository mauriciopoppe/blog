# Project Workflow

## Guiding Principles

1. **The Plan is the Source of Truth:** All work must be tracked in `plan.md`
2. **The Tech Stack is Deliberate:** Changes to the tech stack must be documented in `tech-stack.md` _before_ implementation
3. **Speed over Perfection:** Prioritize working prototypes and fast iteration.
4. **Manual Verification:** Verify changes manually in the browser.
5. **User Experience First:** Every decision should prioritize user experience
6. **Non-Interactive & CI-Aware:** Prefer non-interactive commands. Use `CI=true` for watch-mode tools (tests, linters) to ensure single execution.

## Task Workflow

All tasks follow a high-velocity lifecycle:

### Fast-Track Task Workflow

1. **Select Task:** Choose the next available task from `plan.md`.

2. **Mark In Progress:** Edit `plan.md` and change the task from `[ ]` to `[~]`.

3. **Implement:**
   - Write the minimum amount of code.
   - Focus on functionality.

4. **Document Deviations:** If implementation differs from tech stack:
   - Update `tech-stack.md` with new design
   - Resume implementation

5. **Update Plan:**
   - Read `plan.md`, find the line for the completed task, and update its status from `[~]` to `[x]`.

6. **Commit (Optional):**
   - You may commit changes now or wait until the end of the phase.

### Phase Completion Verification and Checkpointing Protocol

**Trigger:** This protocol is executed immediately after a task is completed that also concludes a phase in `plan.md`.

1.  **Announce Protocol Start:** Inform the user that the phase is complete and the verification and checkpointing protocol has begun.

2.  **Propose a Detailed, Actionable Manual Verification Plan:**
    - **CRITICAL:** To generate the plan, first analyze `product.md`, `product-guidelines.md`, and `plan.md` to determine the user-facing goals of the completed phase.
    - You **must** generate a step-by-step plan that walks the user through the verification process, including any necessary commands and specific, expected outcomes.
    - The plan you present to the user **must** follow this format:

      **For a Frontend Change:**

      ```
      Phase [Phase Name] is complete. For manual verification, please follow these steps:

      **Manual Verification Steps:**
      1.  **Start the development server with the command:** `npm run dev`
      2.  **Open your browser to:** `http://localhost:3000`
      3.  **Confirm that you see:** The new user profile page, with the user's name and email displayed correctly.
      ```

      **For a Backend Change:**

      ```
      Phase [Phase Name] is complete. For manual verification, please follow these steps:

      **Manual Verification Steps:**
      1.  **Ensure the server is running.**
      2.  **Execute the following command in your terminal:** `curl -X POST http://localhost:8080/api/v1/users -d '{"name": "test"}'`
      3.  **Confirm that you receive:** A JSON response with a status of `201 Created`.
      ```

3.  **Await Explicit User Feedback:**
    - After presenting the detailed plan, ask the user for confirmation: "**Does this meet your expectations? Please confirm with yes or provide feedback on what needs to be changed.**"
    - **PAUSE** and await the user's response. Do not proceed without an explicit yes or confirmation.

4.  **Create Checkpoint Commit:**
    - Stage all changes. If no changes occurred in this step, proceed with an empty commit.
    - Perform the commit with a clear and concise message (e.g., `conductor(checkpoint): Checkpoint end of Phase X`).

5.  **Get and Record Phase Checkpoint SHA:**
    - **Step 5.1: Get Commit Hash:** Obtain the hash of the _just-created checkpoint commit_ (`git log -1 --format="%H"`).
    - **Step 5.2: Update Plan:** Read `plan.md`, find the heading for the completed phase, and append the first 7 characters of the commit hash in the format `[checkpoint: <sha>]`.
    - **Step 5.3: Write Plan:** Write the updated content back to `plan.md`.

6.  **Commit Plan Update:**
    - **Action:** Stage the modified `plan.md` file.
    - **Action:** Commit this change with a descriptive message following the format `conductor(plan): Mark phase '<PHASE NAME>' as complete`.

7.  **Announce Completion:** Inform the user that the phase is complete and the checkpoint has been created.

### Quality Gates

Before marking any task complete, verify:

- [ ] Feature works as expected (Manual Verification)
- [ ] Code is reasonably clean and readable
- [ ] No blatant errors in console/logs

### Track Completion Protocol

**Trigger:** This protocol is executed after all tasks in a track's `plan.md` are completed, before updating the status in `conductor/tracks.md`.

1.  **Verify Clean Working Tree:**
    - Run `git status`.
    - **CRITICAL:** If there are any uncommitted changes or untracked files (excluding the track's folder itself if not yet staged), they MUST be committed or stashed before proceeding.
2.  **Suggest Documentation Updates:**
    - Analyze the changes made throughout the track by reviewing `plan.md` and the implemented features.
    - Propose specific updates, additions, or removals in the `docs/` directory to ensure the documentation stays current.
    - **CRITICAL:** Present these suggestions to the user and wait for their approval. Do NOT modify the documentation files until the user explicitly agrees to the proposed changes.
3.  **Update Main Track List:** Change the track status from `[~]` to `[x]` in `conductor/tracks.md`.
4.  **Final Cleanup:** Offer to archive or delete the track folder.

## Development Commands

**AI AGENT INSTRUCTION: This section should be adapted to the project's specific language, framework, and build tools.**

### Setup

```bash
# Install dependencies
npm install
```

### Daily Development

```bash
# Start development build
npm start
```

## Testing Requirements

### Unit Testing

- Every module must have corresponding tests.
- Use appropriate test setup/teardown mechanisms (e.g., fixtures, beforeEach/afterEach).
- Mock external dependencies.
- Test both success and failure cases.

### Integration Testing

- Test complete user flows
- Verify database transactions
- Test authentication and authorization
- Check form submissions

### Mobile Testing

- Test on actual iPhone when possible
- Use Safari developer tools
- Test touch interactions
- Verify responsive layouts
- Check performance on 3G/4G

## Code Review Process

### Self-Review Checklist

Before requesting review:

1. **Functionality**
   - Feature works as specified
   - Edge cases handled
   - Error messages are user-friendly

2. **Code Quality**
   - Follows style guide
   - DRY principle applied
   - Clear variable/function names
   - Appropriate comments

3. **Security**
   - No hardcoded secrets
   - Input validation present
   - SQL injection prevented
   - XSS protection in place

4. **Performance**
   - Database queries optimized
   - Images optimized
   - Caching implemented where needed

5. **Mobile Experience**
   - Touch targets adequate (44x44px)
   - Text readable without zooming
   - Performance acceptable on mobile
   - Interactions feel native

## Commit Guidelines

### Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Maintenance tasks

### Examples

```bash
git commit -m "feat(auth): Add remember me functionality"
git commit -m "fix(posts): Correct excerpt generation for short posts"
git commit -m "test(comments): Add tests for emoji reaction limits"
git commit -m "style(mobile): Improve button touch targets"
```

## Definition of Done

A task is complete when:

1. Code is implemented and functional.
2. Manual verification passed.
3. Implementation notes added to `plan.md`.
4. Task marked as `[x]` in `plan.md`.

## Emergency Procedures

### Critical Bug in Production

1. Create hotfix branch from main
2. Write failing test for bug
3. Implement minimal fix
4. Test thoroughly including mobile
5. Deploy immediately
6. Document in plan.md

### Data Loss

1. Stop all write operations
2. Restore from latest backup
3. Verify data integrity
4. Document incident
5. Update backup procedures

### Security Breach

1. Rotate all secrets immediately
2. Review access logs
3. Patch vulnerability
4. Notify affected users (if any)
5. Document and update security procedures

## Deployment Workflow

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No linting errors
- [ ] Mobile testing complete
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Backup created

### Deployment Steps

1. Merge feature branch to main
2. Tag release with version
3. Push to deployment service
4. Run database migrations
5. Verify deployment
6. Test critical paths
7. Monitor for errors

### Post-Deployment

1. Monitor analytics
2. Check error logs
3. Gather user feedback
4. Plan next iteration

## Continuous Improvement

- Review workflow weekly
- Update based on pain points
- Document lessons learned
- Optimize for user happiness
- Keep things simple and maintainable
