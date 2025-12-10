import * as vscode from 'vscode';

export class TestStateManager {
    private static instance: TestStateManager;
    private statuses: Map<string, 'pending' | 'passed' | 'failed' | 'skipped' | 'unknown'> = new Map();
    private failureMessages: Map<string, string> = new Map();

    private _onDidChangeStatus = new vscode.EventEmitter<void>();
    public readonly onDidChangeStatus = this._onDidChangeStatus.event;

    private constructor() { }

    public static getInstance(): TestStateManager {
        if (!TestStateManager.instance) {
            TestStateManager.instance = new TestStateManager();
        }
        return TestStateManager.instance;
    }

    public setStatus(dottedPath: string, status: 'pending' | 'passed' | 'failed' | 'skipped' | 'unknown') {
        this.statuses.set(dottedPath, status);
        this._onDidChangeStatus.fire();
    }

    public getStatus(dottedPath: string): 'pending' | 'passed' | 'failed' | 'skipped' | 'unknown' | undefined {
        return this.statuses.get(dottedPath);
    }

    public setFailureMessage(dottedPath: string, message: string) {
        this.failureMessages.set(dottedPath, message);
    }

    public getFailureMessage(dottedPath: string): string | undefined {
        return this.failureMessages.get(dottedPath);
    }

    public clear() {
        this.statuses.clear();
        this.failureMessages.clear();
        this.durations.clear();
        this._onDidChangeStatus.fire();
    }

    public getFailedTests(): string[] {
        const failed: string[] = [];
        this.statuses.forEach((status, path) => {
            if (status === 'failed') {
                failed.push(path);
            }
        });
        return failed;
    }

    public getAllKeys(): string[] {
        return Array.from(this.statuses.keys());
    }

    private durations: Map<string, number> = new Map();

    public setDuration(dottedPath: string, duration: number) {
        this.durations.set(dottedPath, duration);
    }

    public getDuration(dottedPath: string): number | undefined {
        return this.durations.get(dottedPath);
    }

    public getDurations(): Map<string, number> {
        return this.durations;
    }
}
