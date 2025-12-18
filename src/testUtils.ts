import * as vscode from 'vscode';

/**
 * Default known Django/Python test base classes
 */
const DEFAULT_TEST_BASE_CLASSES = [
    // Django
    'TestCase',
    'TransactionTestCase',
    'SimpleTestCase',
    'LiveServerTestCase',
    'StaticLiveServerTestCase',
    // Django REST Framework
    'APITestCase',
    'APISimpleTestCase',
    'APITransactionTestCase',
    // Python unittest/asyncio
    'AsyncTestCase',
    'IsolatedAsyncioTestCase',
    'unittest.TestCase',
    // pytest (common patterns)
    'TestSuite',
];

/**
 * Cached test base classes set - invalidated on configuration change
 */
let cachedTestBaseClasses: Set<string> | null = null;
let configListener: vscode.Disposable | null = null;

/**
 * Initialize configuration change listener for cache invalidation
 */
export function initTestUtilsCache(): vscode.Disposable {
    if (!configListener) {
        configListener = vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('djangoTestManager.testBaseClasses')) {
                cachedTestBaseClasses = null;
            }
        });
    }
    return configListener;
}

/**
 * Get the set of test base classes, including user-configured ones.
 * Results are cached until configuration changes.
 */
export function getTestBaseClasses(): Set<string> {
    if (cachedTestBaseClasses) {
        return cachedTestBaseClasses;
    }

    const config = vscode.workspace.getConfiguration('djangoTestManager');
    const customBaseClasses = config.get<string[]>('testBaseClasses') || [];

    cachedTestBaseClasses = new Set([...DEFAULT_TEST_BASE_CLASSES, ...customBaseClasses]);
    return cachedTestBaseClasses;
}

/**
 * Pre-compiled regex for extracting base classes - more efficient than creating new regex each time
 */
const BASE_CLASS_REGEX = /class\s+\w+\s*\(([^)]+)\)/;

/**
 * Check if a class is a test class based on:
 * 1. Class name starts with "Test"
 * 2. Class inherits from a known test base class
 *
 * @param className The name of the class
 * @param baseClasses Optional comma-separated string of base classes or an array
 * @returns true if the class is a test class
 */
export function isTestClass(className: string, baseClasses?: string | string[]): boolean {
    // Fast path: Check if class name starts with "Test"
    if (className.length >= 4 && className[0] === 'T' && className[1] === 'e' &&
        className[2] === 's' && className[3] === 't') {
        return true;
    }

    // Check inheritance
    if (baseClasses) {
        const testBaseClasses = getTestBaseClasses();
        const bases = typeof baseClasses === 'string'
            ? baseClasses.split(',')
            : baseClasses;

        for (let i = 0; i < bases.length; i++) {
            const baseClass = bases[i].trim();
            // Extract the class name from qualified names (e.g., "django.test.TestCase" -> "TestCase")
            const lastDotIndex = baseClass.lastIndexOf('.');
            const baseClassName = lastDotIndex >= 0 ? baseClass.substring(lastDotIndex + 1) : baseClass;

            if (testBaseClasses.has(baseClassName)) {
                return true;
            }

            // Also check if base class starts with "Test" (e.g., TestMixin, TestBase)
            if (baseClassName.length >= 4 && baseClassName[0] === 'T' && baseClassName[1] === 'e' &&
                baseClassName[2] === 's' && baseClassName[3] === 't') {
                return true;
            }
        }
    }

    return false;
}

/**
 * Extract base classes from a Python class definition line
 *
 * @param line The line containing the class definition
 * @returns Array of base class names, or undefined if no inheritance found
 */
export function extractBaseClasses(line: string): string[] | undefined {
    const inheritanceMatch = BASE_CLASS_REGEX.exec(line);
    if (inheritanceMatch) {
        return inheritanceMatch[1].split(',');
    }
    return undefined;
}

/**
 * Check if a class definition line represents a test class
 *
 * @param className The name of the class
 * @param line The full line containing the class definition
 * @returns true if the class is a test class
 */
export function isTestClassFromLine(className: string, line: string): boolean {
    // Fast path: Check if class name starts with "Test"
    if (className.length >= 4 && className[0] === 'T' && className[1] === 'e' &&
        className[2] === 's' && className[3] === 't') {
        return true;
    }

    const baseClasses = extractBaseClasses(line);
    return isTestClass(className, baseClasses);
}

/**
 * Clear all caches - useful for testing or manual refresh
 */
export function clearTestUtilsCache(): void {
    cachedTestBaseClasses = null;
}
