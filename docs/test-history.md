# Test History & Analytics

Django Test Manager tracks all your test runs and provides valuable insights into your test suite's health.

## Viewing Test History

### Option 1: Keyboard Shortcut

Press:
- **Mac**: `Ctrl+Cmd+H`
- **Windows/Linux**: `Ctrl+Alt+H`

### Option 2: Command Palette

1. Press `Cmd+Shift+P` / `Ctrl+Shift+P`
2. Type **"Django Test Manager: View Test History"**
3. Press Enter

## The History Dashboard

The Test History dashboard shows:

### Summary Cards

| Metric | Description |
|--------|-------------|
| **Total Tests Run** | Total number of test executions |
| **Passed** | Number of passed tests (green) |
| **Failed** | Number of failed tests (red) |
| **Skipped** | Number of skipped tests (gray) |
| **Pass Rate** | Percentage of tests that passed |
| **Avg Duration** | Average time per test |

### Slowest Tests

Shows the top 5 slowest tests by average duration. Use this to:
- Identify performance bottlenecks
- Find tests that need optimization
- Consider parallelization for slow tests

### Most Failing Tests

Shows tests with the highest failure rate. Use this to:
- Find flaky tests that fail intermittently
- Identify problematic areas of your codebase
- Prioritize bug fixes

## Analytics Features

### Flakiness Detection

A "flaky" test is one that sometimes passes and sometimes fails without code changes. The extension detects flaky tests by analyzing:

- **Transition rate**: How often does the test switch between pass/fail?
- **Consistency**: Does it fail the same way each time?

Tests with high flakiness scores should be investigated and fixed.

### Duration Tracking

Every test run records:
- Start time
- End time
- Individual test durations

This helps you:
- Track if tests are getting slower over time
- Identify tests that need optimization
- Set performance budgets for your test suite

## Managing History

### Clear History

To clear all test history:

1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Type **"Django Test Manager: Clear Test History"**
3. Confirm

### Export History

To export history as JSON:

1. Open Command Palette
2. Type **"Django Test Manager: Export Test History"**
3. A JSON file will open in the editor
4. Save it wherever you like

### History Retention

By default, the extension keeps the last 50 test sessions. To change this:

```json
{
  "djangoTestManager.historyMaxSessions": 100
}
```

## Use Cases

### 1. Finding Flaky Tests

1. Run your test suite multiple times
2. Open Test History (`Ctrl+Cmd+H`)
3. Check "Most Failing Tests" section
4. Tests with 50% failure rate are likely flaky

### 2. Performance Monitoring

1. Run tests regularly
2. Open Test History
3. Check "Slowest Tests" section
4. Set alerts for tests exceeding thresholds

### 3. Pre-Commit Validation

1. Run tests before committing
2. Check Test History for any new failures
3. Ensure pass rate is 100% before pushing

### 4. CI/CD Integration

Export history as JSON and include it in your CI artifacts:

```bash
# In your CI script
code --command "django-test-manager.exportTestHistory"
```

## Data Storage

Test history is stored in VS Code's extension storage:
- **Location**: `~/.vscode/extensions/`
- **Format**: JSON
- **Persistence**: Survives VS Code restarts

The data includes:
- Session metadata (start time, duration)
- Test results (pass/fail/skip)
- Test durations
- Error messages

## Best Practices

### 1. Regular History Reviews

Set a reminder to review test history weekly:
- Look for new flaky tests
- Check if any tests are getting slower
- Celebrate improving pass rates! 🎉

### 2. Export Before Major Changes

Before a big refactor:
1. Export current history
2. Make your changes
3. Run tests
4. Compare with previous history

### 3. Use with Watch Mode

Combine with Watch Mode for real-time tracking:
1. Enable Watch Mode
2. Write code
3. History updates automatically
4. Review at end of session

## Related Documentation

- [Getting Started](./getting-started.md)
- [Watch Mode](./watch-mode.md)
- [Configuration Reference](./configuration.md)
