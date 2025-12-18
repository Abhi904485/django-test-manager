# Getting Started with Django Test Manager

This guide will help you get up and running with Django Test Manager in just a few minutes.

## Prerequisites

- VS Code 1.80.0 or higher
- A Django project with `manage.py` in the root
- Python 3.8 or higher

## Installation

### Option 1: VS Code Marketplace (Recommended)

1. Open VS Code
2. Press `Cmd+Shift+X` (Mac) or `Ctrl+Shift+X` (Windows/Linux)
3. Search for **"Django Test Manager"**
4. Click **Install**

### Option 2: Open VSX Registry

If you're using VS Codium or another open-source VS Code distribution:

1. Visit [Open VSX](https://open-vsx.org/extension/viseshagarwal/django-test-manager)
2. Click **Install**

### Option 3: Manual Installation

1. Download the `.vsix` file from [GitHub Releases](https://github.com/viseshagarwal/django-test-manager/releases)
2. Open VS Code
3. Press `Cmd+Shift+P` / `Ctrl+Shift+P`
4. Type **"Install from VSIX"**
5. Select the downloaded file

## First Steps

### 1. Open Your Django Project

Open a folder containing your Django project. The extension will automatically activate when it detects a `manage.py` file.

### 2. Explore the Test Tree

Click the **Django Tests** icon in the Activity Bar (left sidebar) to open the Test Explorer.

```
📁 myproject
├── 📁 users
│   ├── 📄 test_models.py
│   │   ├── 🔷 TestUserModel
│   │   │   ├── ▶️ test_create_user
│   │   │   └── ▶️ test_user_email
│   │   └── 🔷 TestUserManager
│   │       └── ▶️ test_create_superuser
│   └── 📄 test_views.py
│       └── 🔷 TestUserViews
│           ├── ▶️ test_login
│           └── ▶️ test_logout
└── 📁 posts
    └── 📄 test_api.py
        └── 🔷 TestPostAPI
            └── ▶️ test_list_posts
```

### 3. Run Your First Test

There are multiple ways to run tests:

#### Method 1: Click the Play Button
Click the **▶️** button next to any test in the tree view.

#### Method 2: Use CodeLens
Open any test file. You'll see "Run Test | Debug Test" links above each test class and method.

#### Method 3: Use Keyboard Shortcut
Place your cursor inside a test method and press:
- **Mac**: `Ctrl+Cmd+T`
- **Windows/Linux**: `Ctrl+Alt+T`

#### Method 4: Run All Tests
Press:
- **Mac**: `Ctrl+Cmd+A`
- **Windows/Linux**: `Ctrl+Alt+A`

### 4. View Test Results

After running tests, you'll see real-time status updates:

**During execution:**
- 🕐 **Clock**: Test is pending (waiting to run)
- 🔄 **Spinner**: Test is currently running (animated!)
- Status bar shows progress like `3/20`

**After completion:**
- ✅ **Green checkmark**: Test passed
- ❌ **Red X**: Test failed
- ⏭️ **Step-over**: Test skipped
- 🚫 **Circle-slash**: Test was aborted (cancelled)

Click on a failed test to see the error message in the terminal.

## Next Steps

Now that you're up and running, explore these features:

1. **[Watch Mode](./watch-mode.md)** - Automatically run tests when you save files
2. **[Test History](./test-history.md)** - Track your test runs and find flaky tests
3. **[Configuration](./configuration.md)** - Customize the extension to your needs

## Quick Tips

### Run Only Failed Tests
Press `Ctrl+Cmd+E` (Mac) or `Ctrl+Alt+E` to re-run only the tests that failed.

### Search Tests
Press `Ctrl+Cmd+S` (Mac) or `Ctrl+Alt+S` to quickly find and run any test.

### Switch Profiles
Different test configurations for different scenarios:
- **Default**: `--keepdb --parallel` (fast, keeps database)
- **Fast**: `--keepdb --failfast --parallel` (stops on first failure)
- **Clean**: `--noinput` (fresh database each time)

### Debug a Test
Click the **🐞 bug icon** next to any test, or press `Ctrl+Cmd+D` (Mac) / `Ctrl+Alt+D`.

## Troubleshooting

### Tests not discovered?

1. Make sure your test files match the pattern `**/*test*.py`
2. Check that your Python path is correct in settings
3. Click the **Refresh** button in the test tree

### Extension not activating?

1. Ensure you have a `manage.py` file in your project root
2. Check the Output panel (View → Output → Django Test Manager)

For more help, see the [Troubleshooting Guide](./troubleshooting.md).
