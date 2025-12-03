import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { TestStateManager } from './testStateManager';

export interface TestNode {
    name: string;
    type: 'app' | 'folder' | 'file' | 'class' | 'method';
    children?: TestNode[];
    uri?: vscode.Uri;
    range?: vscode.Range;
    dottedPath?: string;
    status?: 'pending' | 'passed' | 'failed' | 'skipped' | 'unknown';
    parent?: TestNode;
}

export class TestDiscovery {
    constructor(private workspaceRoot: string) { }

    async discover(): Promise<TestNode[]> {
        const tests: TestNode[] = [];
        // Find all python files that might contain tests
        const config = vscode.workspace.getConfiguration('djangoTestManager');
        const filePattern = config.get<string>('testFilePattern') || '**/*test*.py';
        const pattern = new vscode.RelativePattern(this.workspaceRoot, filePattern);
        const excludePattern = '**/{node_modules,venv,.venv,env,.env}/**';
        const files = await vscode.workspace.findFiles(pattern, excludePattern);

        if (files.length === 0) {
            vscode.window.showInformationMessage('No Django tests found. Make sure your test files match the pattern *test*.py');
        }

        // Parallel processing of files
        const filePromises = files.map(file => this.parseFile(file));
        const results = await Promise.all(filePromises);

        for (const fileTests of results) {
            if (fileTests) {
                tests.push(fileTests);
            }
        }

        return this.structureTests(tests);
    }

    public async parseFile(uri: vscode.Uri): Promise<TestNode | null> {
        try {
            const content = (await vscode.workspace.fs.readFile(uri)).toString();
            const lines = content.split('\n');

            // Regex to capture class name and inherited class
            const classRegex = /^class\s+(\w+)(?:\(([^)]+)\))?/;
            const config = vscode.workspace.getConfiguration('djangoTestManager');
            const methodPrefix = config.get<string>('testMethodPattern') || 'test_';
            // Pre-compile regex if possible, but it depends on config which might change. 
            // Creating new RegExp is cheap enough for per-file.
            const methodRegex = new RegExp(`^\\s+def\\s+(${methodPrefix}\\w+)`);

            const relativePath = path.relative(this.workspaceRoot, uri.fsPath);
            const fileDottedPath = relativePath.replace(/\.py$/, '').replace(new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g'), '.');

            const fileNode: TestNode = {
                name: path.basename(uri.fsPath),
                type: 'file',
                uri: uri,
                children: [],
                dottedPath: fileDottedPath
            };

            let currentClass: TestNode | null = null;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                // Optimization: check start of string before running regex
                const trimmed = line.trimStart();
                if (trimmed.startsWith('class ')) {
                    const classMatch = line.match(classRegex);
                    if (classMatch) {
                        const className = classMatch[1];
                        currentClass = {
                            name: className,
                            type: 'class',
                            children: [],
                            uri: uri,
                            range: new vscode.Range(i, 0, i, line.length),
                            dottedPath: `${fileDottedPath}.${className}`,
                            parent: fileNode
                        };
                        fileNode.children?.push(currentClass);
                        continue;
                    }
                }

                if (trimmed.startsWith('def ') && currentClass) {
                    const methodMatch = line.match(methodRegex);
                    if (methodMatch) {
                        const methodName = methodMatch[1];
                        currentClass.children?.push({
                            name: methodName,
                            type: 'method',
                            uri: uri,
                            range: new vscode.Range(i, 0, i, line.length),
                            dottedPath: `${currentClass.dottedPath}.${methodName}`,
                            parent: currentClass
                        });
                    }
                }
            }

            return fileNode.children && fileNode.children.length > 0 ? fileNode : null;
        } catch (e) {
            console.error(`Error parsing file ${uri.fsPath}:`, e);
            return null;
        }
    }

    private structureTests(nodes: TestNode[]): TestNode[] {
        const rootNodes: TestNode[] = [];

        for (const node of nodes) {
            if (!node.uri) { continue; }

            const relativePath = path.relative(this.workspaceRoot, node.uri.fsPath);
            const parts = relativePath.split(path.sep);

            let currentLevel = rootNodes;
            let currentPath = '';
            let parentNode: TestNode | undefined = undefined;

            // Iterate over directories (exclude filename)
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                currentPath = currentPath ? path.join(currentPath, part) : part;

                let folderNode = currentLevel.find(n => n.name === part && n.type === 'folder');

                if (!folderNode) {
                    // Double check if it really doesn't exist (paranoid check against race conditions or duplicates)
                    const existing = currentLevel.find(n => n.name === part && n.type === 'folder');
                    if (existing) {
                        folderNode = existing;
                    } else {
                        folderNode = {
                            name: part,
                            type: 'folder',
                            children: [],
                            uri: vscode.Uri.file(path.join(this.workspaceRoot, currentPath)),
                            dottedPath: currentPath.replace(new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g'), '.'),
                            parent: parentNode
                        };
                        currentLevel.push(folderNode);
                    }
                }

                if (!folderNode.children) {
                    folderNode.children = [];
                }
                currentLevel = folderNode.children;
                parentNode = folderNode;
            }

            node.parent = parentNode;
            currentLevel.push(node);

            // Register discovered node in state manager if not already there
            if (node.dottedPath) {
                const stateManager = TestStateManager.getInstance();
                if (!stateManager.getStatus(node.dottedPath)) {
                    stateManager.setStatus(node.dottedPath, 'unknown');
                }
            }
        }

        // Sort nodes recursively
        this.sortNodes(rootNodes);
        return rootNodes;
    }

    private sortNodes(nodes: TestNode[]) {
        nodes.sort((a, b) => {
            // Folders first, then files
            if (a.type === 'folder' && b.type !== 'folder') return -1;
            if (a.type !== 'folder' && b.type === 'folder') return 1;
            return a.name.localeCompare(b.name);
        });

        nodes.forEach(node => {
            if (node.children) {
                this.sortNodes(node.children);
            }
        });
    }

    public getNodeByDottedPath(dottedPath: string): TestNode | undefined {
        // we might need to rely on the caller to have the nodes or re-discover.
        // However, TestDiscovery doesn't store state.
        // Let's rely on TestTreeDataProvider to pass the root nodes.
        return undefined;
    }
}
