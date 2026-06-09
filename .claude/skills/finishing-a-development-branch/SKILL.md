# finishing-a-development-branch

Complete a development branch by verifying tests, detecting environment, presenting options, executing the chosen workflow, and cleaning up.

## 5-Step Process

1. **Verify tests pass** — run the full test suite; stop if failures occur
2. **Detect environment** — normal repo vs. git worktree (managed or external)
3. **Determine base branch** — identify what branch your work came from (main/master)
4. **Present options** — offer exactly the right choices for your environment
5. **Execute & clean up** — perform the action, remove worktree if merge/discard

## Decision Matrix

| Option | Action | Worktree Kept? | Branch Deleted? |
|--------|--------|---------------|-----------------|
| Merge locally | Integrate to base branch | No | Yes |
| Create PR | Push and request review | Yes | No |
| Keep as-is | Preserve everything | Yes | No |
| Discard | Remove all work | No | Yes (forced) |

*Detached HEAD worktrees get 3 options (no local merge).*

## Safety Rules

- Never skip test verification
- "Discard" requires typed confirmation from the user
- Only clean up worktrees you created — check provenance (`.worktrees/`, `worktrees/`, `~/.config/superpowers/worktrees/`)
- Run `git worktree remove` from the **main repository root**, never from inside the worktree
- After removing: run `git worktree prune` for self-healing
