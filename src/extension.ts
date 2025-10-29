import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Активирует расширение Welcome Image при загрузке VS Code
 * Регистрирует команды и обработчики событий для отображения приветственного изображения
 * @param {vscode.ExtensionContext} context - Контекст расширения VS Code
 * @example
 * // Автоматически вызывается VS Code при активации расширения
 * activate(context);
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Welcome Image extension is now active!');

    // Показать изображение при открытии workspace
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        showWelcomeImage(context);
    }

    // Подписка на изменение workspace folders
    context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders((event) => {
            if (event.added.length > 0) {
                showWelcomeImage(context);
            }
        })
    );

    // Регистрация команды для ручного показа изображения
    let disposable = vscode.commands.registerCommand('my-welcome-image.showWelcome', () => {
        showWelcomeImage(context);
    });
    context.subscriptions.push(disposable);
}

/**
 * Отображает приветственное изображение в WebView панели
 * Создает панель с изображением и автоматически закрывает её через 10 секунд
 * @param {vscode.ExtensionContext} context - Контекст расширения VS Code
 * @example
 * // Автоматический вызов при открытии проекта
 * showWelcomeImage(context);
 * 
 * // Ручной вызов через командную палитру
 * vscode.commands.executeCommand('my-welcome-image.showWelcome');
 */
function showWelcomeImage(context: vscode.ExtensionContext) {
    const imagePath = path.join(context.extensionPath, 'media', 'welcome-image.png');
    
    // Проверка существования файла изображения
    if (!fs.existsSync(imagePath)) {
        vscode.window.showWarningMessage('Welcome image not found! Please add welcome-image.png to media folder.');
        return;
    }

    // Создание WebView панели
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

    // Конвертация пути к изображению для WebView
    const imageUri = panel.webview.asWebviewUri(vscode.Uri.file(imagePath));
    
    // Установка HTML контента для панели
    panel.webview.html = getWebviewContent(imageUri);

    // Автоматическое закрытие панели через 10 секунд
    setTimeout(() => {
        panel.dispose();
    }, 10000);
}

/**
 * Генерирует HTML контент для WebView панели
 * @param {vscode.Uri} imageUri - URI изображения для отображения
 * @returns {string} HTML строка с разметкой панели
 * @example
 * const html = getWebviewContent(imageUri);
 * panel.webview.html = html;
 */
function getWebviewContent(imageUri: vscode.Uri): string {
    return `
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
            </div>
            <script>
                function closePanel() {
                    // Функция для закрытия панели (может быть расширена)
                }
            </script>
        </body>
        </html>
    `;
}

/**
 * Деактивирует расширение при закрытии VS Code
 * Выполняет очистку ресурсов при необходимости
 * @example
 * // Автоматически вызывается VS Code при деактивации расширения
 * deactivate();
 */
export function deactivate() {}