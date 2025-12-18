import * as vscode from 'vscode';
import * as path from 'path';
import { TestStateManager } from './testStateManager';
import { isTestClassFromLine } from './testUtils';

/**
 * Cached regex patterns - avoids recreating regex on every provideCodeLenses call
 */
const CLASS_REGEX = /^class\s+(\w+)/;
let cachedMethodRegex: RegExp | null = null;
let cachedMethodPrefix: string | null = null;

function getMethodRegex(): RegExp {
    const config = vscode.workspace.getConfiguration('djangoTestManager');
    const methodPrefix = config.get<string>('testMethodPattern') || 'test_';

    if (cachedMethodRegex && cachedMethodPrefix === methodPrefix) {
        return cachedMethodRegex;
    }

    cachedMethodPrefix = methodPrefix;
    cachedMethodRegex = new RegExp(`^\\s+(?:async\\s+)?def\\s+(${methodPrefix}\\w+)`);
    return cachedMethodRegex;
}

// Listen for config changes to invalidate cache
let configListenerInitialized = false;
export function initCodeLensCache(context: vscode.ExtensionContext): void {
    if (!configListenerInitialized) {
        context.subscriptions.push(
            vscode.workspace.onDidChangeConfiguration((e) => {
                if (e.affectsConfiguration('djangoTestManager.testMethodPattern')) {
                    cachedMethodRegex = null;
                    cachedMethodPrefix = null;
                }
            })
        );
        configListenerInitialized = true;
    }
}

export class DjangoTestCodeLensProvider implements vscode.CodeLensProvider {
    private pathSepRegex: RegExp;

    constructor(private workspaceRoot: string) {
        // Pre-compile path separator regex
        this.pathSepRegex = new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g');
    }

    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] {
        // Early exit for non-Python files (extra safety)
        if (!document.fileName.endsWith('.py')) {
            return [];
        }

        const codeLenses: vscode.CodeLens[] = [];
        const text = document.getText();

        // Quick check: if no 'class' keyword, skip entirely
        if (!text.includes('class ')) {
            return [];
        }

        const lines = text.split('\n');

        // Calculate file dotted path once
        const relativePath = path.relative(this.workspaceRoot, document.uri.fsPath);
        const cleanRelativePath = relativePath.startsWith(path.sep) ? relativePath.substring(1) : relativePath;
        const fileDottedPath = cleanRelativePath.replace(/\.py$/, '').replace(this.pathSepRegex, '.');

        const methodRegex = getMethodRegex();
        const stateManager = TestStateManager.getInstance();

        let currentClassName: string | null = null;
        let isCurrentClassTestClass = false;

        for (let i = 0; i < lines.length; i++) {
            // Check cancellation periodically (every 100 lines)
            if (i % 100 === 0 && token.isCancellationRequested) {
                return codeLenses;
            }

            const line = lines[i];
            const lineLength = line.length;

            // Skip empty lines and comments quickly
            if (lineLength === 0) continue;

            const trimmedStart = line.trimStart();
            if (trimmedStart.length === 0 || trimmedStart[0] === '#') continue;

            // Check for class definition
            if (trimmedStart.startsWith('class ')) {
                const classMatch = CLASS_REGEX.exec(line);
                if (classMatch) {
                    currentClassName = classMatch[1];
                    isCurrentClassTestClass = isTestClassFromLine(currentClassName, line);

                    if (!isCurrentClassTestClass) {
                        continue;
                    }

                    const dottedPath = `${fileDottedPath}.${currentClassName}`;
                    const range = new vscode.Range(i, 0, i, lineLength);

                    codeLenses.push(new vscode.CodeLens(range, {
                        title: '$(play) Run Test Class',
                        command: 'django-test-manager.runTest',
                        arguments: [{
                            name: currentClassName,
                            type: 'class',
                            dottedPath: dottedPath,
                            uri: document.uri
                        }]
                    }));

                    codeLenses.push(new vscode.CodeLens(range, {
                        title: '$(debug-alt) Debug Test Class',
                        command: 'django-test-manager.debugTest',
                        arguments: [{
                            name: currentClassName,
                            type: 'class',
                            dottedPath: dottedPath,
                            uri: document.uri
                        }]
                    }));
                }
                continue;
            }

            // Check for method definition (only if inside a test class)
            if (isCurrentClassTestClass && currentClassName &&
                (trimmedStart.startsWith('def ') || trimmedStart.startsWith('async def '))) {
                const methodMatch = methodRegex.exec(line);
                if (methodMatch) {
                    const methodName = methodMatch[1];
                    const dottedPath = `${fileDottedPath}.${currentClassName}.${methodName}`;
                    const range = new vscode.Range(i, 0, i, lineLength);

                    codeLenses.push(new vscode.CodeLens(range, {
                        title: '$(play) Run Test',
                        command: 'django-test-manager.runTest',
                        arguments: [{
                            name: methodName,
                            type: 'method',
                            dottedPath: dottedPath,
                            uri: document.uri
                        }]
                    }));

                    codeLenses.push(new vscode.CodeLens(range, {
                        title: '$(debug-alt) Debug Test',
                        command: 'django-test-manager.debugTest',
                        arguments: [{
                            name: methodName,
                            type: 'method',
                            dottedPath: dottedPath,
                            uri: document.uri
                        }]
                    }));

                    // Only check for diff if test has failed (avoid unnecessary map lookup)
                    const diff = stateManager.getDiff(dottedPath);
                    if (diff) {
                        codeLenses.push(new vscode.CodeLens(range, {
                            title: '$(diff) View Diff',
                            command: 'django-test-manager.viewDiff',
                            arguments: [{
                                name: methodName,
                                type: 'method',
                                dottedPath: dottedPath,
                                uri: document.uri
                            }]
                        }));
                    }
                }
            }
        }

        return codeLenses;
    }
}
