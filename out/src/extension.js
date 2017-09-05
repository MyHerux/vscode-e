'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "x" is now active!');
    // create a new word counter
    let wordCounter = new WordCounter();
    let disposable = vscode_1.commands.registerCommand('extension.sayHello', () => {
        wordCounter.updateWordCount();
    });
    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(wordCounter);
    context.subscriptions.push(disposable);
}
exports.activate = activate;
class WordCounter {
    updateWordCount() {
        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
        }
        // Get the current text editor
        let editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        let doc = editor.document;
        let wordCount = this._getWordCount(doc);
        // Update the status bar
        this._statusBarItem.text = wordCount !== 1 ? `${wordCount} Words` : '1 Word';
        this._statusBarItem.show();
    }
    _getWordCount(doc) {
        let docContent = doc.getText();
        // Parse out unwanted whitespace so the split is accurate
        docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
        docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        let wordCount = 0;
        if (docContent != "") {
            wordCount = docContent.split(" ").length;
        }
        return wordCount;
    }
    dispose() {
        this._statusBarItem.dispose();
    }
}
class WordCounterController {
    constructor(wordCounter) {
        this._wordCounter = wordCounter;
        this._wordCounter.updateWordCount();
        // subscribe to selection change and editor activation events
        let subscriptions = [];
        vscode_1.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode_1.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        // create a combined disposable from both event subscriptions
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    _onEvent() {
        this._wordCounter.updateWordCount();
    }
    dispose() {
        this._disposable.dispose();
    }
}
//# sourceMappingURL=extension.js.map