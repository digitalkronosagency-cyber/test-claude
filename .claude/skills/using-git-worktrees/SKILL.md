# using-git-worktrees

Create isolated workspaces using git worktrees for parallel or isolated development.

## Step 0 — Detect First

Before creating anything, check if you're already in an isolated workspace:
```bash
echo $GIT_DIR
echo $GIT_COMMON
```
If `GIT_DIR != GIT_COMMON` you may already be in a worktree (or submodule — check before assuming).

## Step 1 — Prefer Native Tools

If your platform (Claude Code, etc.) has a native worktree mechanism, use it. **Using `git worktree add` when a native tool exists creates phantom state your harness can't see or manage.**

Only fall back to manual `git worktree add` if no platform-native mechanism exists.

## Step 1b — Directory Priority

1. User-declared preference in instructions
2. Existing project-local directory (`.worktrees/` preferred over `worktrees/`)
3. Legacy global path `~/.config/superpowers/worktrees/`
4. Default: `.worktrees/` at project root

## Safety Check Before Creating

Verify the worktree directory is git-ignored:
```bash
git check-ignore -v .worktrees/
```
If not ignored: add to `.gitignore` and commit before creating the worktree. Prevents accidentally committing worktree contents.

## Step 4 — Validate Readiness

After creating the worktree, run project tests to establish a clean baseline before starting implementation.

## Core Rule

"Never fight the harness" — work with existing platform isolation and native tooling, not against it.
