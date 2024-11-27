# Contributing to AI-Powered Data Visualization Platform

First off, thank you for considering contributing to our project! It's people like you that make this platform such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please report unacceptable behavior to [project maintainers].

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible
* Include error messages if any

### Suggesting Enhancements

If you have a suggestion for the project, we'd love to hear it. Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* A clear and descriptive title
* A detailed description of the proposed enhancement
* Specific examples of how this enhancement would be useful
* If possible, list some other applications where this enhancement exists

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/ai-powered-data.git
   cd ai-powered-data
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create your .env file from .env.example
   ```bash
   cp .env.example .env
   ```

4. Set up the development database
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

## Style Guide

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### TypeScript Style Guide

* Use TypeScript for all new code
* Follow the existing code style
* Use interfaces over types where possible
* Use explicit return types for functions
* Use const assertions where applicable
* Avoid any type unless absolutely necessary

### Component Guidelines

* Use functional components with hooks
* Keep components small and focused
* Use TypeScript interfaces for props
* Document complex logic with comments
* Use meaningful variable and function names
* Implement proper error handling
* Add appropriate loading states

## Testing

* Write unit tests for new features
* Update tests when you change existing functionality
* Run the entire test suite before submitting a pull request

```bash
npm run test
```

## Documentation

* Update the README.md with details of changes to the interface
* Update the API documentation for any endpoint changes
* Add JSDoc comments for new functions and types
* Update the changelog following semantic versioning

## Branch Organization

* `main` - stable, production-ready code
* `develop` - development branch, merge your features here
* `feature/*` - new features
* `bugfix/*` - bug fixes
* `hotfix/*` - urgent fixes for production

## Code Review Process

1. Another developer will review your code
2. Address any comments or suggestions
3. Once approved, your PR can be merged
4. Delete your branch after merging

## Community

* Join our [Discord/Slack] channel
* Follow us on [Twitter]
* Read our [Blog]

## Questions?

Feel free to contact the project maintainers if you have any questions. We're here to help!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to make this project better! 🚀
