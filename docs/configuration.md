# Configuration Reference

Complete reference for all Django Test Manager settings.

## Basic Settings

### `djangoTestManager.pythonPath`

Path to the Python interpreter.

| | |
|---|---|
| **Type** | `string` |
| **Default** | `python3` |
| **Examples** | `python`, `python3.11`, `/usr/bin/python3` |

The extension automatically detects virtual environments in `.venv` and `venv` folders.

### `djangoTestManager.managePyPath`

Path to `manage.py` relative to workspace root.

| | |
|---|---|
| **Type** | `string` |
| **Default** | `manage.py` |
| **Examples** | `manage.py`, `src/manage.py`, `backend/manage.py` |

### `djangoTestManager.testFilePattern`

Glob pattern for discovering test files.

| | |
|---|---|
| **Type** | `string` |
| **Default** | `**/*test*.py` |
| **Examples** | `**/test_*.py`, `tests/**/*.py`, `**/*_test.py` |

### `djangoTestManager.testMethodPattern`

Prefix for test method names.

| | |
|---|---|
| **Type** | `string` |
| **Default** | `test_` |
| **Examples** | `test_`, `check_`, `verify_` |

---

## Test Profiles

### `djangoTestManager.activeProfile`

The currently active test profile.

| | |
|---|---|
| **Type** | `string` |
| **Default** | `Default` |

### `djangoTestManager.testProfiles`

Define your own test profiles with custom arguments.

| | |
|---|---|
| **Type** | `object` |
| **Default** | See below |

**Default Profiles:**

```json
{
  "djangoTestManager.testProfiles": {
    "Default": ["--keepdb", "--parallel"],
    "Fast": ["--keepdb", "--failfast", "--parallel"],
    "Clean": ["--noinput"]
  }
}
```

**Custom Profile Examples:**

```json
{
  "djangoTestManager.testProfiles": {
    "Default": ["--keepdb", "--parallel"],
    "Verbose": ["--keepdb", "-v", "3"],
    "Coverage": ["--keepdb"],
    "CI": ["--noinput", "--parallel", "auto"],
    "Database": ["--noinput", "--verbosity=2"]
  }
}
```

### `djangoTestManager.testArguments`

Additional arguments to append to all test commands.

| | |
|---|---|
| **Type** | `array` |
| **Default** | `[]` |
| **Example** | `["--no-color", "--timing"]` |

---

## Environment Variables

### `djangoTestManager.environmentVariables`

Environment variables to set when running tests.

| | |
|---|---|
| **Type** | `object` |
| **Default** | `{}` |

**Example:**

```json
{
  "djangoTestManager.environmentVariables": {
    "DJANGO_SETTINGS_MODULE": "myproject.settings.test",
    "DATABASE_URL": "sqlite:///test.db",
    "DEBUG": "False"
  }
}
```

---

## Watch Mode Settings

### `djangoTestManager.watchMode`

Enable automatic test running on file save.

| | |
|---|---|
| **Type** | `boolean` |
| **Default** | `false` |

### `djangoTestManager.watchDebounceMs`

Time to wait after file changes before running tests (milliseconds).

| | |
|---|---|
| **Type** | `number` |
| **Default** | `1000` |
| **Range** | `100` - `10000` |

### `djangoTestManager.watchPattern`

Glob pattern for files to watch.

| | |
|---|---|
| **Type** | `string` |
| **Default** | `**/*.py` |
| **Examples** | `**/*.py`, `apps/**/*.py`, `**/models.py` |

### `djangoTestManager.watchRunAffectedOnly`

Only run tests related to changed files (instead of all tests).

| | |
|---|---|
| **Type** | `boolean` |
| **Default** | `true` |

### `djangoTestManager.showNotifications`

Show desktop notifications when tests complete.

| | |
|---|---|
| **Type** | `boolean` |
| **Default** | `true` |

---

## Test Detection Settings

### `djangoTestManager.testBaseClasses`

Additional test base classes to recognize.

| | |
|---|---|
| **Type** | `array` |
| **Default** | `[]` |

The extension automatically recognizes:
- `TestCase`
- `TransactionTestCase`
- `SimpleTestCase`
- `LiveServerTestCase`
- `APITestCase`
- Classes starting with `Test`

**Example for custom base classes:**

```json
{
  "djangoTestManager.testBaseClasses": [
    "MyCustomTestCase",
    "IntegrationTestCase",
    "E2ETestCase"
  ]
}
```

---

## Native Test Explorer

### `djangoTestManager.useNativeTestExplorer`

Enable VS Code's native Test Explorer integration.

| | |
|---|---|
| **Type** | `boolean` |
| **Default** | `true` |

When enabled, tests also appear in VS Code's built-in Testing view (beaker icon).

---

## Coverage Settings

### `djangoTestManager.enableCoverage`

Enable code coverage reporting.

| | |
|---|---|
| **Type** | `boolean` |
| **Default** | `false` |

Requires the `coverage` Python package to be installed.

### `djangoTestManager.coverageCommand`

Command to run coverage.

| | |
|---|---|
| **Type** | `string` |
| **Default** | `coverage` |
| **Examples** | `coverage`, `python -m coverage` |

---

## History Settings

### `djangoTestManager.historyMaxSessions`

Maximum number of test sessions to keep in history.

| | |
|---|---|
| **Type** | `number` |
| **Default** | `50` |
| **Range** | `10` - `500` |

---

## Example Complete Configuration

```json
{
  // Basic
  "djangoTestManager.pythonPath": "python3",
  "djangoTestManager.managePyPath": "manage.py",
  "djangoTestManager.testFilePattern": "**/*test*.py",
  "djangoTestManager.testMethodPattern": "test_",
  
  // Profiles
  "djangoTestManager.activeProfile": "Default",
  "djangoTestManager.testProfiles": {
    "Default": ["--keepdb", "--parallel"],
    "Fast": ["--keepdb", "--failfast", "--parallel"],
    "Verbose": ["--keepdb", "-v", "3"],
    "Clean": ["--noinput"]
  },
  
  // Environment
  "djangoTestManager.environmentVariables": {
    "DJANGO_SETTINGS_MODULE": "project.settings.test"
  },
  
  // Watch Mode
  "djangoTestManager.watchMode": false,
  "djangoTestManager.watchDebounceMs": 1000,
  "djangoTestManager.watchRunAffectedOnly": true,
  "djangoTestManager.showNotifications": true,
  
  // Detection
  "djangoTestManager.testBaseClasses": ["MyCustomTestCase"],
  
  // Features
  "djangoTestManager.useNativeTestExplorer": true,
  "djangoTestManager.enableCoverage": false,
  "djangoTestManager.historyMaxSessions": 50
}
```

---

## Related Documentation

- [Getting Started](./getting-started.md)
- [Watch Mode](./watch-mode.md)
- [Test History](./test-history.md)
- [Troubleshooting](./troubleshooting.md)
