import * as vscode from 'vscode';
import { TestStateManager } from './testStateManager';

export class TestStatusBar {
    private statusBarItem: vscode.StatusBarItem;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10);
        this.statusBarItem.command = 'django-test-manager.runFailedTests';
        this.update();

        TestStateManager.getInstance().onDidChangeStatus(() => {
            this.update();
        });
    }

    public update() {
        const stateManager = TestStateManager.getInstance();
        const allKeys = stateManager.getAllKeys();

        let passed = 0;
        let failed = 0;
        let skipped = 0;
        let pending = 0;

        allKeys.forEach(key => {
            const status = stateManager.getStatus(key);
            if (status === 'passed') passed++;
            else if (status === 'failed') failed++;
            else if (status === 'skipped') skipped++;
            else if (status === 'pending') pending++;
        });

        if (passed === 0 && failed === 0 && skipped === 0 && pending === 0) {
            this.statusBarItem.hide();
            return;
        }

        const parts: string[] = [];
        if (failed > 0) {
            parts.push(`$(error) ${failed}`);
            this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        } else if (pending > 0) {
            this.statusBarItem.backgroundColor = undefined;
            parts.push(`$(sync~spin) Running...`);
        } else {
            this.statusBarItem.backgroundColor = undefined;
        }

        if (passed > 0) parts.push(`$(check) ${passed}`);
        if (skipped > 0) parts.push(`$(dash) ${skipped}`);

        this.statusBarItem.text = `Django Tests: ${parts.join(' ')}`;
        this.statusBarItem.show();
    }

    public dispose() {
        this.statusBarItem.dispose();
    }
}
