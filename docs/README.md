# Документация Welcome Image Extension

## Общее описание решения

Welcome Image Extension - это плагин для Visual Studio Code, который отображает пользовательское приветственное изображение при открытии проекта. Расширение предназначено для улучшения пользовательского опыта и создания уютной обстановки для разработчиков.

### Архитектура решения

Основные компоненты системы

1. Extension Activation Module

- **Файл**: `src/extension.ts`
- **Назначение**: Инициализация расширения
- **Ответственность**: Регистрация команд и - обработчиков событий
2. WebView Panel Manager

- **Компонент**: `vscode.WebviewPanel`
- **Назначение**: Отображение HTML контента
- **Особенности**: Поддержка локальных ресурсов
3. File System Handler

API: `fs` (Node.js)
- **Назначение**: Работа с файлами изображений
- **Функции**: Проверка существования, чтение файлов

4. Event Processing System

- **События**: `onDidChangeWorkspaceFolders`
- **Назначение**: Реакция на изменения workspace
- **Логика**: Автоматический показ при добавлении проектов

## Принцип работы:

**Последовательность выполнения:**

1. Активация расширения при запуске VS Code с workspace
2. Проверка наличия workspace folders
3. Валидация ресурсов изображения
4. Создание WebView панели
5. Генерация HTML контента
6. Отображение изображения
7. Автоматическое закрытие через 10 секунд

### Поток данных

1. **Входные данные**:

- Контекст расширения (`vscode.ExtensionContext`)
- Файл изображения (`media/welcome-image.png`)
- События workspace
2. **Выходные данные**:

- WebView панель с изображением
- Сообщения пользователю (ошибки, уведомления)
Обработка:
```
/// Основной поток выполнения
function activate(context: vscode.ExtensionContext) {
    // Регистрация команд расширения
    registerCommands(context);
    
    // Настройка обработчиков событий
    setupEventListeners(context);
    
    // Проверка начального состояния workspace
    checkInitialWorkspace(context);
}

/**
 * Регистрирует команды расширения в VS Code
 * @param {vscode.ExtensionContext} context - контекст расширения
 */
function registerCommands(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('my-welcome-image.showWelcome', () => {
        showWelcomeImage(context);
    });
    context.subscriptions.push(disposable);
}

/**
 * Настраивает обработчики событий workspace
 * @param {vscode.ExtensionContext} context - контекст расширения
 */
function setupEventListeners(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders((event) => {
            if (event.added.length > 0) {
                showWelcomeImage(context);
            }
        })
    );
}

/**
 * Проверяет начальное состояние workspace и показывает изображение при необходимости
 * @param {vscode.ExtensionContext} context - контекст расширения
 */
function checkInitialWorkspace(context: vscode.ExtensionContext) {
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        showWelcomeImage(context);
    }
}
}
```



## Технические особенности

### Используемые технологии и API

**1. TypeScript**

- **Версия**: 5.1.6+
- **Назначение**: Основной язык разработки
- **Конфигурация**: `tsconfig.json`


**2. VS Code Extension API**

- **Модули**: `vscode` namespace
- **Ключевые классы**:
>- `WebviewPanel`
>- `ExtensionContext`
>- `workspace`, `commands`, `window`

**3. Node.js APIs**

- **Модуль**: `fs` (File System)
- **Функции**: `existsSync()`, `path.join()`

**4. WebView Technology**

- **HTML/CSS**: Для отображения контента
- **Локальные ресурсы**: Поддержка через `asWebviewUri()`
 ## Ключевые возможности

**Автоматический показ**

- **Триггер**: Открытие workspace
- **Условие**: Наличие workspace folders
- **Время**: Мгновенно после активации

**Ручной вызов**

- **Команда**: `my-welcome-image.showWelcome`
- **Палитра**: Ctrl+Shift+P → "Show Welcome Image"
- **Доступность**: Всегда активна

**Поддержка пользовательских изображений**

- **Формат**: PNG (рекомендуется)
- **Путь**: `media/welcome-image.png`
- **Проверка**: Валидация существования файла

**Автоматическое закрытие**

- **Время**: 10000 мс (10 секунд)
- **Метод**: `setTimeout()` + `panel.dispose()`
- **Настраиваемость**: Фиксированное значение

**Адаптивный дизайн**

- **CSS**: Адаптивные единицы измерения
- **Разметка**: Flexbox для центрирования
- **Темы**: Поддержка CSS переменных VS Code

**Поддержка тем VS Code**

- **Цвета**: `var(--vscode-editor-background)`
- **Шрифты**: `var(--vscode-font-family)`
- **Совместимость**: Light/Dark темы


## Описание ключевых файлов:

### `src/extension.ts`

- **Тип**: TypeScript исходный код
- **Назначение**: Основная логика расширения
- **Экспорты**: `activate()`, `deactivate()`

### `media/welcome-image.png`

- **Тип**: Графический ресурс
- **Назначение**: Приветственное изображение
- **Требования**: Должен существовать для работы расширения


### `package.json`

- **Тип**: Manifest файл
- **Назначение**: Конфигурация расширения VS Code
- **Ключевые секции**: `activationEvents`, `commands`, `contributes`


## Конфигурация

### Настройки package.json 

Секция `activationEvents`:
```
{
  "activationEvents": [
    "workspaceContains:**/*"
  ]
}
```
- **Назначение**: Определяет условия активации расширения
- **Значение**: Активация при наличии любого файла в workspace

Секция `commands`:
```
{
  "commands": [
    {
      "command": "my-welcome-image.showWelcome",
      "title": "Show Welcome Image"
    }
  ]
}
```
- **command**: Идентификатор команды
- **title**: Отображаемое название в палитре команд

Секция `engines`:
```
{
  "engines": {
    "vscode": "^1.60.0"
  }
}
```
- vscode: Минимальная версия VS Code

## Требования к изображению

### **Технические характеристики:**

- **Формат**: PNG (рекомендуется), JPEG, GIF
- **Размер**: до 1920x1080px (оптимально)
- **Размер файла**: до 5MB (рекомендуется)
### **Расположение и именование:**

- **Папка**: `media/` (в корне расширения)
- **Имя файла**: `welcome-image.png`
- **Путь**: `context.extensionPath + '/media/welcome-image.png'`
### **Рекомендации по дизайну:**

- **Соотношение сторон**: 16:9 или 4:3
- **Разрешение**: 72-150 DPI
- **Цветовая схема**: Совместимость с темами VS Code

## Система валидации

### **Проверка существования изображения:**
```
const imagePath = path.join(context.extensionPath, 'media', 'welcome-image.png');
    
if (!fs.existsSync(imagePath)) {
    vscode.window.showWarningMessage(
        'Welcome image not found! Please add welcome-image.png to media folder.'
    );
    return;
}
```
 **Обработка сценариев:**

- Изображение отсутствует → Предупреждение пользователю
- Workspace не определен → Ожидание события добавления
- Ошибка создания WebView → Безопасное завершение

## **Система уведомлений**

**Типы сообщений:**

- Warning: Отсутствует файл изображения
- Information: Успешная активация (console.log)
- Error: Критические ошибки выполнения

**Методы отображения:**

- `vscode.window.showWarningMessage() `- для предупреждений
- `console.log()` - для отладочной информации
- `vscode.window.showErrorMessage()` - для ошибок

## **Обработка событий workspace**

**Подписка на события:**

```
context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders((event) => {
        if (event.added.length > 0) {
            showWelcomeImage(context);
        }
    })
);
```
**Логика обработки:**

- **event.added**: Новые workspace folders
- **event.removed**: Удаленные workspace folders
- **Условие**: Только при добавлении новых projects


## **Оптимизации**

**Эффективное управление ресурсами:**

- **Таймеры**: Автоматическая очистка при `dispose()`
- **Панели**: Единовременно только одна активная панель
- **Подписки**: Правильная регистрация в `context.subscriptions`


**Минимизация нагрузки:**

- **Ленивая загрузка**: Ресурсы загружаются только при необходимости
- **Кэширование**: Пути вычисляются один раз за сессию
- **Очистка**: Автоматическое освобождение ресурсов


## **Безопасность**

### **Меры безопасности**

**Sandbox окружение:**

- **WebView**: Изолированная среда выполнения
- **Скрипты**: Ограниченные возможности (`enableScripts: true`)
- **Ресурсы**: Только локальные файлы расширения
Ограничения доступа:
```
localResourceRoots: [
    vscode.Uri.file(path.join(context.extensionPath, 'media'))
]
```
- Разрешенные пути: Только папка media/
- Запрещено: Сетевые запросы, доступ к файловой системе

**Валидация входных данных:**

- **Проверка путей**: Корректность формирования путей к файлам
- **Существование файлов**: Предотвращение ошибок файловой системы
- **Типы данных**: TypeScript strict mode проверки

## Отладка и разработка

### **Настройка среды разработки**

**Предварительные требования:**

- Node.js: 16.x или выше
- VS Code: 1.60.0 или выше
- TypeScript: 5.1.6 или выше
 
**Установка зависимостей:**
```
# Клонирование репозитория
git clone <repository-url>
cd my-welcome-image

# Установка зависимостей
npm install

# Компиляция TypeScript
npm run compile
```
### **Команды разработки**

**Базовые команды:**
```
npm run compile          # Компиляция TypeScript
npm run watch           # Режим наблюдения за изменениями
npm run vscode:prepublish # Подготовка к публикации
```
**Отладка**
```
# Запуск расширения в режиме отладки
# 1. Нажмите F5 в VS Code
# 2. Выберите "Extension Development"
# 3. Откроется новое окно с расширением
```
*Документация создана в рамках лабораторной работы №3*

*Автор: Радикульцева Виктория, группа М3105*