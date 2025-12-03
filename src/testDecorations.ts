import * as vscode from 'vscode';
import { TestNode } from './testDiscovery';
import { TestStateManager } from './testStateManager';

export class TestDecorationProvider {
    private passedDecorationType: vscode.TextEditorDecorationType;
    private failedDecorationType: vscode.TextEditorDecorationType;
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor() {
        this.passedDecorationType = vscode.window.createTextEditorDecorationType({
            gutterIconPath: vscode.Uri.parse('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZmlsbD0iIzczYzQyNSIgZD0iTTggMTZBOCA4IDAgMSAwIDggMGE4IDggMCAwIDAgMCAxNnpNNyAxMS41bC0zLjUtMy41IDEuNS0xLjUgMiAyIDQtNCAxLjUgMS41LTUuNSA1LjV6Ii8+PC9zdmc+'),
            gutterIconSize: 'contain',
            overviewRulerColor: 'green',
            overviewRulerLane: vscode.OverviewRulerLane.Left
        });

        this.failedDecorationType = vscode.window.createTextEditorDecorationType({
            gutterIconPath: vscode.Uri.parse('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZmlsbD0iI2YxNGM0YyIgZD0iTTggMTZBOCA4IDAgMSAwIDggMGE4IDggMCAwIDAgMCAxNnpNOSA4bDMgMy0xIDEtMy0zLTMgMy0xLTEgMy0zLTMtMyAxLTEgMyAzIDMtMyAxIDEgMyAzLTF6Ii8+PC9zdmc+'),
            gutterIconSize: 'contain',
            overviewRulerColor: 'red',
            overviewRulerLane: vscode.OverviewRulerLane.Left
        });

        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('django-test-manager');
    }

    public updateDecorations(editor: vscode.TextEditor, nodes: TestNode[]) {
        const passedRanges: vscode.Range[] = [];
        const failedRanges: vscode.Range[] = [];
        const diagnostics: vscode.Diagnostic[] = [];

        const stateManager = TestStateManager.getInstance();

        const visit = (node: TestNode) => {
            if (node.uri && node.range && node.uri.toString() === editor.document.uri.toString()) {
                if (node.dottedPath) {
                    const status = stateManager.getStatus(node.dottedPath);
                    if (status === 'passed') {
                        passedRanges.push(node.range);
                    } else if (status === 'failed') {
                        failedRanges.push(node.range);

                        // Add diagnostic if we have failure details (stored in state manager ideally, but for now just generic)
                        // We will enhance TestStateManager to store failure messages later
                        const failureMsg = stateManager.getFailureMessage(node.dottedPath);
                        if (failureMsg) {
                            const diagnostic = new vscode.Diagnostic(
                                node.range,
                                failureMsg,
                                vscode.DiagnosticSeverity.Error
                            );
                            diagnostic.source = 'Django Test';
                            diagnostics.push(diagnostic);
                        }
                    }
                }
            }
            if (node.children) {
                node.children.forEach(visit);
            }
        };

        nodes.forEach(visit);

        editor.setDecorations(this.passedDecorationType, passedRanges);
        editor.setDecorations(this.failedDecorationType, failedRanges);
        this.diagnosticCollection.set(editor.document.uri, diagnostics);
    }

    public dispose() {
        this.passedDecorationType.dispose();
        this.failedDecorationType.dispose();
        this.diagnosticCollection.dispose();
    }
}
