# GitHub Actions CI/CD Setup

This repository uses two workflows:

- `CI` (`.github/workflows/ci.yml`)
  - Runs `npm test` on every `pull_request`.
  - Runs `npm test` on every `push`.
- `Deploy to GitHub Pages` (`.github/workflows/deploy-pages.yml`)
  - Triggers from `workflow_run` after `CI` completes.
  - Deploys only when all conditions are true:
    - CI conclusion is `success`.
    - Source event was `push`.
    - Source branch was `main`.

## One-time repository setup

1. Open `Settings -> Pages`.
2. In `Build and deployment`, set `Source` to `GitHub Actions`.
3. Open `Settings -> Actions -> General`.
4. Ensure actions are enabled for this repository.
5. Ensure `Workflow permissions` is not blocked by org/repo policy from granting workflow-declared permissions.

## Branch and trigger expectations

- `main` is the deployment branch.
- Pull requests run CI only.
- Deploy runs only after a successful CI run that came from a push to `main`.
- A successful CI run on non-`main` branches will not deploy.

## Required workflow permissions

The deploy workflow already declares the minimum required token permissions:

- `contents: read`
- `pages: write`
- `id-token: write`

No additional personal access token is required.

## Secrets baseline

- No repository or environment secrets are required for this CI/CD flow.
- Deployment uses the built-in `GITHUB_TOKEN` plus workflow permissions above.

## How to validate CI and deploy

1. Open a pull request:
   - Confirm `CI` runs and passes in the Actions tab.
   - Confirm no deploy run occurs from that PR event.
2. Merge or push the same change to `main`:
   - Confirm a `CI` run for the `push` event succeeds.
   - Confirm `Deploy to GitHub Pages` starts from `workflow_run`.
3. Open `Settings -> Pages` and confirm the published URL is updated.
4. Open the site URL and verify expected content loads.

## Troubleshooting

- `Deploy to GitHub Pages` never starts:
  - Check that CI run was triggered by `push` (not `pull_request`) and branch is `main`.
  - Check deploy workflow condition in logs (`head_branch == 'main'`).
- Deploy fails with Pages permission errors:
  - Confirm Pages source is `GitHub Actions`.
  - Confirm org/repo policy does not block `pages: write` and `id-token: write`.
- CI fails on install/test:
  - Reproduce locally with `npm ci && npm test`.
  - Fix test or dependency issues before expecting deploy.
- Site deploys but content looks stale:
  - Verify latest `Deploy to GitHub Pages` run succeeded.
  - Refresh browser cache or hard-reload.
  - Confirm expected files are copied into `_site` by the deploy workflow.
- Optional assets not present (`CNAME`, `favicon.ico`):
  - This is non-fatal. The workflow copies these only when files exist.
