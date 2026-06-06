# Daily Cleanup: End of Day Workflow

Execute the daily cleanup and sync routine (English version of /aufräumen):

## 1. Repository Status Check
- Check `git status` for uncommitted changes
- List all local branches
- Check if local main is synced with origin

## 2. Branch Cleanup
- List all merged feature branches (local and remote)
- Ask if they should be deleted
- Delete approved branches

## 3. Testing Environment Check
- Check if `testing` branch is synced with `main`
- If not: Ask if sync should happen
- Show last deploy status for testing

## 4. GitHub Actions Status
- List last 5 workflow runs for `deploy.yml`
- List last 5 workflow runs for `deploy-testing.yml`
- Show failed runs if any

## 5. Open Pull Requests
- List all open PRs
- Show status (Approved? Mergeable?)
- Highlight old PRs (>7 days)

## 6. Issues Management
- List issues with "Prio" label
- Show recently closed issues (today)
- Highlight issues without labels

## 7. Dependencies & Security
- Check if `package.json` needs updates (npm outdated)
- Check for security vulnerabilities (npm audit)
- Show warnings if any

## 8. Sync & Push
- Push all local commits
- Fetch latest changes from origin
- Show final status summary

## 9. Testing Deploy
- **IMPORTANT:** Sync `testing` branch with `main`
- Merge main into testing branch
- Push testing branch → Automatic deploy to Testing URL
- Show Testing URL: https://s540d.github.io/Eisenhauer-testing/
- Wait for successful deploy (check GitHub Actions)

## 10. Backup Reminder
- Remind about JSON export if >7 days old
- Show last backup date (from Git history)

## 11. Summary
Create a brief summary:
- Number of deleted branches
- Number of pushed commits
- Environment status (Production + Testing)
- Testing deploy status
- Next TODOs for tomorrow
