- product: Authentication
  boundary: src/features/auth/**
  policies:
    - src/features/auth/APPROVAL_POLICY.md

- product: Database schema
  boundary: drizzle/**
  policies:
    - drizzle/APPROVAL_POLICY.md

- product: API routes
  boundary: src/app/api/**
  policies:
    - Require human review for financial data access, webhooks, and external integrations.

- product: CI/CD
  boundary: .github/**
  policies:
    - .github/APPROVAL_POLICY.md

- product: Financial features
  boundary: src/features/**
  policies:
    - Require human review when transaction, account, budget, or payment logic changes.
