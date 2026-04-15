# Contributing to Account Management Ledger System

First off, thank you for considering contributing to the **Account Management Ledger System**! It's people like you that make this system such a great application.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

**Before Submitting A Bug Report:**
- Check the [FAQ](./docs/FAQ.md) for common issues
- Determine which repository the problem should be reported in
- Perform a cursory search to see if the problem has already been reported

**How Do I Submit A (Good) Bug Report?**

Bugs are tracked as GitHub issues. Create an issue and provide the following information by filling in the template:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**
- **Include your environment details**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide the following information:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**
- **List some other projects where this enhancement exists, if applicable**

### Pull Requests

- Fill in the required template
- Follow the [Style Guides](#style-guides) below
- Include appropriate test cases
- Update documentation as needed
- End all files with a newline

## Style Guides

### JavaScript/Node.js Style Guide

- **Naming Conventions:**
  - Use `camelCase` for variables and functions
  - Use `PascalCase` for classes and constructors
  - Use `UPPER_SNAKE_CASE` for constants

- **Code Format:**
  ```javascript
  // ✅ Good
  const getUserById = async (userId) => {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw new AppError('User not found', 404);
    }
  };

  // ❌ Bad
  const get_user_by_id = async (userId) => {
    let user = await User.findById(userId);
    return user;
  };
  ```

- **Comments:**
  - Write clear, self-documenting code
  - Use comments for "why", not "what"
  - Keep comments up-to-date

- **Error Handling:**
  ```javascript
  // Always use try-catch with async operations
  try {
    await operation();
  } catch (error) {
    logger.error('Error:', error);
    throw new AppError('Operation failed', 500);
  }
  ```

- **Imports/Exports:**
  ```javascript
  // Use ES6 modules
  import { Router } from 'express';
  import UserService from './user.service.js';
  export default router;
  ```

### Database Schema Guide

- Use descriptive field names
- Include validations at the schema level
- Always include timestamps (createdAt, updatedAt)
- Use enums for fixed values
- Include indexes for frequently queried fields

```javascript
const schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

schema.index({ name: 1, status: 1 });
```

### Git Commit Message Guide

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable emoji:
  - 🎨 `:art:` - Improve structure/format
  - 🐛 `:bug:` - Fix bug
  - ✨ `:sparkles:` - Add feature
  - 📚 `:books:` - Add/update documentation
  - ♻️ `:recycle:` - Refactor code
  - 🧪 `:test_tube:` - Add tests
  - ⚡ `:zap:` - Improve performance
  - 🔐 `:lock:` - Fix security issue
  - 🚀 `:rocket:` - Deploy to production
  - 📦 `:package:` - Update dependencies

**Example:**
```
✨ Add transaction pagination to ledger endpoint

- Implements offset-based pagination
- Defaults to page=1, limit=10
- Includes total count in response
- Fixes issue #123
```

### Documentation Style Guide

- Use Markdown for all documentation
- Use clear, concise language
- Include examples and code snippets
- Keep documentation up-to-date with code changes
- Use relative links for internal references

## Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork locally:**
   ```bash
   git clone https://github.com/your-username/Account_Management_Ledger_System.git
   cd jerry-accounts
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/Soojal2005/Account_Management_Ledger_System.git
   ```

4. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Install dependencies:**
   ```bash
   npm install
   ```

6. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

7. **Start development server:**
   ```bash
   npm run dev
   ```

## Testing

Before submitting your PR, ensure:

- [ ] All functionality is tested
- [ ] Tests pass locally: `npm test`
- [ ] No console errors or warnings
- [ ] Code follows style guide
- [ ] Documentation is updated

## PR Review Process

1. **Initial Review** - Maintainers review for:
   - Code quality and style adherence
   - Functionality and approach
   - Test coverage
   - Documentation

2. **Feedback** - Maintainers may request:
   - Code changes
   - Additional tests
   - Documentation updates

3. **Approval** - Once approved, a maintainer will:
   - Merge the PR
   - Update CHANGELOG.md
   - Close related issues

## Additional Notes

### Issue and Pull Request Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested
- `security` - Security vulnerability or concern
- `wontfix` - This will not be worked on

## Community

- Join our discussions on GitHub Discussions
- Ask questions on Stack Overflow (tag: `jerry-accounts`)
- Follow us on social media for announcements

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project social media

---

Thank you for contributing! 🎉

**Last Updated:** April 15, 2026
