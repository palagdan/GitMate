# GitMate

GitMate is a conversational AI assistant designed to optimize and streamline GitHub workflows. This project integrates a sophisticated AI bot that automates common tasks within the GitHub ecosystem, enhancing the productivity of the Knowledge-based and Software Systems Group (KBSS). With GitMate, developers can save time and reduce manual effort by automating key GitHub tasks such as issue tracking, pull request management, and code reviews.

## Core Features

---

### 1. **Issue Management**

- **Automated Task Management**: GitMate automates the labeling of new issues based on content analysis. It detects keywords such as "bug" or "enhancement" in the issue description and assigns the corresponding labels automatically, ensuring that issues are categorized properly from the outset.

  Example: If a user reports a problem with the system's functionality, GitMate could automatically label the issue as "bug".

### 2. **Pull Request Management**

- **Automated Review Assistance**: GitMate can assist in automating certain aspects of pull request (PR) management, including providing reviews, identifying merge conflicts, and suggesting changes to improve code quality.

### 3. **Code Review Automation**

- **AI-Driven Code Review**: The bot can provide initial feedback on pull requests by analyzing code changes, highlighting potential issues, and suggesting improvements, helping to expedite the review process.

---

## Usage

### Adding Labels to Issues Automatically

To enable GitMate to automatically label issues when they are opened or edited, use the following GitHub Actions workflow configuration.

```yaml
on:
  issues:
    types: [opened, edited]

jobs:
  add-label-to-issue:
    runs-on: ubuntu-latest
    name: Add label to created issue
    steps:
      - uses: palagdan/GitMate@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          mode: 'issue label'
