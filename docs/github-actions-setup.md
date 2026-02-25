# GitHub Actions CI/CD Setup

This repository uses a lean two-workflow setup:

- `CI` (`.github/workflows/ci.yml`)
  - Runs `npm test` on all pull requests.
  - Runs `npm test` on pushes to `main`.
- `Deploy to GitHub Pages` (`.github/workflows/deploy-pages.yml`)
  - Triggers only after `CI` completes.
  - Deploys only when CI succeeded and the source branch is `main`.

## One-time repository configuration

1. Open repository settings in GitHub.
2. Go to `Settings -> Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Go to `Settings -> Actions -> General`.
5. Ensure workflow permissions allow actions to read repository contents.

## Notes

- Deployment publishes the repository root as a static site artifact.
- Workflow permissions are scoped to minimum required for Pages deployment.
- Deployment concurrency is enabled to avoid overlapping Pages publishes.
