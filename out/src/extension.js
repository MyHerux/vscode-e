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
    // Get settings
    //let settings = workspace.getConfiguration().get("tomatoTimer");
    let shortToLongTime = 3;
    let timerStart = vscode_1.commands.registerCommand('pomodoro.start', () => {
        vscode_1.window
            .showQuickPick(['1 minutes', '2 minutes', '3 minutes', '4 minutes'])
            .then((time) => {
            console.log('time:' + time);
            if (typeof time == 'undefined') {
                return false;
            }
            let timePomo = parseInt(time);
            vscode_1.window.showInformationMessage('Pomodoro start with ' + time + '!');
            let pomodoro = new Pomodoro(Status.pomodoro, timePomo * 60, shortToLongTime);
            let pomodoroController = new PomodoroController(pomodoro);
        });
    });
    context.subscriptions.push(timerStart);
}
exports.activate = activate;
var Status;
(function (Status) {
    Status["pomodoro"] = "pomodoro";
    Status["shortBreak"] = "shortBreak";
    Status["longBreak"] = "longBreak";
})(Status || (Status = {}));
class PomodoroController {
    constructor(pompdoro) {
        this._pompdoro = pompdoro;
        this._statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 0);
        this._statusBarItem.command = 'timer.start';
        this._statusBarItem.tooltip = 'Click to start a pomodoro';
        this._statusBarItem.show();
        this._interval = setInterval(() => this.refreshUI(), 1000);
        this.refreshUI();
    }
    dispose() {
        this._statusBarItem.dispose();
        clearInterval(this._interval);
    }
    refreshUI() {
        let text = this._pompdoro.timer();
        if (text) {
            this._statusBarItem.text = text;
            this._statusBarItem.command = 'timer.cancel';
            this._statusBarItem.tooltip = 'Cancel';
            if (this._pompdoro.isStatusChange()) {
                console.log("status:", this._pompdoro.isStatusChange());
                vscode_1.window
                    .showInformationMessage('Pomodoro Process: ' + this._pompdoro
                    .getStatus()
                    .toUpperCase());
            }
        }
        else {
            this.dispose();
        }
    }
}
class Pomodoro {
    constructor(status, time, shortToLongTime) {
        this._status = status;
        this._time = time;
        this._remainTime = time;
        this._shortToLongTime = shortToLongTime - 1;
        this._breakTime = shortToLongTime - 1;
        this._statusChange = false;
    }
    isPomodoro() {
        return Status.pomodoro == this._status;
    }
    getStatus() {
        return this._status;
    }
    isStatusChange() {
        return this._statusChange;
    }
    action() {
        if (this._remainTime < 0) {
            if (this.isPomodoro()) {
                if (this._breakTime > 0) {
                    this._status = Status.shortBreak;
                    this._remainTime = 5 * 60;
                    this._breakTime--;
                }
                else if (this._breakTime == 0) {
                    this._status = Status.longBreak;
                    this._remainTime = 10 * 60;
                    this._breakTime = this._shortToLongTime;
                }
            }
            else {
                this._status = Status.pomodoro;
                this._remainTime = this._time;
            }
            this._statusChange = true;
        }
        else
            this._statusChange = false;
        return this;
    }
    timer() {
        this.action();
        this._remainTime--;
        let text = this._remainTime + "";
        return this._status.toUpperCase() + ' in ' + text;
    }
}
//# sourceMappingURL=extension.js.map