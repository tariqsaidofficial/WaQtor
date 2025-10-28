# Contributing to Waqtor

First off, thank you for considering contributing to Waqtor! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details** (Node version, OS, etc.)
- **Code samples** if applicable

Use the bug report template when available.

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description**
- **Explain why this enhancement would be useful**
- **List examples of how it would be used**

### 🔧 Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test thoroughly** - add tests if applicable
4. **Update documentation** if needed
5. **Follow the commit message conventions**
6. **Open a pull request**

#### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat(api): add campaign scheduling endpoint

Added POST /api/campaigns endpoint with scheduling support.
Includes rate limiting and validation.

Closes #123
```

## Development Setup

### Prerequisites
- Node.js >= 18.0.0
- Git
- npm or yarn

### Setup Steps

1. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Waqtor.git
   cd Waqtor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

5. **Start development:**
   ```bash
   npm run shell
   ```

## Coding Standards

### JavaScript Style Guide

- Use **ES6+** features
- Follow **ESLint** configuration
- **4 spaces** for indentation
- **Single quotes** for strings
- **Semicolons** at end of statements

### File Structure

```
src/
├── structures/      # Data structures (Message, Chat, etc.)
├── authStrategies/  # Authentication strategies
├── util/            # Utility functions
├── factories/       # Object factories
└── webCache/        # Cache management
```

### Documentation

- Use **JSDoc** for all public APIs
- Include **examples** in documentation
- Keep **README.md** updated
- Document **breaking changes**

### Testing

- Write tests for **new features**
- Ensure **existing tests pass**
- Aim for **high coverage**
- Test on **multiple Node versions**

## Project Structure

### Branches

- `main` - Stable, production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

### Release Process

1. Update `CHANGELOG.md`
2. Bump version in `package.json`
3. Create release tag
4. Publish to npm (maintainers only)

## Community

- **GitHub Discussions** - Ask questions, share ideas
- **Issues** - Report bugs, request features
- **Pull Requests** - Contribute code

## Recognition

Contributors will be:
- Listed in `CONTRIBUTORS.md`
- Mentioned in release notes
- Credited in documentation

## Questions?

Feel free to:
- Open a **GitHub Discussion**
- Create an **Issue** with the `question` label
- Contact the maintainers

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

---

**Thank you for contributing to Waqtor!** 🚀

Maintained by Tariq Said (DXBMark)  
Based on whatsapp-web.js by Pedro S. Lopez
