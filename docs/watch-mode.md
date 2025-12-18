# Watch Mode

Watch Mode automatically runs tests when you save files, making Test-Driven Development (TDD) a breeze.

## Enabling Watch Mode

### Option 1: Keyboard Shortcut (Recommended)

Press:
- **Mac**: `Ctrl+Cmd+W`
- **Windows/Linux**: `Ctrl+Alt+W`

### Option 2: Command Palette

1. Press `Cmd+Shift+P` / `Ctrl+Shift+P`
2. Type **"Django Test Manager: Toggle Watch Mode"**
3. Press Enter

### Option 3: Status Bar

Click the **👁️ Watch Mode** indicator in the status bar to toggle.

## How It Works

When Watch Mode is enabled:

1. The extension watches for file changes in your project
2. When you save a Python file, it waits for a short debounce period
3. Then it determines which tests to run:
   - If you edited a **test file** → runs that file
   - If you edited a **non-test file** → finds related test files

### Example

```
You edit: users/models.py
Extension runs: users/test_models.py (if it exists)
```

## Configuration

### Basic Settings

```json
{
  // Enable/disable watch mode
  "djangoTestManager.watchMode": false,
  
  // How long to wait after saving before running tests (ms)
  "djangoTestManager.watchDebounceMs": 1000,
  
  // Which files to watch
  "djangoTestManager.watchPattern": "**/*.py",
  
  // Only run tests related to changed files (vs all tests)
  "djangoTestManager.watchRunAffectedOnly": true,
  
  // Show desktop notifications on pass/fail
  "djangoTestManager.showNotifications": true
}
```

### Debounce Time

The debounce prevents tests from running while you're still typing. Default is 1000ms (1 second).

**For fast computers:**
```json
{
  "djangoTestManager.watchDebounceMs": 500
}
```

**For slower test suites:**
```json
{
  "djangoTestManager.watchDebounceMs": 2000
}
```

### Run All Tests vs Affected Only

By default, Watch Mode only runs tests that are related to the file you changed. To run all tests on every save:

```json
{
  "djangoTestManager.watchRunAffectedOnly": false
}
```

⚠️ **Warning**: This can be slow for large test suites!

## Status Bar Indicator

When Watch Mode is enabled, you'll see an indicator in the status bar:

- **👁️ Watch Mode** (highlighted) - Watch Mode is ON
- **👁️ Watch Mode** (dimmed) - Watch Mode is OFF

Click the indicator to toggle Watch Mode on/off.

## Desktop Notifications

When tests complete, you'll see a notification:

- ✅ **"All tests passed: 5 passed"** - Everything is green!
- ❌ **"Tests failed: 2 failed, 3 passed"** - Some tests failed

To disable notifications:
```json
{
  "djangoTestManager.showNotifications": false
}
```

## Best Practices

### 1. Use with Fast Test Profile

Combine Watch Mode with the Fast profile for instant feedback:

1. Select the **Fast** profile (uses `--failfast`)
2. Enable Watch Mode
3. Start coding!

Tests will stop at the first failure, giving you immediate feedback.

### 2. Focus on Specific Tests

If you're working on a specific feature:

1. Open the test file you're interested in
2. Right-click → **Run Test**
3. Enable Watch Mode

Watch Mode will prioritize the tests you've been running.

### 3. Exclude Slow Tests

If some tests are too slow for Watch Mode:

1. Mark them with `@unittest.skip` temporarily
2. Or use the `--exclude-tag=slow` flag in your profile

## Troubleshooting

### Watch Mode Not Running Tests?

1. Check that the file matches the watch pattern (`**/*.py`)
2. Ensure the debounce has elapsed (wait 1 second after saving)
3. Check for errors in the Output panel

### Too Many Tests Running?

1. Enable `watchRunAffectedOnly`
2. Increase the debounce time
3. Check your watch pattern isn't too broad

### Notifications Not Showing?

1. Check that `showNotifications` is `true`
2. Ensure your OS allows VS Code to show notifications
3. Check notification settings in your OS

## Related Documentation

- [Getting Started](./getting-started.md)
- [Test History](./test-history.md)
- [Configuration Reference](./configuration.md)
