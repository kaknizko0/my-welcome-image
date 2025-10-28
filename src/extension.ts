import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    console.log('Welcome Image extension is now active!');

    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        showWelcomeImage(context);
    }

    context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders((event) => {
            if (event.added.length > 0) {
                showWelcomeImage(context);
            }
        })
    );

    let disposable = vscode.commands.registerCommand('my-welcome-image.showWelcome', () => {
        showWelcomeImage(context);
    });
    context.subscriptions.push(disposable);
}

function showWelcomeImage(context: vscode.ExtensionContext) {
    const imagePath = path.join(context.extensionPath, 'media', 'welcome-image.png');
    
    if (!fs.existsSync(imagePath)) {
        vscode.window.showWarningMessage('Welcome image not found! Please add welcome-image.png to media folder.');
        return;
    }

    const panel = vscode.window.createWebviewPanel(
        'welcomeImage',
        'Добро пожаловать!',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(context.extensionPath, 'media'))
            ]
        }
    );

    const imageUri = panel.webview.asWebviewUri(vscode.Uri.file(imagePath));
    
    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: var(--vscode-editor-background);
                    font-family: var(--vscode-font-family);
                }
                .container {
                    text-align: center;
                    max-width: 90%;
                }
                img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                }
                .caption {
                    margin-top: 20px;
                    color: var(--vscode-foreground);
                    font-size: 14px;
                }
                .close-btn {
                    margin-top: 15px;
                    padding: 8px 16px;
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="${imageUri}" alt="Welcome Image">
                <div class="caption">Добро пожаловать в проект!</div>
                <button class="close-btn" onclick="closePanel()">Закрыть</button>
            </div>
            <script>
                function closePanel() {
                    // Панель закроется при dispose()
                }
            </script>
        </body>
        </html>
    `;

    setTimeout(() => {
        panel.dispose();
    }, 10000);
}

export function deactivate() {}