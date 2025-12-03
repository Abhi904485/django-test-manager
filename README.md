<p align="center">
  <img src="https://raw.githubusercontent.com/viseshagarwal/django-test-manager/main/icon.png" alt="Django Test Manager Logo" width="128" height="128" />
</p>

# Django Test Manager

**The ultimate tool for managing, running, and debugging Django tests in your favorite editor.**

Django Test Manager provides a powerful, native-feeling interface for your Django test suite. Discover, organize, search, run, and debug your tests with zero configuration required.

## ✨ Features

*   **🔍 Smart Test Discovery**: Automatically finds tests in your project using configurable patterns. Supports hierarchical view of apps, files, classes, and methods.
*   **▶️ One-Click Execution**: Run individual tests, classes, files, or your entire suite directly from the Test Explorer or Editor.
*   **🐞 Zero-Config Debugging**: Instantly debug any test without messing with `launch.json`. Just click the debug icon, and we handle the rest.
*   **🔎 Instant Search**: Quickly find and jump to any test in your project with the built-in search command.
*   **⚡ Fast & Responsive**: Built for performance. Includes "Cancel" functionality to stop long-running suites instantly.
*   **📝 CodeLens Integration**: "Run" and "Debug" buttons appear directly above your test methods in the editor.
*   **⚙️ Beautiful Configuration**: A dedicated, clean UI for configuring your Python path, `manage.py` location, test patterns, and environment variables.
*   **🔄 Smart Re-runs**: Easily re-run only the tests that failed in the last session.
*   **🎨 Visual Feedback**: Clear status icons (Pass/Fail/Skip) in the explorer, editor gutter, and status bar.

## 🚀 Getting Started

1.  Open your Django project in VS Code.
2.  The extension will automatically discover your tests. Look for the **Django Tests** icon in the Activity Bar.
3.  Click the **Play** (▶) icon next to any test to run it.
4.  Click the **Debug** (🐞) icon to start a debugging session.

## 🛠️ Configuration

Click the **Gear** (⚙️) icon in the Test Explorer title bar to open the configuration panel.

### Available Settings

*   **Environment**:
    *   `Python Path`: Path to your Python interpreter (auto-detects virtual environments).
    *   `Manage.py Path`: Relative path to your `manage.py` file.
    *   `Environment Variables`: Key-value pairs to set during test runs.

*   **Discovery**:
    *   `Test File Pattern`: Glob pattern to find test files (default: `**/*test*.py`).
    *   `Test Method Pattern`: Prefix for test methods (default: `test_`).

*   **Execution**:
    *   `Test Arguments`: Global arguments passed to every test run (e.g., `--keepdb`, `--failfast`).
    *   `Command Template`: Customize the exact command used to invoke tests.

## ⌨️ Commands

*   `Django Test Manager: Search Tests`: Open the quick pick menu to search and run tests.
*   `Django Test Manager: Run Failed Tests`: Re-run tests that failed in the previous run.
*   `Django Test Manager: Cancel Tests`: Stop the currently running test process.
*   `Django Test Manager: Configure`: Open the configuration panel.

## Release Notes

### 0.2.1
*   **Improved**: Improved the test execution.

### 0.2.0

*   **New**: Configuration Page! A dedicated UI to manage your settings.
*   **New**: "Search Tests" command to quickly find and run tests.
*   **New**: "Cancel Tests" button to stop running tests.
*   **Improved**: Test result parsing now correctly handles partial failures (no more "All Failed" false alarms).
*   **Improved**: Configurable test file and method patterns.
*   **Fixed**: Various bug fixes and performance improvements.

### 0.1.0

*   Initial release.

## 📋 Requirements

*   VS Code 1.80.0 or higher.
*   A Django project with a `manage.py` file.
*   Python installed.

## 🤝 Contributing

Found a bug or have a feature request? Please open an issue on our [GitHub repository](https://github.com/viseshagarwal/django-test-manager).

## 📄 License

MIT
