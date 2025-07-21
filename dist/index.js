"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Janken = exports.GamePhase = exports.JankenEvent = exports.Result = exports.Hand = void 0;
var Hand;
(function (Hand) {
    Hand["GU"] = "GU";
    Hand["CHOKI"] = "CHOKI";
    Hand["PA"] = "PA";
})(Hand || (exports.Hand = Hand = {}));
var Result;
(function (Result) {
    Result["P1_WIN"] = "P1_WIN";
    Result["P2_WIN"] = "P2_WIN";
    Result["DRAW"] = "DRAW";
})(Result || (exports.Result = Result = {}));
var JankenEvent;
(function (JankenEvent) {
    JankenEvent["BeforeRound"] = "beforeRound";
    JankenEvent["AfterRound"] = "afterRound";
    JankenEvent["Reset"] = "reset";
    JankenEvent["HandsNotSet"] = "handsNotSet";
})(JankenEvent || (exports.JankenEvent = JankenEvent = {}));
var GamePhase;
(function (GamePhase) {
    GamePhase["Ready"] = "READY";
    GamePhase["Playing"] = "PLAYING";
    GamePhase["RoundEnd"] = "ROUND_END";
})(GamePhase || (exports.GamePhase = GamePhase = {}));
class Janken {
    constructor() {
        this._listeners = {};
        this._currentPhase = GamePhase.Ready;
        this.player1Hand = null;
        this.player2Hand = null;
        this.lastResult = null;
    }
    on(eventName, listener) {
        if (!this._listeners[eventName]) {
            this._listeners[eventName] = [];
        }
        this._listeners[eventName].push(listener);
    }
    off(eventName, listener) {
        if (!this._listeners[eventName]) {
            return;
        }
        this._listeners[eventName] = this._listeners[eventName].filter((l) => l !== listener);
    }
    emit(eventName, ...args) {
        if (!this._listeners[eventName]) {
            return;
        }
        this._listeners[eventName].forEach((listener) => {
            listener(...args);
        });
    }
    playRound() {
        this.emit(JankenEvent.BeforeRound);
        if (this.player1Hand === null || this.player2Hand === null) {
            this.emit(JankenEvent.HandsNotSet);
            return null; // 両方の手が出されていない場合は判定できない
        }
        let currentResult;
        if (this.player1Hand === this.player2Hand) {
            currentResult = Result.DRAW;
        }
        else if ((this.player1Hand === Hand.GU && this.player2Hand === Hand.CHOKI) ||
            (this.player1Hand === Hand.CHOKI && this.player2Hand === Hand.PA) ||
            (this.player1Hand === Hand.PA && this.player2Hand === Hand.GU)) {
            currentResult = Result.P1_WIN;
        }
        else {
            currentResult = Result.P2_WIN;
        }
        this.lastResult = currentResult;
        this.emit(JankenEvent.AfterRound, currentResult);
        this._currentPhase = GamePhase.RoundEnd;
        return { result: currentResult };
    }
    setPlayer1Hand(hand) {
        this.player1Hand = hand;
        if (this.player1Hand !== null && this.player2Hand !== null) {
            this._currentPhase = GamePhase.Playing;
        }
    }
    setPlayer2Hand(hand) {
        this.player2Hand = hand;
        if (this.player1Hand !== null && this.player2Hand !== null) {
            this._currentPhase = GamePhase.Playing;
        }
    }
    getLastResult() {
        return this.lastResult;
    }
    reset() {
        this.lastResult = null;
        this.player1Hand = null;
        this.player2Hand = null;
        this._currentPhase = GamePhase.Ready;
        this.emit(JankenEvent.Reset);
    }
    getPlayer1Hand() {
        return this.player1Hand;
    }
    getPlayer2Hand() {
        return this.player2Hand;
    }
    getPhase() {
        return this._currentPhase;
    }
}
exports.Janken = Janken;
