# Troubleshooting

Common issues and how to fix them.

## Tests Not Being Discovered

### Check 1: Test File Pattern

Make sure your test files match the default pattern `**/*test*.py`.

**Solution:** Update the pattern in settings:

```json
{
  "djangoTestManager.testFilePattern": "**/test_*.py"
}
```

### Check 2: Test Class Detection

The extension looks for classes that:
- Start with `Test` (e.g., `TestUserModel`)
- Inherit from known base classes (`TestCase`, `APITestCase`, etc.)

**Solution:** Add your custom base class:

```json
{
  "djangoTestManager.testBaseClasses": ["MyCustomTestCase"]
}
```

### Check 3: Refresh the Test List

Click the **Refresh** button (🔄) in the Django Tests sidebar.

Or press `Ctrl+Cmd+R` (Mac) / `Ctrl+Alt+R` (Windows/Linux).

### Check 4: Check the Output Panel

1. Open **View** → **Output**
2. Select **Django Test Manager** from the dropdown
3. Look for error messages

---

## Extension Not Activating

### Check 1: manage.py Location

The extension activates when it finds `manage.py` in your workspace root.

**Solution:** If your `manage.py` is in a subfolder:

```json
{
  "djangoTestManager.managePyPath": "backend/manage.py"
}
```

### Check 2: Python Extension

Django Test Manager works best with the Python extension installed.

**Solution:** Install the official Python extension from Microsoft.

### Check 3: Workspace Type

The extension requires a folder to be opened (not just a single file).

**Solution:** Open a folder with **File** → **Open Folder**.

---

## Tests Failing to Run

### Check 1: Python Path

Make sure the Python path is correct.

**Solution:**
```json
{
  "djangoTestManager.pythonPath": "/path/to/venv/bin/python"
}
```

The extension auto-detects `.venv` and `venv` folders.

### Check 2: Virtual Environment

If tests work in terminal but not in the extension:

1. Check that your venv is activated
2. Or set the full path to Python in settings

### Check 3: Working Directory

Tests run from the workspace root. If your `manage.py` is elsewhere:

```json
{
  "djangoTestManager.managePyPath": "src/manage.py"
}
```

### Check 4: Django Settings

Set the correct Django settings module:

```json
{
  "djangoTestManager.environmentVariables": {
    "DJANGO_SETTINGS_MODULE": "myproject.settings.test"
  }
}
```

---

## Debugging Not Working

### Check 1: debugpy Package

Debug requires `debugpy` to be installed in your Python environment.

**Solution:**
```bash
pip install debugpy
```

### Check 2: Python Extension

Debugging uses the Python extension's debugger.

**Solution:** Make sure the Python extension is installed and working.

### Check 3: Conflicting Arguments

Some test arguments interfere with debugging:
- `--parallel` (tests run in subprocesses)
- `-b` / `--buffer` (captures output)

The extension automatically removes these when debugging.

---

## Watch Mode Not Working

### Check 1: Watch Mode Enabled

Make sure Watch Mode is actually enabled. Look for the **👁️ Watch Mode** indicator in the status bar.

**Solution:** Press `Ctrl+Cmd+W` to toggle it on.

### Check 2: File Pattern

Check that changed files match the watch pattern.

**Solution:**
```json
{
  "djangoTestManager.watchPattern": "**/*.py"
}
```

### Check 3: Debounce Time

Tests run after a debounce delay (default 1 second).

**Solution:** Wait a moment after saving, or reduce the debounce:

```json
{
  "djangoTestManager.watchDebounceMs": 500
}
```

### Check 4: Excluded Directories

Watch Mode ignores these directories:
- `__pycache__`
- `.venv` / `venv`
- `.git`
- `migrations`

---

## CodeLens Not Appearing

### Check 1: Python Language Mode

CodeLens only appears in Python files.

**Solution:** Make sure the file is recognized as Python (check bottom right of VS Code).

### Check 2: Test Class Detection

CodeLens appears only on recognized test classes.

**Solution:** Make sure your class:
- Starts with `Test`, or
- Inherits from `TestCase`, `APITestCase`, etc.

### Check 3: VS Code Settings

Check that CodeLens is enabled in VS Code:

```json
{
  "editor.codeLens": true
}
```

---

## Performance Issues

### Issue: Extension is Slow

**Possible causes:**
- Large codebase with many files
- Many test files to parse

**Solutions:**

1. Narrow the file pattern:
   ```json
   {
     "djangoTestManager.testFilePattern": "apps/**/test_*.py"
   }
   ```

2. Close and reopen the workspace (clears caches)

### Issue: Tests Take Long to Discover

**Solution:** The extension caches test discovery. Use the **Refresh** button when needed instead of auto-refresh.

### Issue: High CPU Usage

**Solution:** Check if Watch Mode is enabled with a very low debounce time:

```json
{
  "djangoTestManager.watchDebounceMs": 2000
}
```

---

## Common Error Messages

### "No workspace folder opened"

**Cause:** You opened a single file, not a folder.

**Solution:** Use **File** → **Open Folder** to open your project.

### "Cannot find manage.py"

**Cause:** `manage.py` is not in the expected location.

**Solution:**
```json
{
  "djangoTestManager.managePyPath": "path/to/manage.py"
}
```

### "Python interpreter not found"

**Cause:** The Python path is incorrect.

**Solution:**
```json
{
  "djangoTestManager.pythonPath": "python3"
}
```

### "Test discovery failed"

**Cause:** Error during `manage.py test --collect-only`.

**Solution:**
1. Try running `python manage.py test --collect-only` in terminal
2. Fix any errors that appear
3. Refresh the test list

---

## Getting Help

If you're still stuck:

1. **Check GitHub Issues**: [github.com/viseshagarwal/django-test-manager/issues](https://github.com/viseshagarwal/django-test-manager/issues)

2. **Open a New Issue**: Include:
   - VS Code version
   - Extension version
   - Python version
   - Django version
   - Error messages from Output panel

3. **Join Discussions**: [github.com/viseshagarwal/django-test-manager/discussions](https://github.com/viseshagarwal/django-test-manager/discussions)

---

## Related Documentation

- [Getting Started](./getting-started.md)
- [Watch Mode](./watch-mode.md)
- [Configuration Reference](./configuration.md)
