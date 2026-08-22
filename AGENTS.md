# Repository workflow

- `main` is the canonical development branch. Work directly on `main` by default.
- Do not create a feature branch, PR branch, extra worktree, or stash unless the user explicitly requests that isolation or a verified technical blocker requires it.
- If the execution environment starts in a detached or temporary worktree, do not create another branch. Before handoff, audit `git status`, `git branch -avv`, and `git worktree list`, then consolidate verified product changes into local `main` with the user's authorization.
- Never leave a user-approved product change only on a side branch, in a dirty worktree, or in a stash while later tasks resume from an older `main`.
- Treat local commit/merge, remote push, PR merge, production deployment, and cleanup of dirty worktrees or stashes as distinct actions. Report each state accurately and obtain any required authorization.
- Before deleting a branch, worktree, or stash, verify that every intended commit and non-stale change is already reachable from `main`.
