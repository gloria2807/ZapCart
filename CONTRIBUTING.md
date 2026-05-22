# Contributing to ZapCart

Thank you for your interest in contributing to ZapCart.

ZapCart is built to simplify commerce for small businesses and everyday traders by combining Bitcoin Lightning payments with lightweight merchant tools. Every contribution helps improve accessibility, usability, and financial tools for merchants operating in low-tech environments.

This document provides guidelines and information for contributors.

---

# Table of Contents

* Getting Started
* Contribution Workflow
* Development Setup
* Project Structure
* Coding Standards
* Pull Request Process
* Issue Reporting
* Feature Requests
* Documentation
* Testing
* Areas for Contribution
* Getting Help
* License
---

# Getting Started

## Prerequisites

Before contributing, ensure you have:

* Node.js 18+
* npm or pnpm
* Git installed
* A GitHub account
* Basic knowledge of:

  * React
  * TypeScript
  * State management concepts
  * Bitcoin Lightning fundamentals (helpful but not required)

---

# Contribution Workflow

To avoid duplicate work and maintain smooth collaboration, please follow this workflow before contributing.

---

## 1. Choose or Create an Issue

### Option A: Pick an Existing Issue

* Browse the repository issues
* Look for:

  * `good-first-issue`
  * `help-wanted`
* Read the issue description carefully
* Check whether someone is already assigned

### Option B: Create a New Issue

If your bug or feature idea does not already exist:

* Open a new issue
* Clearly explain the problem or proposal
* Wait for maintainer feedback before starting work

---

## 2. Request Assignment

Before writing code:

Comment on the issue expressing your interest.

Example:

```txt id="k2h0vg"
Hi! I'd like to work on this issue. Could you please assign it to me?
```

Wait until a maintainer assigns the issue before beginning implementation.

This helps prevent multiple contributors from working on the same task simultaneously.

---

## 3. Start Working

Once assigned:

1. Fork the repository
2. Create a feature branch
3. Begin implementation
4. Keep the issue updated with progress if necessary

---

## 4. Activity Expectations

If an issue is assigned to you:

* Please remain reasonably active
* Communicate if you become stuck
* Notify maintainers if you need additional time

Inactive assignments may eventually be reassigned to keep progress moving.

---

## 5. Submit Your Pull Request

When your work is complete:

* Push your branch
* Open a pull request
* Link the related issue
* Respond to feedback and requested changes

---

# What Not To Do

* Do not submit pull requests without a related issue
* Do not work on issues assigned to others without discussion
* Do not begin large features without approval
* Do not disappear for long periods without communication

---

# Development Setup

## Fork and Clone the Repository

```bash id="50b4ju"
git clone https://github.com/your-org/zapcart.git

cd zapcart
```

---

## Add Upstream Remote

```bash id="xqf9uh"
git remote add upstream https://github.com/your-org/zapcart.git
```

---

## Install Dependencies

```bash id="b6vxll"
npm install
```

---

## Configure Environment Variables

Create a `.env.local` file:

```env id="6rtjlwm"
NEXT_PUBLIC_APP_URL=http://localhost:3000

BREEZ_API_KEY=your_breez_api_key
```

---

## Start Development Server

```bash id="ypv6je"
npm run dev
```

---

# Project Structure

```bash id="t9xk2d"
src/
├── components/
├── constants/
├── contexts/
├── features/
├── hooks/
├── pages/
├── services/
├── store/
├── test/
├── types/
├── utils/
├── App.tsx
├── main.tsx
└── index.css
```

---

# Key Directories

| Directory     | Purpose                         |
| ------------- | ------------------------------- |
| `components/` | Reusable UI components          |
| `pages/`      | Application pages               |
| `services/`   | Business logic and integrations |
| `store/`      | Zustand state management        |
| `hooks/`      | Custom React hooks              |
| `contexts/`   | Shared application contexts     |
| `utils/`      | Helper functions and utilities  |
| `test/`       | Testing utilities and specs     |

---

# Coding Standards

## TypeScript

* Use strict TypeScript typing
* Avoid `any`
* Prefer explicit interfaces and types
* Keep types reusable and organized

### Good Example

```ts id="c65p2t"
interface Product {
  id: string;
  name: string;
  price: number;
}
```

### Avoid

```ts id="mjf1p2"
const product: any = {};
```

---

## React Components

* Use functional components
* Keep components focused and reusable
* Extract complex logic into hooks
* Use proper prop interfaces

### Good Example

```tsx id="pm5ljv"
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

---

## Styling

* Use Tailwind CSS
* Follow mobile-first principles
* Maintain consistent spacing and layout
* Prioritize accessibility and usability

---

## State Management

ZapCart uses Zustand for state management.

Guidelines:

* Keep global state minimal
* Use local component state when appropriate
* Avoid unnecessary store complexity
* Keep updates predictable and immutable

---

## Error Handling

* Use proper `try/catch` handling
* Provide meaningful user feedback
* Avoid silent failures
* Log important debugging information

### Example

```ts id="svqj8t"
try {
  await createInvoice();
} catch (error) {
  console.error("Invoice creation failed:", error);
}
```

---

# Pull Request Process

## Branching Strategy

Create branches from the latest development branch.

### Example

```bash id="6mjlwm"
git checkout dev
git pull upstream dev

git checkout -b feature/feature-name
```

---

## Before Submitting

Ensure that:

* Your code builds successfully
* Lint checks pass
* New functionality is tested
* Documentation is updated where necessary

---

## Commit Message Format

Use conventional commits.

### Examples

```txt id="qpm3z0"
feat(pos): add barcode scanning support
fix(wallet): resolve payment confirmation issue
docs(readme): update installation instructions
refactor(store): simplify cart state logic
```

### Common Types

* `feat`
* `fix`
* `docs`
* `refactor`
* `test`
* `chore`
* `style`

---

## Submitting a Pull Request

1. Push your branch
2. Open a pull request against `dev`
3. Clearly describe your changes
4. Link related issues
5. Add screenshots if UI changes are included

---

# Pull Request Checklist

* [ ] Code follows project standards
* [ ] Self-review completed
* [ ] Documentation updated
* [ ] No linting issues
* [ ] No unnecessary console logs
* [ ] Changes tested locally

---

# Issue Reporting

Before opening an issue:

* Search existing issues first
* Verify the issue still exists in the latest version
* Gather enough detail for reproduction

---

## Bug Report Template

```md id="08p6c8"
## Describe the Bug

Clear description of the issue.

## Steps to Reproduce

1. Go to ...
2. Click ...
3. Observe ...

## Expected Behavior

Describe what should happen.

## Environment

- OS:
- Browser:
- App Version:

## Additional Context

Add screenshots or logs if necessary.
```

---

# Feature Requests

When suggesting a feature, include:

* The problem being solved
* The proposed solution
* Alternative ideas considered
* Additional context or screenshots

---

# Documentation

Please update documentation whenever relevant.

Examples:

* README updates
* New environment variables
* API changes
* Setup instructions
* Architecture changes

---

# Testing

## Manual Testing

Before submitting changes:

* Test major user flows
* Verify responsive layouts
* Test error handling
* Confirm Lightning payment flows where applicable

---

## Automated Testing

Where appropriate:

* Add unit tests
* Add integration tests
* Maintain type safety
* Verify critical flows

---

# Areas for Contribution

## High Priority

* Bug fixes
* Performance improvements
* Accessibility improvements
* Mobile experience improvements
* Offline support improvements

---

## Medium Priority

* Inventory system enhancements
* Merchant analytics
* UI/UX improvements
* Documentation improvements
* Testing coverage

---

## Low Priority

* Code refactoring
* Dependency updates
* Internal tooling improvements
* Developer experience enhancements

---

# Getting Help

If you need help:

* Open a GitHub issue
* Start a discussion
* Ask questions in pull request discussions

---

# License

By contributing to ZapCart, you agree that your contributions will be licensed under the MIT License.

---

# Thank You

Thank you for contributing to ZapCart.

Your contributions help build simpler, faster, and more accessible commerce tools for small businesses and everyday merchants.
